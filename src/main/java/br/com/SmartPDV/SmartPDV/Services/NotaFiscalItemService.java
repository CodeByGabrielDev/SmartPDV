package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalItemRequest;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalRequest;
import br.com.SmartPDV.SmartPDV.Entities.ExcecaoImposto;
import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscalItem;
import br.com.SmartPDV.SmartPDV.Entities.Produto;
import br.com.SmartPDV.SmartPDV.Entities.Venda;
import br.com.SmartPDV.SmartPDV.Repository.ExcecaoImpostoRepository;
import br.com.SmartPDV.SmartPDV.Repository.LojaRepository;
import br.com.SmartPDV.SmartPDV.Repository.NotaFiscalRepository;
import br.com.SmartPDV.SmartPDV.Repository.NotaFiscalitemRepository;
import br.com.SmartPDV.SmartPDV.Repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotaFiscalItemService {

	private final ExcecaoImpostoRepository excecao;

	private final NotaFiscalitemRepository notaRepo;

	private final NotaFiscalImpostoItemService notaImpostoItem;

	private final NotaFiscalRepository notaFiscalRepo;
	private final ProdutoRepository prodRepository;
	private final ExcecaoImpostoRepository excecaoImpostoRepo;
	private final LojaRepository loja;

	@Transactional
	public void inserirItensFiscais(List<ItemVenda> itensVenda, NotaFiscal notaFiscal) {

		List<NotaFiscalItem> notas = new ArrayList<>();
		Integer interador = 0;
		for (ItemVenda i : itensVenda) {
			NotaFiscalItem notaItem = new NotaFiscalItem(notaFiscal, notaFiscal.getSerieNf(), i.getProduto(),
					interador++, i.getQtd(), i.getPorcentDesconto(), i.getLoja(),
					this.excecao.findExcecaoByCodFilialAndCfop(notaFiscal.getCfop(), notaFiscal.getLoja().getId()));
			notas.add(notaItem);

		}
		notaRepo.saveAll(notas);
		this.notaImpostoItem.calculaImposto(notas);
	}

	public void validacaoEPersistencia(List<NotaFiscalItemRequest> itens, NotaFiscalRequest notaItem,
			NotaFiscal notaEntity) {
		List<NotaFiscalItem> notaItemEntity = new ArrayList<>();
		for (NotaFiscalItemRequest nota : notaItem.getCodigo_barra()) {
			Produto prodFind = this.prodRepository.findByCodigoDeBarra(nota.getCodigo_barra());
			if (prodFind == null) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND,
						" Nao foi encontrado item com esse codigo de barra,valide!");
			}
			Loja loja = this.loja.findById(notaItem.getId_Loja()).orElseThrow(
					() -> new ResponseStatusException(HttpStatus.NOT_FOUND, " Loja nao encontrada na base de dados"));
			ExcecaoImposto exception = this.excecaoImpostoRepo.findExcecaoByCodFilialAndCfop(notaItem.getCfop(),
					notaItem.getId_Loja());
			if (exception == null) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Excecao nao encontrada");
			}
			notaItemEntity.add(new NotaFiscalItem(notaEntity, notaItem.getSerieNfe(), prodFind, null,
					nota.getQuantidade_Itens(), nota.getDesconto(), loja, exception));
		}
		this.notaRepo.saveAll(notaItemEntity);

		this.notaImpostoItem.calculaImposto(notaItemEntity);

	}
}
