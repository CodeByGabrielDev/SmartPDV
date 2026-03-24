package br.com.SmartPDV.SmartPDV.Services;

import org.springframework.stereotype.Service;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalItemRequest;
import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.Produto;

@Service
public class NotaFiscalCalculatorService {
    
    // METODO QUE VALIDA O VALOR LIQUIDO DA NOTA
	public Double calculaValorLiquido(NotaFiscalItemRequest notaItem, Produto produto) {
		Double valorBrutoNota = produto.getPrecoVenda() * notaItem.getQuantidade_Itens();
		Double valorDescontado = valorBrutoNota * (notaItem.getDesconto() / 100);
		return valorBrutoNota - valorDescontado;
	}

	public Double calculaValorLiquidoParaEmissaoDeNotaDeVenda(ItemVenda item) {
		Double valorBrutoNota = item.getProduto().getPrecoVenda() * item.getQtd();
		Double valorDeDesconto = valorBrutoNota * (item.getPorcentDesconto() / 100);
		return valorBrutoNota - valorDeDesconto;
	}

	public Double calculaTotalDeDescontoNaNota(NotaFiscalItemRequest notaRequest, Produto produto) {
		return produto.getPrecoVenda() * (notaRequest.getDesconto() / 100);

	}

	public Double calculaTotalDeDescontoNaNotaDeVenda(ItemVenda item) {
    Double valorBruto = item.getValorUnitario() * item.getQtd();
    return valorBruto * (item.getPorcentDesconto() / 100);
    }
}
