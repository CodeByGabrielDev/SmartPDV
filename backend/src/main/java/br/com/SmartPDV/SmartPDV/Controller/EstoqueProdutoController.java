package br.com.SmartPDV.SmartPDV.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.EstoqueProdutoResponse;
import br.com.SmartPDV.SmartPDV.Services.EstoqueProdutoService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api-smartpdv/v1/stock-product")
public class EstoqueProdutoController {

    private final EstoqueProdutoService estoqueProdutoService;

    @GetMapping
    public List<EstoqueProdutoResponse> findAll() {
        return this.estoqueProdutoService.mostrarTodosOsProdutosNoEstoque();
    }

    @PutMapping
    public void validaDisponibilidadeDeItemNoEstoque(String codigoBarras, Integer qtdInteger) {
        this.estoqueProdutoService.validaSeExisteItemNoEstoquePorCodigo(codigoBarras, qtdInteger);
    }

}
