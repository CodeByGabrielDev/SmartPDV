package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ProdutoRequest;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.ProdutoResponse;
import br.com.SmartPDV.SmartPDV.Entities.Produto;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Enum.PerfilVendedor;
import br.com.SmartPDV.SmartPDV.Repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public List<ProdutoResponse> listarTodosOsProdutosDisponiveis() {
        UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();

        List<Produto> findAllProdutos = this.produtoRepository.findAllProducts(usuariosLoja.getLojaVinculada().getId());
        List<ProdutoResponse> produtoResponses = new ArrayList<>();
        for (Produto produto : findAllProdutos) {
            produtoResponses.add(new ProdutoResponse(produto.getId(), produto.getDescricao(), produto.getCodigoBarra(),
                    produto.getSku(), produto.getPrecoVenda(), produto.getCusto(), produto.getInativo()));
        }
        return produtoResponses;
    }

    @Transactional
    public ProdutoResponse registrarNovosProdutos(ProdutoRequest produtoRequest) {
        UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();

        if (usuariosLoja.getPerfil() != PerfilVendedor.GERENTE && usuariosLoja.getPerfil() != PerfilVendedor.ADMIN
                && usuariosLoja.getPerfil() != PerfilVendedor.MATRIZ) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    " Apenas usuario com perfil de gerente pode realizar o registro de novos produtos.");
        }
        validadorDeAtributos(produtoRequest);
        if (this.produtoRepository.selectByCodigoDeBarra(produtoRequest.getCodigoBarra()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    " Ja existe um produto com esse codigo de barras cadastrado no sistema.");
        }
        if (this.produtoRepository.findBySku(produtoRequest.getSku()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    " Ja existe um produto com esse sku cadastrado no sistema.");
        }
        this.produtoRepository.save(new Produto(produtoRequest.getDescricao(), produtoRequest.getCodigoBarra(),
                produtoRequest.getSku(), produtoRequest.getPrecoVenda(), produtoRequest.getCusto(), false,
                usuariosLoja.getLojaVinculada()));

        return new ProdutoResponse(produtoRequest.getDescricao(), produtoRequest.getCodigoBarra(),
                produtoRequest.getSku(), produtoRequest.getPrecoVenda(), produtoRequest.getCusto(), false);
    }

    private void validadorDeAtributos(ProdutoRequest produtoRequest) {
        if (produtoRequest.getCodigoBarra() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, " Codigo de barra não pode estar nullo");
        }
        if (produtoRequest.getCusto() == null || produtoRequest.getCusto() <= 0.0) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE,
                    " Custo não pode estar nulo ou abaixo de valor 0");
        }
        if (produtoRequest.getDescricao() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, " Descricao não pode estar nullo");
        }
        if (produtoRequest.getPrecoVenda() == null || produtoRequest.getPrecoVenda() <= 0.0) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE,
                    "  preço de venda não pode estar nulo ou abaixo de valor 0");
        }
        if (produtoRequest.getSku() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, " Sku não pode estar nullo");
        }
    }

    @Transactional
    public void inativarProduto(Long id) {
        UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();

        if (usuariosLoja.getPerfil() != PerfilVendedor.GERENTE && usuariosLoja.getPerfil() != PerfilVendedor.ADMIN
                && usuariosLoja.getPerfil() != PerfilVendedor.MATRIZ) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    " Apenas usuario com perfil de gerente/admin/Matriz pode realizar a deleção de novos produtos.");
        }
        Produto produto = this.produtoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (produto.getLoja().getId() != usuariosLoja.getLojaVinculada().getId()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    " não pode ser realizado a deleção de itens de outras lojas que voce não possui acesso");
        }

        produto.setInativo(true);
        this.produtoRepository.save(produto);
    }

}
