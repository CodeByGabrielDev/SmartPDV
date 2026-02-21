package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscalItem;
import br.com.SmartPDV.SmartPDV.Entities.Venda;
import br.com.SmartPDV.SmartPDV.Repository.ExcecaoImpostoRepository;
import br.com.SmartPDV.SmartPDV.Repository.NotaFiscalitemRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotaFiscalItemService {

	private final ExcecaoImpostoRepository excecao;

	private final NotaFiscalitemRepository notaRepo;

	private final NotaFiscalImpostoItemService notaImpostoItem;

	@Transactional
	public void inserirItensFiscais(List<ItemVenda> itensVenda, NotaFiscal notaFiscal) {

		List<NotaFiscalItem> notas = new ArrayList<>();
		Integer interador = 0;
		for (ItemVenda i : itensVenda) {
			NotaFiscalItem notaItem = new NotaFiscalItem(notaFiscal, notaFiscal.getSerieNf(), i.getProduto(),
					interador++, i.getQtd(), i.getPorcentDesconto(), i.getLoja(),
					this.excecao.findExcecaoByCodFilialAndCfop(notaFiscal.getCfop(), notaFiscal.getLoja().getId()));
			notas.add(notaItem);

			notaRepo.save(notaItem);

		}
		this.notaImpostoItem.calculaImposto(notas);
	}
}
