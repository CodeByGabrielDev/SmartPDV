package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.EstoqueProdutoResponse;
import br.com.SmartPDV.SmartPDV.Entities.EstoqueProduto;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Repository.EstoqueProdutoRepository;
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
                    estoqueProduto.getQtdAtual(), estoqueProduto.getCodigoBarra()));
        }

        return findAllResponse;
    }

}
