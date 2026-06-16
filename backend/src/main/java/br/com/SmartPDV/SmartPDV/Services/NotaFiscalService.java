package br.com.SmartPDV.SmartPDV.Services;

import br.com.SmartPDV.SmartPDV.Repository.EstoqueProdutoRepository;
import java.io.ObjectInputFilter.Status;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalItemRequest;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalRequest;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.NotaFiscalImpostoResponse;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.NotaFiscalItemResponse;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.NotaFiscalResponse;
import br.com.SmartPDV.SmartPDV.Entities.Clientes;
import br.com.SmartPDV.SmartPDV.Entities.EstoqueProduto;
import br.com.SmartPDV.SmartPDV.Entities.ExcecaoImposto;
import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscalImpostoItem;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscalItem;
import br.com.SmartPDV.SmartPDV.Entities.Pagamento;
import br.com.SmartPDV.SmartPDV.Entities.TransitoLoja;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Entities.Venda;
import br.com.SmartPDV.SmartPDV.Enum.PerfilVendedor;
import br.com.SmartPDV.SmartPDV.Enum.StatusNotaFiscal;
import br.com.SmartPDV.SmartPDV.Repository.ClienteRepository;
import br.com.SmartPDV.SmartPDV.Repository.ExcecaoImpostoRepository;
import br.com.SmartPDV.SmartPDV.Repository.LojaRepository;
import br.com.SmartPDV.SmartPDV.Repository.NotaFiscalRepository;
import br.com.SmartPDV.SmartPDV.Repository.PagamentoRepository;
import br.com.SmartPDV.SmartPDV.Repository.TransitoLojaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotaFiscalService {

	private final EstoqueProdutoRepository estoqueProdutoRepository;
	private final NotaFiscalRepository notaFiscalRepo;
	private final NotaFiscalItemService notaFiscalItemService;
	private final TransitoLojaRepository transitoRepository;
	private final LojaRepository loja;
	private final ClienteRepository clienteRepository;
	private final PagamentoRepository pagamentoRepository;
	private final ExcecaoImpostoRepository excecaoImpostoRepo;

	@Transactional
	public void emitirNotaDeVenda(Venda venda, List<ItemVenda> itens, Pagamento pagamento) {
		ExcecaoImposto excecaoImposto = this.excecaoImpostoRepo.findExcecaoByCodFilialAndCfop(5102,
				venda.getLoja().getId());
		if (excecaoImposto == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"Esta loja não possui exceção de imposto configurada para o CFOP 5102 (venda). Acesse Impostos e configure antes de realizar vendas.");
		}
		NotaFiscal notaEmissao = new NotaFiscal((long) 0, 65, (long) 0, 5102,
				venda.getCliente(),
				venda.getCliente() != null ? venda.getCliente().getCpfCnpj() : null,
				venda.getLoja(), 0.0, null, null, null, venda, LocalDateTime.now(),
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

		verificaExcecaoImposto(notaFiscal);
		geraNumeroFiscal(notaFiscal);
		this.notaFiscalRepo.save(notaFiscal);

		if (ehTransferencia) {
			registrarTransitoLoja(notaFiscal, usuario);
		}

		this.notaFiscalItemService.validacaoEPersistencia(notaItem, notaFiscal, usuario);

		return montarResponse(notaFiscal);
	}

	private void validarRequest(NotaFiscalRequest notaItem, UsuariosLoja usuario) {
		if (notaItem.getCfop() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"O campo CFOP é obrigatório para emissão de nota fiscal.");
		}
		if (notaItem.getSerieNfe() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"A série NF-e é obrigatória. Informe a série antes de prosseguir.");
		}
		if ((notaItem.getCfop().equals(5152) || notaItem.getCfop().equals(6152))
				&& usuario.getPerfil() != PerfilVendedor.MATRIZ
				&& usuario.getPerfil() != PerfilVendedor.ADMIN) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
					"Acesso negado. Somente a matriz ou administradores podem emitir notas com CFOP de transferência (5152/6152).");
		}
	}

	private ExcecaoImposto verificaExcecaoImposto(NotaFiscal notaEntity) {
		ExcecaoImposto excecaoImposto = this.excecaoImpostoRepo.findExcecaoByCodFilialAndCfop(notaEntity.getCfop(),
				notaEntity.getLoja().getId());
		if (excecaoImposto == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"Esta loja não possui exceção de imposto configurada para o CFOP " + notaEntity.getCfop()
							+ ". Acesse Impostos e configure antes de emitir notas.");
		}
		return excecaoImposto;
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
						"Loja de destino não encontrada. Verifique se o ID informado está correto."));
	}

	private Clientes buscarCliente(String cpfCnpj) {
		Clientes cliente = this.clienteRepository.selectByCpfOrCnpj(cpfCnpj);
		if (cliente == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"Cliente não encontrado para o CPF/CNPJ informado. Cadastre o cliente antes de emitir a nota.");
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

	private void validacoesDeCancelamentoDaNota(UsuariosLoja usuariosLoja, NotaFiscal notaFiscal,
			String motivoCancelamento) {
		if (!notaFiscal.getLoja().getId().equals(usuariosLoja.getLojaVinculada().getId())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
					" Não autorizado realizar cancelamento ou manipulação de dados de outras lojas");
		}
		if (notaFiscal.getStatusNota() != StatusNotaFiscal.AUTORIZADA) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					" A nota não esta autorizada para ser realizado o cancelamenot fiscal");
		}
		if (estourouOPrazoDaNota(notaFiscal)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					" A nota ja teve seu prazo de 24 Horas ultrapassados, realize a validação junto a sefaz para cancelamento extemporaneo");
		}
		if (motivoCancelamento == null) {
			throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE,
					" o motivo do cancelamento nao pode estar nulo");
		}
	}

	@Transactional
	public void cancelarNotaFiscal(Long idNotaFiscal, String motivoCancelamento) {
		UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();

		NotaFiscal notaFiscal = this.notaFiscalRepo.findById(idNotaFiscal)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
						" Nota fiscal não encontrada no banco de dados"));
		validacoesDeCancelamentoDaNota(usuariosLoja, notaFiscal, motivoCancelamento);
		atualizaCamposParaCancelados(notaFiscal, motivoCancelamento);
		estornarNotaFiscal(notaFiscal);
	}

	private void atualizaCamposParaCancelados(NotaFiscal notaFiscal, String motivoCancelamento) {
		notaFiscal.setStatusNota(StatusNotaFiscal.CANCELADA);
		notaFiscal.setMotivoCancelamento(motivoCancelamento);
		notaFiscal.setDataCancelamento(LocalDateTime.now());
		notaFiscal.setProtocoloCancelamento(UUID.randomUUID().toString());
		this.notaFiscalRepo.save(notaFiscal);
	}

	private boolean estourouOPrazoDaNota(NotaFiscal notaFiscal) {
		LocalDateTime dataDeAgora = LocalDateTime.now();

		long HorasCorridas = ChronoUnit.HOURS.between(notaFiscal.getDataEmissao(), dataDeAgora);

		if (HorasCorridas >= 24)
			return true;

		return false;

	}

	public void inutilizarNotaFiscal(Long idNotaFiscal) {
		UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();

		NotaFiscal notaFiscal = this.notaFiscalRepo.findById(idNotaFiscal)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
						" Nota fiscal não encontrada no banco de dados"));
		if (!notaFiscal.getLoja().getId().equals(usuariosLoja.getLojaVinculada().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE,
					" não é permitido realizar a inutilizacao de uma nota que nao pertence a sua loja");
		}
		if (notaFiscal.getStatusNota() != StatusNotaFiscal.PENDENTE) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					" não é possivel realizar a inutilizacao de uma nota NAO PENDENTE");
		}
		estornarNotaFiscal(notaFiscal);
	}

	private void estornarNotaFiscal(NotaFiscal notaFiscal) {
		for (NotaFiscalItem notaFiscalItem : notaFiscal.getItensFiscais()) {
			EstoqueProduto estoqueProduto = this.estoqueProdutoRepository.selectByCodigoBarra(
					notaFiscalItem.getProduto().getCodigoBarra(), notaFiscalItem.getLoja().getId());
			if (estoqueProduto == null) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, " Estoque não encontrado no banco");
			}
			estoqueProduto.setQtdAtual(estoqueProduto.getQtdAtual() + notaFiscalItem.getQuantidadeItens());
			this.estoqueProdutoRepository.save(estoqueProduto);

		}

	}

	public List<NotaFiscalResponse> listarNotasEmitidasNaLoja() {
		UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		Long idLoja = usuariosLoja.getLojaVinculada().getId();

		List<NotaFiscal> notasComItens = this.notaFiscalRepo.findIssuedInvoicesWithItens(idLoja);
		List<NotaFiscal> notasComImpostos = this.notaFiscalRepo.findIssuedInvoicesWithImpostos(idLoja);

		Map<Long, NotaFiscal> impostosMap = new java.util.HashMap<>();
		for (NotaFiscal n : notasComImpostos) {
			impostosMap.put(n.getId(), n);
		}

		List<NotaFiscalResponse> notasResponse = new ArrayList<>();
		for (NotaFiscal notaFiscal : notasComItens) {
			NotaFiscalResponse response = new NotaFiscalResponse(
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
					notaFiscal.getVenda() != null ? notaFiscal.getVenda().getTicket() : null,
					notaFiscal.getDataEmissao(),
					notaFiscal.getStatusNota());
			response.setId(notaFiscal.getId());

			List<NotaFiscalItemResponse> itensResponse = new ArrayList<>();
			for (NotaFiscalItem item : notaFiscal.getItensFiscais()) {
				itensResponse.add(new NotaFiscalItemResponse(
						item.getNumeroItem(),
						item.getProduto() != null ? item.getProduto().getDescricao() : "—",
						item.getProduto() != null ? item.getProduto().getCodigoBarra() : "—",
						item.getQuantidadeItens(),
						item.getValorBrutoItem(),
						item.getValorLiquidoItem(),
						item.getDesconto()));
			}
			response.setItens(itensResponse);

			List<NotaFiscalImpostoResponse> impostosResponse = new ArrayList<>();
			NotaFiscal notaComImposto = impostosMap.get(notaFiscal.getId());
			if (notaComImposto != null) {
				for (NotaFiscalImpostoItem imposto : notaComImposto.getNumero()) {
					impostosResponse.add(new NotaFiscalImpostoResponse(
							imposto.getTipo() != null ? imposto.getTipo().name() : "—",
							imposto.getBaseCalculo(),
							imposto.getAliquotaAplicada(),
							imposto.getReducaoBaseAplicada(),
							imposto.getValorImpostoCalculado()));
				}
			}
			response.setImpostos(impostosResponse);

			notasResponse.add(response);
		}
		return notasResponse;
	}

}
