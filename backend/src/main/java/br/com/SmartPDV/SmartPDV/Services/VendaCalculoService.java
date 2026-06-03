package br.com.SmartPDV.SmartPDV.Services;

import org.springframework.stereotype.Service;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ItensVendaRequest;
import br.com.SmartPDV.SmartPDV.Entities.Produto;

@Service
public class VendaCalculoService {

    // Calcula o valor total liquido do item (com desconto aplicado)
    public Double calculaValorTotal(Produto produto, ItensVendaRequest item) {
        Double valorBruto = produto.getPrecoVenda() * item.getQtd_item();
        Double desconto = valorBruto * (item.getDesconto() / 100);
        return valorBruto - desconto;
    }

    // Calcula o valor total de desconto do item
    public Double totalDescontoVenda(ItensVendaRequest item, Produto produto) {
        Double valorBruto = produto.getPrecoVenda() * item.getQtd_item();
        return valorBruto * (item.getDesconto() / 100);
    }
}
