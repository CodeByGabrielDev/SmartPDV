package br.com.SmartPDV.SmartPDV.Services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalItemRequest;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalRequest;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.NotaFiscalResponse;
import br.com.SmartPDV.SmartPDV.Entities.Clientes;
import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Entities.Pagamento;
import br.com.SmartPDV.SmartPDV.Entities.TransitoLoja;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Entities.Venda;
import br.com.SmartPDV.SmartPDV.Enum.PerfilVendedor;
import br.com.SmartPDV.SmartPDV.Enum.StatusNotaFiscal;
import br.com.SmartPDV.SmartPDV.Repository.ClienteRepository;
import br.com.SmartPDV.SmartPDV.Repository.LojaRepository;
import br.com.SmartPDV.SmartPDV.Repository.NotaFiscalRepository;
import br.com.SmartPDV.SmartPDV.Repository.PagamentoRepository;
import br.com.SmartPDV.SmartPDV.Repository.TransitoLojaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotaFiscalService {

	private final NotaFiscalRepository notaFiscalRepo;
	private final NotaFiscalItemService notaFiscalItemService;
	private final TransitoLojaRepository transitoRepository;
	private final LojaRepository loja;
	private final ClienteRepository clienteRepository;
	private final PagamentoRepository pagamentoRepository;

	@Transactional
	public void emitirNotaDeVenda(Venda venda, List<ItemVenda> itens, Pagamento pagamento) {

		NotaFiscal notaEmissao = new NotaFiscal((long) 0, 65, (long) 0, 5102, venda.getCliente(),
				venda.getCliente().getCpfCnpj(), venda.getLoja(), 0.0, null, null, null, venda, LocalDateTime.now(),
				StatusNotaFiscal.PENDENTE, verificaQtdItensNotaDeVenda(itens));
		geraNumeroFiscal(notaEmissao);
		realizaCalculo(notaEmissao, itens);
		pagamento.setNotaFiscal(notaEmissao);
		pagamento.setNumero_fiscal_venda(notaEmissao.getNfNumero());
		this.pagamentoRepository.save(pagamento);
	}

	public NotaFiscalResponse emitirNotaAvulsa(NotaFiscalRequest notaItem) {
		UsuariosLoja usuario = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		validarRequest(notaItem, usuario);

		boolean ehTransferencia = notaItem.getCfop().equals(5152) || notaItem.getCfop().equals(6152);

		NotaFiscal notaFiscal = ehTransferencia
				? criarNotaDeTransferencia(notaItem, usuario)
				: criarNotaComCliente(notaItem, usuario);

		geraNumeroFiscal(notaFiscal);
		this.notaFiscalRepo.save(notaFiscal);

		if (ehTransferencia) {
			registrarTransitoLoja(notaFiscal, usuario);
		}

		this.notaFiscalItemService.validacaoEPersistencia(notaItem, notaFiscal);

		return montarResponse(notaFiscal);
	}

	private void validarRequest(NotaFiscalRequest notaItem, UsuariosLoja usuario) {
		if (notaItem.getCfop() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CFOP não pode ser nulo");
		}
		if (notaItem.getSerieNfe() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"A nota deve conter obrigatoriamente uma série NF-e");
		}
		if ((notaItem.getCfop().equals(5152) || notaItem.getCfop().equals(6152))
				&& usuario.getPerfil() != PerfilVendedor.MATRIZ) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
					"Apenas a matriz pode emitir nota com CFOP de transferência");
		}
	}

	private NotaFiscal criarNotaDeTransferencia(NotaFiscalRequest notaItem, UsuariosLoja usuario) {
		Loja lojaDestino = buscarLojaDestino(notaItem.getIdLoja());

		return new NotaFiscal(
				null,
				notaItem.getSerieNfe(),
				null,
				notaItem.getCfop(),
				verificaQtdItensNotaAvulsa(notaItem),
				null,
				lojaDestino.getCnpj(),
				usuario.getLojaVinculada(),
				null, null, null, null, null,
				LocalDateTime.now(),
				StatusNotaFiscal.PENDENTE,
				lojaDestino);
	}

	private NotaFiscal criarNotaComCliente(NotaFiscalRequest notaItem, UsuariosLoja usuario) {
		Clientes cliente = buscarCliente(notaItem.getCpfCliente());

		return new NotaFiscal(
				null,
				notaItem.getSerieNfe(),
				null,
				notaItem.getCfop(),
				verificaQtdItensNotaAvulsa(notaItem),
				cliente,
				cliente.getCpfCnpj(),
				usuario.getLojaVinculada(),
				null, null, null, null, null,
				LocalDateTime.now(),
				StatusNotaFiscal.PENDENTE,
				null);
	}

	private Loja buscarLojaDestino(Long idLoja) {
		return this.loja.findById(idLoja)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
						"Loja de destino não encontrada"));
	}

	private Clientes buscarCliente(String cpfCnpj) {
		Clientes cliente = this.clienteRepository.selectByCpfOrCnpj(cpfCnpj);
		if (cliente == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"Cliente não encontrado, verifique o CPF/CNPJ informado");
		}
		return cliente;
	}

	private void registrarTransitoLoja(NotaFiscal notaFiscal, UsuariosLoja usuario) {
		Loja lojaDestino = notaFiscal.getLojaDestino();
		this.transitoRepository.save(new TransitoLoja(
				usuario.getLojaVinculada(),
				usuario.getLojaVinculada().getRazaoSocial(),
				lojaDestino,
				lojaDestino.getRazaoSocial(),
				notaFiscal,
				notaFiscal.getNfNumero(),
				LocalDateTime.now(),
				null));
	}

	private NotaFiscalResponse montarResponse(NotaFiscal notaFiscal) {
		Long ticket = notaFiscal.getVenda() != null ? notaFiscal.getVenda().getTicket() : null;
		return new NotaFiscalResponse(
				notaFiscal.getNfNumero(),
				notaFiscal.getSerieNf(),
				null,
				notaFiscal.getCfop(),
				notaFiscal.getCpfCliente(),
				notaFiscal.getLoja().getRazaoSocial(),
				notaFiscal.getDesconto(),
				notaFiscal.getValorTotalDeImpostoAPagar(),
				notaFiscal.getValorBrutoNota(),
				notaFiscal.getValorLiquidoNota(),
				ticket,
				notaFiscal.getDataEmissao(),
				notaFiscal.getStatusNota());
	}

	private Integer verificaQtdItensNotaAvulsa(NotaFiscalRequest notaItem) {
		Integer iteradorDeItens = 0;

		for (NotaFiscalItemRequest i : notaItem.getCodigo_barra()) {
			iteradorDeItens += i.getQuantidade_Itens();
		}
		return iteradorDeItens;
	}

	private Integer verificaQtdItensNotaDeVenda(List<ItemVenda> itens) {
		Integer iteradorDeItens = 0;

		for (ItemVenda i : itens) {
			iteradorDeItens += i.getQtd();
		}
		return iteradorDeItens;
	}

	private void realizaCalculo(NotaFiscal notaEmissao, List<ItemVenda> itens) {

		Double interadorDeDescontos = 0.0;
		Double interadorDeValoresLiquidos = 0.0;
		Double interadorDeValoresBrutos = 0.0;

		for (ItemVenda itensVenda : itens) {

			double valorBrutoItem = itensVenda.getValorUnitario() * itensVenda.getQtd();
			double descontoItem = valorBrutoItem * (itensVenda.getPorcentDesconto() / 100.0);
			double valorLiquidoItem = valorBrutoItem - descontoItem;

			interadorDeValoresBrutos += valorBrutoItem;
			interadorDeDescontos += descontoItem;
			interadorDeValoresLiquidos += valorLiquidoItem;
		}

		notaEmissao.setDesconto(interadorDeDescontos);
		notaEmissao.setValorLiquidoNota(interadorDeValoresLiquidos);
		notaEmissao.setValorBrutoNota(interadorDeValoresBrutos);

		this.notaFiscalRepo.save(notaEmissao);
		this.notaFiscalItemService.inserirItensFiscais(itens, notaEmissao);
	}

	private void geraNumeroFiscal(NotaFiscal nota) {
		List<NotaFiscal> sequential = this.notaFiscalRepo.findLastSequential(
				nota.getLoja().getId(),
				nota.getSerieNf(),
				PageRequest.of(0, 1));

		if (!sequential.isEmpty() && sequential.get(0).getNfNumero() != null) {
			nota.setNfNumero(sequential.get(0).getNfNumero() + 1);
		} else {
			nota.setNfNumero(1L);
		}
	}

	public List<NotaFiscalResponse> listarNotasEmitidasNaLoja() {
		UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		List<NotaFiscal> notasFiscais = this.notaFiscalRepo.findIssuedInvoices(usuariosLoja.getLojaVinculada().getId());
		List<NotaFiscalResponse> notasResponse = new ArrayList<>();
		for (NotaFiscal notaFiscal : notasFiscais) {
			if (notaFiscal.getVenda() != null) {
				notasResponse.add(new NotaFiscalResponse(notaFiscal.getNfNumero(), notaFiscal.getSerieNf(), null,
						notaFiscal.getCfop(),
						notaFiscal.getCpfCliente(), notaFiscal.getLoja().getRazaoSocial(), notaFiscal.getDesconto(),
						notaFiscal.getValorTotalDeImpostoAPagar(), notaFiscal.getValorBrutoNota(),
						notaFiscal.getValorLiquidoNota(), notaFiscal.getVenda().getTicket(),
						notaFiscal.getDataEmissao(),
						notaFiscal.getStatusNota()));
			} else {
				notasResponse.add(new NotaFiscalResponse(notaFiscal.getNfNumero(), notaFiscal.getSerieNf(), null,
						notaFiscal.getCfop(),
						notaFiscal.getCpfCliente(), notaFiscal.getLoja().getRazaoSocial(), notaFiscal.getDesconto(),
						notaFiscal.getValorTotalDeImpostoAPagar(), notaFiscal.getValorBrutoNota(),
						notaFiscal.getValorLiquidoNota(), null, notaFiscal.getDataEmissao(),
						notaFiscal.getStatusNota()));
			}
		}
		return notasResponse;
	}

}
