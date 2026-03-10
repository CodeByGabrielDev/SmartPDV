package br.com.SmartPDV.SmartPDV.Services;

import org.springframework.stereotype.Service;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ItensVendaRequest;
import br.com.SmartPDV.SmartPDV.Entities.EstoqueProduto;

@Service
public class VendaCalculoService {

    public Double calculaValorTotal(EstoqueProduto estoqueItem, ItensVendaRequest item) {
        Double valorTotalLiquidoSemDesconto = estoqueItem.getProduto().getPrecoVenda() * item.getQtd_item();
        Double desconto = valorTotalLiquidoSemDesconto * (item.getDesconto() / 100);
        return valorTotalLiquidoSemDesconto - desconto;
    }
    public Double totalDescontoVenda(ItensVendaRequest item,EstoqueProduto estoqueItem){
        Double valorXquantidade = estoqueItem.getProduto().getPrecoVenda() * item.getQtd_item();
        Double desconto = valorXquantidade*(item.getDesconto()/100);
        return desconto;
    }
}
