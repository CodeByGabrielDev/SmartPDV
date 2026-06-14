package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalItemRequest;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalRequest;
import br.com.SmartPDV.SmartPDV.Entities.EstoqueProduto;
import br.com.SmartPDV.SmartPDV.Entities.ExcecaoImposto;
import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscalItem;
import br.com.SmartPDV.SmartPDV.Entities.Produto;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Enum.PerfilVendedor;
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
	private final EstoqueProdutoService estoqueProdutoService;
	private final ExcecaoImpostoRepository excecaoImpostoRepo;
	private final LojaRepository loja;
	private final NotaFiscalCalculatorService calculator;

	@Transactional
	public void inserirItensFiscais(List<ItemVenda> itensVenda, NotaFiscal notaFiscal) {
		List<NotaFiscalItem> notas = new ArrayList<>();
		Integer interador = 1;
		Double valorTotalDesconto = 0.0;
		for (ItemVenda i : itensVenda) {

			Produto produtoFind = this.prodRepository.findById(i.getProduto().getId()).orElse(null);
			if (produtoFind == null) {
				this.notaFiscalRepo.delete(notaFiscal);
				throw new ResponseStatusException(HttpStatus.NOT_FOUND,
						"Produto não encontrado na base de dados. Verifique o código de barras do item da venda.");
			}
			NotaFiscalItem notaItem = new NotaFiscalItem(notaFiscal, notaFiscal.getNfNumero(), notaFiscal.getSerieNf(),
					produtoFind,
					interador++, i.getQtd(),
					produtoFind.getPrecoVenda(), this.calculator.calculaValorLiquidoParaEmissaoDeNotaDeVenda(i),
					i.getPorcentDesconto(), i.getLoja(),
					this.excecaoImpostoRepo.findExcecaoByCodFilialAndCfop(notaFiscal.getCfop(),
							notaFiscal.getLoja().getId()));
			valorTotalDesconto += this.calculator.calculaTotalDeDescontoNaNotaDeVenda(i);
			notas.add(notaItem);

		}
		notaFiscal.setDesconto(valorTotalDesconto);
		this.notaFiscalRepo.save(notaFiscal);
		notaRepo.saveAll(notas);
		this.notaImpostoItem.calculaImposto(notas, notaFiscal);
	}

	/**
	 * Valida todos os itens do request SEM persistir nada no banco.
	 * Lança ResponseStatusException se qualquer produto estiver inativo ou sem estoque.
	 * Deve ser chamado ANTES de salvar a NotaFiscal.
	 */
	public void validarItensAntesDeEmitir(NotaFiscalRequest notaItem,
			NotaFiscal notaEntity, UsuariosLoja usuariosLoja) {

		for (NotaFiscalItemRequest nota : notaItem.getCodigo_barra()) {
			if (notaEntity.getCfop() == 5152 || notaEntity.getCfop() == 6152) {
				Produto produto = this.prodRepository.selectByCodigoDeBarra(nota.getCodigo_barra());
				if (produto == null) {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND,
							"Produto com código de barras '" + nota.getCodigo_barra() + "' não encontrado.");
				}
				if (Boolean.TRUE.equals(produto.getInativo())) {
					throw new ResponseStatusException(HttpStatus.CONFLICT,
							"O produto '" + produto.getDescricao() + "' (cód: " + nota.getCodigo_barra()
									+ ") está inativo e não pode ser incluído em uma nota de transferência. "
									+ "Reative o produto ou remova-o da nota.");
				}
			} else {
				// Para CFOPs de venda, valida estoque (sem debitar — só leitura)
				if (this.prodRepository.selectByCodigoDeBarra(nota.getCodigo_barra()) == null) {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND,
							"Produto com código de barras '" + nota.getCodigo_barra() + "' não encontrado.");
				}
			}
		}
	}

	/**
	 * Persiste os itens fiscais assumindo que a validação já foi feita.
	 * Substitui o antigo validacaoEPersistencia para uso após salvar a nota.
	 */
	@Transactional
	public void persistirItensJaValidados(NotaFiscalRequest notaItem,
			NotaFiscal notaEntity, UsuariosLoja usuariosLoja) {
		List<NotaFiscalItem> notaItemEntity = new ArrayList<>();
		Integer iterador = 1;
		Double valorTotalDesconto = 0.0;
		Double calculaTotalBrutoNota = 0.0;
		Double calculaTotalLiquidoNota = 0.0;
		ExcecaoImposto exception = this.excecaoImpostoRepo.findExcecaoByCodFilialAndCfop(notaEntity.getCfop(),
				usuariosLoja.getLojaVinculada().getId());

		for (NotaFiscalItemRequest nota : notaItem.getCodigo_barra()) {
			Produto prodFind;
			if (notaEntity.getCfop() == 5152 || notaEntity.getCfop() == 6152) {
				prodFind = this.prodRepository.selectByCodigoDeBarra(nota.getCodigo_barra());
			} else {
				prodFind = this.estoqueProdutoService
						.validaSeExisteItemNoEstoquePorCodigo(nota.getCodigo_barra(), nota.getQuantidade_Itens());
			}

			calculaTotalBrutoNota += (prodFind.getPrecoVenda() * nota.getQuantidade_Itens());
			calculaTotalLiquidoNota += this.calculator.calculaValorLiquido(nota, prodFind);
			notaItemEntity.add(new NotaFiscalItem(notaEntity, notaEntity.getNfNumero(), notaEntity.getSerieNf(),
					prodFind, iterador++,
					nota.getQuantidade_Itens(),
					prodFind.getPrecoVenda(),
					this.calculator.calculaValorLiquido(nota, prodFind),
					nota.getDesconto(), notaEntity.getLoja(), exception));
			valorTotalDesconto += this.calculator.calculaTotalDeDescontoNaNota(nota, prodFind);
		}
		notaEntity.setValorBrutoNota(calculaTotalBrutoNota);
		notaEntity.setValorLiquidoNota(calculaTotalLiquidoNota);
		notaEntity.setDesconto(valorTotalDesconto);
		this.notaRepo.saveAll(notaItemEntity);
		this.notaFiscalRepo.save(notaEntity);
		this.notaImpostoItem.calculaImposto(notaItemEntity, notaEntity);
	}

	@Transactional
	public void validacaoEPersistencia(NotaFiscalRequest notaItem,
			NotaFiscal notaEntity, UsuariosLoja usuariosLoja) {
		List<NotaFiscalItem> notaItemEntity = new ArrayList<>();
		Integer iterador = 1;
		Double valorTotalDesconto = 0.0;
		Double calculaTotalBrutoNota = 0.0;
		Double calculaTotalLiquidoNota = 0.0;
		ExcecaoImposto exception = this.excecaoImpostoRepo.findExcecaoByCodFilialAndCfop(notaEntity.getCfop(),
				usuariosLoja.getLojaVinculada().getId());

		for (NotaFiscalItemRequest nota : notaItem.getCodigo_barra()) {
			Produto prodFind;
			if (notaEntity.getCfop() == 5152 || notaEntity.getCfop() == 6152) {
				Produto produto = this.prodRepository.selectByCodigoDeBarra(nota.getCodigo_barra());
				if (produto.getInativo()) {
					this.notaFiscalRepo.delete(notaEntity);
					throw new ResponseStatusException(HttpStatus.CONFLICT, "produto inativo");
				}
				prodFind = produto;
			} else {
				prodFind = this.estoqueProdutoService
						.validaSeExisteItemNoEstoquePorCodigo(nota.getCodigo_barra(), nota.getQuantidade_Itens());
			}
			if (prodFind == null) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND,
						"Produto com código de barras '" + nota.getCodigo_barra()
								+ "' não encontrado ou sem saldo suficiente no estoque.");
			}

			calculaTotalBrutoNota += (prodFind.getPrecoVenda() * nota.getQuantidade_Itens());
			calculaTotalLiquidoNota += this.calculator.calculaValorLiquido(nota, prodFind);
			notaItemEntity.add(new NotaFiscalItem(notaEntity, notaEntity.getNfNumero(), notaEntity.getSerieNf(),
					prodFind, iterador++,
					nota.getQuantidade_Itens(),
					prodFind.getPrecoVenda(),
					this.calculator.calculaValorLiquido(nota, prodFind),
					nota.getDesconto(), notaEntity.getLoja(), exception));
			valorTotalDesconto += this.calculator.calculaTotalDeDescontoNaNota(nota, prodFind);
		}
		notaEntity.setValorBrutoNota(calculaTotalBrutoNota);
		notaEntity.setValorLiquidoNota(calculaTotalLiquidoNota);
		notaEntity.setDesconto(valorTotalDesconto);
		this.notaRepo.saveAll(notaItemEntity);
		this.notaFiscalRepo.save(notaEntity);
		this.notaImpostoItem.calculaImposto(notaItemEntity, notaEntity);

	}

}
