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

	@Transactional
	public void calculaImposto(List<NotaFiscalItem> itens) {
		List<NotaFiscalImpostoItem> imposto = new ArrayList<>();
		for (NotaFiscalItem n : itens) {
			for (ExcecaoImpostoItem e : n.getExcecaoImposto().getExcecaoImpostoItem()) {
				NotaFiscalImpostoItem notaItemImposto = new NotaFiscalImpostoItem(e.getTipo(), n.getNota(),
						n.getValorLiquidoItem(),
						n.getValorLiquidoItem() - (n.getValorLiquidoItem() * (e.getReducaoBase() / 100)),
						e.getAliquota(), e.getReducaoBase(), 0.0);
				notaItemImposto.setValorImpostoCalculado(notaItemImposto.getBaseCalculo() * (e.getAliquota() / 100));
				imposto.add(notaItemImposto);

			}
		}
		this.notaFiscalImpostoItem.saveAll(imposto);

	}
}