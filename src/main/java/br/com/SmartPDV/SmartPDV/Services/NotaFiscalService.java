package br.com.SmartPDV.SmartPDV.Services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicIntegerArray;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.convert.Jsr310Converters.LocalDateTimeToDateConverter;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalItemRequest;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalRequest;
import br.com.SmartPDV.SmartPDV.Entities.Clientes;
import br.com.SmartPDV.SmartPDV.Entities.ExcecaoImposto;
import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscalItem;
import br.com.SmartPDV.SmartPDV.Entities.Produto;
import br.com.SmartPDV.SmartPDV.Entities.TransitoLoja;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Entities.Venda;
import br.com.SmartPDV.SmartPDV.Enum.PerfilVendedor;
import br.com.SmartPDV.SmartPDV.Enum.StatusNotaFiscal;
import br.com.SmartPDV.SmartPDV.Repository.ExcecaoImpostoRepository;
import br.com.SmartPDV.SmartPDV.Repository.LojaRepository;
import br.com.SmartPDV.SmartPDV.Repository.NotaFiscalRepository;
import br.com.SmartPDV.SmartPDV.Repository.NotaFiscalitemRepository;
import br.com.SmartPDV.SmartPDV.Repository.ProdutoRepository;
import br.com.SmartPDV.SmartPDV.Repository.TransitoLojaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotaFiscalService {

	private final NotaFiscalRepository notaFiscalRepo;
	private final NotaFiscalItemService notaFiscalItemService;
	private final TransitoLojaRepository transitoRepository;
	private final LojaRepository loja;

	@Transactional
	public void emitirNotaDeVenda(Venda venda, List<ItemVenda> itens) {

		NotaFiscal notaEmissao = new NotaFiscal((long) 0, 65, (long) 0, 5102, venda.getCliente(),
				venda.getCliente().getCpfCnpj(), venda.getLoja(), 0.0, null, null, null, venda, LocalDateTime.now(),
				StatusNotaFiscal.PENDENTE);
		geraNumeroFiscal(notaEmissao);
		realizaCalculo(notaEmissao, itens);
	}

	public void emitirNotaAvulsa(NotaFiscalRequest notaItem) {
		UsuariosLoja usuario = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if ((notaItem.getCfop() == 5152 || notaItem.getCfop() == 6152)
				&& usuario.getPerfil() != PerfilVendedor.MATRIZ) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, " Apenas a matriz pode emitir com essa CFOP");
		}
		Loja loja = this.loja.findById(notaItem.getId_Loja())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

		NotaFiscal nota = new NotaFiscal(null, notaItem.getSerieNfe(), null, notaItem.getCfop(), null, null, loja, null,
				null, null, null, null, LocalDateTime.now(), StatusNotaFiscal.PENDENTE);
		geraNumeroFiscal(nota);
		this.notaFiscalRepo.save(nota);
		if (notaItem.getCfop() == 5152 || notaItem.getCfop() == 6152) {
			this.transitoRepository
					.save(new TransitoLoja(usuario.getLojaVinculada(), usuario.getLojaVinculada().getRazaoSocial(),
							loja, loja.getRazaoSocial(), nota, nota.getNfNumero(), LocalDateTime.now(), null));
		}
		this.notaFiscalItemService.validacaoEPersistencia(notaItem.getCodigo_barra(), notaItem, nota);
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
		NotaFiscal sequential = this.notaFiscalRepo.findLastSequential(nota.getLoja().getId(), nota.getSerieNf());
		if (sequential != null && sequential.getNfNumero() != null) {
			nota.setNfNumero(sequential.getNfNumero() + 1);
		} else {
			nota.setNfNumero((long) 1);
		}

	}
}
