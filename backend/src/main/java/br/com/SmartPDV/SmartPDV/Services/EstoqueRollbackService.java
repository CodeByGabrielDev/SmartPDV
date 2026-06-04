package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.Entities.EstoqueProduto;
import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.Venda;
import br.com.SmartPDV.SmartPDV.Repository.EstoqueProdutoRepository;
import br.com.SmartPDV.SmartPDV.Repository.VendaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EstoqueRollbackService {

    private final EstoqueProdutoRepository estoqueProdutoRepository;
    private final VendaRepository vendaRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void retornarEstoqueParaSuaOrigem(Venda venda, List<ItemVenda> itens) {

        List<String> codigosBarras = new ArrayList<>();
        Map<String, ItemVenda> mapperItens = new HashMap<>();

        for (ItemVenda itemVenda : itens) {
            String codigo = itemVenda.getProduto().getCodigoBarra();
            codigosBarras.add(codigo);
            mapperItens.put(codigo, itemVenda);
        }

        List<EstoqueProduto> estoqueProdutos = this.estoqueProdutoRepository
                .findAllItensInByIdShop(codigosBarras, venda.getLoja().getId());

        if (estoqueProdutos == null || estoqueProdutos.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Nenhum item de estoque encontrado para reverter a venda #" + venda.getTicket() + ". Verifique se os produtos estão cadastrados no estoque desta loja.");
        }

        for (EstoqueProduto estoqueProduto : estoqueProdutos) {
            ItemVenda itemVenda = mapperItens.get(estoqueProduto.getCodigoBarra());
            if (itemVenda == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Produto '" + estoqueProduto.getCodigoBarra() + "' não localizado durante a reversão do estoque. Contate o suporte.");
            }
            estoqueProduto.setQtdAtual(estoqueProduto.getQtdAtual() + itemVenda.getQtd());
        }

        this.estoqueProdutoRepository.saveAll(estoqueProdutos);
    }
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deletarVenda(Venda venda) {
        this.vendaRepository.delete(venda);
    }
}
