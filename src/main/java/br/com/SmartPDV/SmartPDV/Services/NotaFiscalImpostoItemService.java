package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import br.com.SmartPDV.SmartPDV.Entities.ExcecaoImposto;
import br.com.SmartPDV.SmartPDV.Entities.ExcecaoImpostoItem;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscalImpostoItem;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscalItem;
import br.com.SmartPDV.SmartPDV.Repository.NotaFiscalImpostoItemRepository;
import br.com.SmartPDV.SmartPDV.Repository.NotaFiscalRepository;
import br.com.SmartPDV.SmartPDV.Repository.NotaFiscalitemRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class NotaFiscalImpostoItemService {
	private final NotaFiscalImpostoItemRepository notaFiscalImpostoItem;
	private final NotaFiscalRepository notaFiscalRepository;
	@Transactional
	public void calculaImposto(List<NotaFiscalItem> itens,NotaFiscal notaFiscal) {
		List<NotaFiscalImpostoItem> imposto = new ArrayList<>();
		Double valorTotalImposto = 0.0;
		for (NotaFiscalItem n : itens) {
			for (ExcecaoImpostoItem e : n.getExcecaoImposto().getExcecaoImpostoItem()) {
				/*
				public NotaFiscalImpostoItem(TipoImposto tipo, NotaFiscal numero, Long numeroNotaFiscal, Integer serieNotaFiscal,
			Double valorLiquidoProduto, Double baseCalculo, Double aliquotaAplicada, Double reducaoBaseAplicada,
			Double valorImpostoCalculado) */
				NotaFiscalImpostoItem notaItemImposto = new NotaFiscalImpostoItem(e.getTipo(), n.getNota(),n.getNfNumero(),notaFiscal.getSerieNf(),
						n.getValorLiquidoItem(),
						n.getValorLiquidoItem() - (n.getValorLiquidoItem() * (e.getReducaoBase() / 100)),
						e.getAliquota(), e.getReducaoBase(), 0.0);
				notaItemImposto.setValorImpostoCalculado(notaItemImposto.getBaseCalculo() * (e.getAliquota() / 100));
				valorTotalImposto += notaItemImposto.getBaseCalculo() * (e.getAliquota() / 100);
				imposto.add(notaItemImposto);

			}
		}
		notaFiscal.setValorTotalDeImpostoAPagar(valorTotalImposto);
		this.notaFiscalRepository.save(notaFiscal);
		
		this.notaFiscalImpostoItem.saveAll(imposto);

	}
}