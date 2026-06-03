package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.EstoqueProdutoResponse;
import br.com.SmartPDV.SmartPDV.Entities.EstoqueProduto;
import br.com.SmartPDV.SmartPDV.Entities.Produto;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Repository.EstoqueProdutoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EstoqueProdutoService {

    private final EstoqueProdutoRepository estoqueProdutoRepository;

    public List<EstoqueProdutoResponse> mostrarTodosOsProdutosNoEstoque() {
        UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();

        List<EstoqueProduto> findAll = this.estoqueProdutoRepository
                .findAllItens(usuariosLoja.getLojaVinculada().getId());
        List<EstoqueProdutoResponse> findAllResponse = new ArrayList<>();
        for (EstoqueProduto estoqueProduto : findAll) {
            findAllResponse.add(new EstoqueProdutoResponse(estoqueProduto.getId(),
                    estoqueProduto.getProduto().getDescricao(), estoqueProduto.getLoja().getRazaoSocial(),
                    estoqueProduto.getQtdAtual(), estoqueProduto.getCodigoBarra(),
                    estoqueProduto.getProduto().getPrecoVenda()));
        }

        return findAllResponse;
    }

    @Transactional
    public Produto validaSeExisteItemNoEstoquePorCodigo(String codigoBarraString, Integer qtd) {
        UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();

        EstoqueProduto estoqueProduto = this.estoqueProdutoRepository.selectByCodigoBarra(codigoBarraString,
                usuariosLoja.getLojaVinculada().getId());
        if (estoqueProduto == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, " Produto nao encontrado no estoque");
        }
        if (estoqueProduto.getQtdAtual() < qtd) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Saldo do estoque insuficiente");
        }

        estoqueProduto.setQtdAtual(estoqueProduto.getQtdAtual() - qtd);
        this.estoqueProdutoRepository.save(estoqueProduto);
        return estoqueProduto.getProduto();
    }

}
