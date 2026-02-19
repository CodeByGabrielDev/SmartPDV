package br.com.SmartPDV.SmartPDV.Services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.convert.Jsr310Converters.LocalDateTimeToDateConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Entities.Venda;
import br.com.SmartPDV.SmartPDV.Enum.StatusNotaFiscal;
import br.com.SmartPDV.SmartPDV.Repository.NotaFiscalRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotaFiscalService {

	private final NotaFiscalRepository notaFiscalRepo;

	@Transactional
	public void emitirNotaDeVenda(Venda venda, List<ItemVenda> itens) {
		NotaFiscal notaEmissao = new NotaFiscal(65, (long) 0, 5102, venda.getLoja(), 0.0, venda, LocalDateTime.now(),
				StatusNotaFiscal.PENDENTE);

		double interadorDeDescontos = 0;

		for (ItemVenda itensVenda : itens) {
			
		}

	}
}
