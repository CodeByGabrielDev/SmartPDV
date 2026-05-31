package br.com.SmartPDV.SmartPDV.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ProdutoRequest;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.ProdutoResponse;
import br.com.SmartPDV.SmartPDV.Services.ProdutoService;
import lombok.RequiredArgsConstructor;

@RequestMapping("/api-smartpdv/v1/product")
@RestController
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    @GetMapping
    public List<ProdutoResponse> listarProdutosCriados() {
        return this.produtoService.listarTodosOsProdutosDisponiveis();
    }

    @PostMapping
    public ProdutoResponse registrarNovoProduto(@RequestBody ProdutoRequest produtoRequest) {
        return this.produtoService.registrarNovosProdutos(produtoRequest);
    }

    @PutMapping
    public void deletarProduto(@RequestParam Long idLong) {
        this.produtoService.inativarProduto(idLong);
    }

}
