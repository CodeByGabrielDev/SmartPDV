package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ItensVendaRequest;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.VendaItemRequest;
import br.com.SmartPDV.SmartPDV.Entities.Caixa;
import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.Produto;
import br.com.SmartPDV.SmartPDV.Entities.Venda;
import br.com.SmartPDV.SmartPDV.Repository.CaixaRepository;
import br.com.SmartPDV.SmartPDV.Repository.ItemVendaRepository;
import br.com.SmartPDV.SmartPDV.Repository.VendaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class VendaItemService {

    private final ItemVendaRepository itemVendaRepository;
    private final CaixaRepository caixaRepository;
    private final VendaRepository vendaRepository;
    private final VendaCalculoService vendaCalculoService;
    private final EstoqueProdutoService estoqueProdutoService;

    @Transactional
    public void insereItensVenda(VendaItemRequest itens, Venda venda, Caixa caixa) {
        List<ItemVenda> itensVenda = new ArrayList<>();
        for (ItensVendaRequest itensForEach : itens.getItens_venda()) {
            Produto estoqueItem = this.estoqueProdutoService.validaSeExisteItemNoEstoquePorCodigo(
                    itensForEach.getCodigo_barra(),
                    itensForEach.getQtd_item());
            Double calculo = vendaCalculoService.calculaValorTotal(estoqueItem, itensForEach);
            itensVenda.add(new ItemVenda(venda, venda.getTicket(), estoqueItem, itensForEach.getQtd_item(),
                    estoqueItem.getPrecoVenda(), calculo,
                    itensForEach.getDesconto(), venda.getLoja()));
            caixa.setValorFinal(caixa.getValorFinal() + calculo);
            venda.setValorTotal(venda.getValorTotal() + calculo);
            venda.setDesconto(venda.getDesconto() + vendaCalculoService.totalDescontoVenda(itensForEach, estoqueItem));
        }
        this.vendaRepository.save(venda);
        this.itemVendaRepository.saveAll(itensVenda);
        this.caixaRepository.save(caixa);
    }

}
