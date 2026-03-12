package br.com.SmartPDV.SmartPDV.Services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.apache.catalina.connector.Response;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalItemRequest;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalRequest;
import br.com.SmartPDV.SmartPDV.Entities.Clientes;
import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscalImpostoItem;
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
	public void emitirNotaDeVenda(Venda venda, List<ItemVenda> itens,Pagamento pagamento) {

		NotaFiscal notaEmissao = new NotaFiscal((long) 0, 65, (long) 0, 5102, venda.getCliente(),
				venda.getCliente().getCpfCnpj(), venda.getLoja(), 0.0, null, null, null, venda, LocalDateTime.now(),
				StatusNotaFiscal.PENDENTE,verificaQtdItensNotaDeVenda(itens));
		geraNumeroFiscal(notaEmissao);
		realizaCalculo(notaEmissao, itens);
		pagamento.setNotaFiscal(notaEmissao);
		pagamento.setNumero_fiscal_venda(notaEmissao.getNfNumero());
		this.pagamentoRepository.save(pagamento);
	}

	public void emitirNotaAvulsa(NotaFiscalRequest notaItem) {

		UsuariosLoja usuario = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (notaItem.getCfop() == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Null pointer exception " + notaItem.getCfop());
		}
		if ((notaItem.getCfop().equals(5152) || notaItem.getCfop().equals(6152))
				&& usuario.getPerfil() != PerfilVendedor.MATRIZ) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, " Apenas a matriz pode emitir com essa CFOP");
		}
		if (notaItem.getSerieNfe() == null) {
			throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE,
					"A nota deve conter obrigatoriamente uma SERIENFE");
		}
		Loja loja = this.loja.findById(notaItem.getIdLoja())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
		Clientes cliente = this.clienteRepository.selectByCpfOrCnpj(notaItem.getCpfCliente());
		/*
		 * public NotaFiscal(Long nfNumero, Integer serieNf, Long chaveNfe, Integer
		 * cfop, Clientes cliente, String cpfCliente,
		 * Loja loja, Double desconto, Double valorTotalDeImpostoAPagar, Double
		 * valorBrutoNota,
		 * Double valorLiquidoNota, Venda venda, LocalDateTime dataEmissao,
		 * StatusNotaFiscal statusNota)
		 */
		NotaFiscal nota = new NotaFiscal(null, notaItem.getSerieNfe(), null, notaItem.getCfop(), null, null, loja, null,
				null, null, null, null, LocalDateTime.now(), StatusNotaFiscal.PENDENTE,
				verificaQtdItensNotaAvulsa(notaItem));
		geraNumeroFiscal(nota);
		this.notaFiscalRepo.save(nota);
		if (notaItem.getCfop() == 5152 || notaItem.getCfop() == 6152) {
			this.transitoRepository
					.save(new TransitoLoja(usuario.getLojaVinculada(), usuario.getLojaVinculada().getRazaoSocial(),
							loja, loja.getRazaoSocial(), nota, nota.getNfNumero(), LocalDateTime.now(), null));
		}

		this.notaFiscalItemService.validacaoEPersistencia(notaItem, nota);
	}

	private Integer verificaQtdItensNotaAvulsa(NotaFiscalRequest notaItem){
		Integer iteradorDeItens = 0;

		for(NotaFiscalItemRequest i:notaItem.getCodigo_barra()){
			iteradorDeItens += i.getQuantidade_Itens();
		}
		return iteradorDeItens;
	}

	private Integer verificaQtdItensNotaDeVenda(List<ItemVenda> itens){
		Integer iteradorDeItens = 0;

		for(ItemVenda i:itens){
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
}
