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
import br.com.SmartPDV.SmartPDV.Repository.NotaFiscalitemRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotaFiscalService {

	private final NotaFiscalRepository notaFiscalRepo;
	private final NotaFiscalItemService notaFiscalItemService;

	@Transactional
	public void emitirNotaDeVenda(Venda venda, List<ItemVenda> itens) {

		NotaFiscal notaEmissao = new NotaFiscal((long) 0, 65, (long) 0, 5102, venda.getCliente(),
				venda.getCliente().getCpfCnpj(), venda.getLoja(), 0.0, null, null, null, venda, LocalDateTime.now(),
				StatusNotaFiscal.PENDENTE);
		geraNumeroFiscal(notaEmissao);
		realizaCalculo(notaEmissao, itens);
	}

	private void realizaCalculo(NotaFiscal notaEmissao, List<ItemVenda> itens) {
		Double interadorDeDescontos = 0.0;
		Double interadorDeValoresLiquidos = 0.0;
		Double interadorDeValoresBrutos = 0.0;

		for (ItemVenda itensVenda : itens) {
			if (itensVenda.getPorcentDesconto() != 0) {
				interadorDeValoresBrutos += itensVenda.getValorUnitario() * itensVenda.getQtd();
				Double valorLiquidoItem = itensVenda.getValorUnitario() * itensVenda.getQtd()
						- (itensVenda.getValorUnitario() * itensVenda.getQtd()
								* (itensVenda.getPorcentDesconto() / 100));
				interadorDeValoresLiquidos += valorLiquidoItem;
			} else {
				interadorDeValoresLiquidos += itensVenda.getValorUnitario() * itensVenda.getQtd();
			}

		}

		notaEmissao.setDesconto(interadorDeDescontos);
		notaEmissao.setValorLiquidoNota(interadorDeValoresLiquidos);
		notaEmissao.setValorBrutoNota(interadorDeValoresBrutos);
		this.notaFiscalItemService.inserirItensFiscais(itens, notaEmissao);
		this.notaFiscalRepo.save(notaEmissao);
	}

	private void geraNumeroFiscal(NotaFiscal nota) {
		NotaFiscal sequential = this.notaFiscalRepo.findLastSequential(nota.getLoja().getId(), nota.getSerieNf());
		if (sequential.getNfNumero() != null) {
			nota.setNfNumero(sequential.getNfNumero() + 1);
		}else {
			nota.setNfNumero((long)1);
		}
		
	}
}
