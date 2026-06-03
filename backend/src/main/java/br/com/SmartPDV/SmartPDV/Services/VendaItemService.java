package br.com.SmartPDV.SmartPDV.Services;

import java.beans.Transient;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ItensVendaRequest;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.VendaItemRequest;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.PagamentoResponse;
import br.com.SmartPDV.SmartPDV.Entities.Caixa;
import br.com.SmartPDV.SmartPDV.Entities.EstoqueProduto;
import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.Pagamento;
import br.com.SmartPDV.SmartPDV.Entities.Venda;
import br.com.SmartPDV.SmartPDV.Repository.CaixaRepository;
import br.com.SmartPDV.SmartPDV.Repository.EstoqueProdutoRepository;
import br.com.SmartPDV.SmartPDV.Repository.ItemVendaRepository;
import br.com.SmartPDV.SmartPDV.Repository.VendaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class VendaItemService {

    private final EstoqueProdutoRepository estoqueRepository;
    private final ItemVendaRepository itemVendaRepository;
    private final CaixaRepository caixaRepository;
    private final VendaRepository vendaRepository;
    private final VendaCalculoService vendaCalculoService;
    private final EstoqueProdutoService estoqueProdutoService;

    @Transactional
    public void insereItensVenda(VendaItemRequest itens, Venda venda, Caixa caixa) {
        List<ItemVenda> itensVenda = new ArrayList<>();
        for (ItensVendaRequest itensForEach : itens.getItens_venda()) {
            EstoqueProduto estoqueItem = this.estoqueProdutoService.validaSeExisteItemNoEstoquePorCodigo(
                    itensForEach.getCodigo_barra(),
                    itensForEach.getQtd_item());
            estoqueItem.setQtdAtual(estoqueItem.getQtdAtual() - itensForEach.getQtd_item());
            this.estoqueRepository.save(estoqueItem);
            Double calculo = vendaCalculoService.calculaValorTotal(estoqueItem, itensForEach);
            itensVenda.add(new ItemVenda(venda, venda.getTicket(), estoqueItem.getProduto(), itensForEach.getQtd_item(),
                    estoqueItem.getProduto().getPrecoVenda(), calculo,
                    itensForEach.getDesconto(), venda.getLoja()));
            caixa.setValorFinal(caixa.getValorFinal() + calculo);
            venda.setValorTotal(venda.getValorTotal() + calculo);
            venda.setDesconto(venda.getDesconto() + vendaCalculoService.totalDescontoVenda(itensForEach, estoqueItem));

        }
        this.vendaRepository.save(venda);
        this.itemVendaRepository.saveAll(itensVenda);
        this.caixaRepository.save(caixa);

    }

    private EstoqueProduto findItem(String codigoBarra, Venda venda) {
        EstoqueProduto estoque = this.estoqueRepository.selectByCodigoBarra(codigoBarra);

        if (estoque == null) {

            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Codigo de barra nao encontrado no estoque, valide ou cadastre o mesmo");
        }
        return estoque;
    }

}
