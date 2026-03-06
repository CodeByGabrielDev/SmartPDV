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

		/*
		 * public NotaFiscalItem(NotaFiscal nota, Integer serieNfe, Produto produto,
		 * Integer numeroItem,
		 * Integer quantidadeItens, Double valorBrutoItem, Double valorLiquidoItem,
		 * Double desconto, Loja loja,
		 * ExcecaoImposto excecaoImposto)
		 */
		for (ItemVenda i : itensVenda) {

			Produto produtoFind = this.prodRepository.findById(i.getProduto().getId())
					.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto nao encontrado"));
			NotaFiscalItem notaItem = new NotaFiscalItem(notaFiscal, 5102,
					produtoFind,
					interador, i.getQtd(),
					produtoFind.getPrecoVenda(), (i.getValorUnitario() * i.getQtd() * (i.getPorcentDesconto() / 100)),
					i.getPorcentDesconto(), i.getLoja(),
					this.excecaoImpostoRepo.findExcecaoByCodFilialAndCfop(notaFiscal.getCfop(),
							notaFiscal.getLoja().getId()));
			notas.add(notaItem);

		}
		notaRepo.saveAll(notas);
		this.notaImpostoItem.calculaImposto(notas);
	}

	@Transactional
	public void validacaoEPersistencia(NotaFiscalRequest notaItem,
			NotaFiscal notaEntity) {
		List<NotaFiscalItem> notaItemEntity = new ArrayList<>();
		Integer interador = 0;
		Loja loja = this.loja.findById(notaItem.getIdLoja()).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, " Loja nao encontrada na base de dados"));
		ExcecaoImposto exception = this.excecaoImpostoRepo.findExcecaoByCodFilialAndCfop(notaItem.getCfop(),
				notaItem.getIdLoja());
		if (exception == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Excecao nao encontrada");
		}
		for (NotaFiscalItemRequest nota : notaItem.getCodigo_barra()) {
			Produto prodFind = this.prodRepository.selectByCodigoDeBarra(nota.getCodigo_barra());
			System.out.println("Codigo Barra = " + nota.getCodigo_barra());

			if (prodFind == null) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND,
						" Nao foi encontrado item com esse codigo de barra,valide!");
			}

			notaItemEntity.add(new NotaFiscalItem(notaEntity, notaEntity.getSerieNf(), prodFind, interador++,
					nota.getQuantidade_Itens(),
					prodFind.getPrecoVenda(),
					(prodFind.getPrecoVenda() * nota.getQuantidade_Itens() * (nota.getDesconto() / 100)),
					nota.getDesconto(), loja, exception));

		}
		Double totalBrutoNota = 0.0;
		for (NotaFiscalItem n : notaItemEntity) {
			totalBrutoNota += (n.getValorBrutoItem() * n.getQuantidadeItens());
		}
		notaEntity.setValorBrutoNota(totalBrutoNota);
		this.notaRepo.saveAll(notaItemEntity);
		this.notaFiscalRepo.save(notaEntity);
		this.notaImpostoItem.calculaImposto(notaItemEntity);

	}

	//METODO QUE VALIDA O VALOR LIQUIDO DA NOTA
	public Double calculaValorLiquido(NotaFiscal nota){
		return null;
	}

}
