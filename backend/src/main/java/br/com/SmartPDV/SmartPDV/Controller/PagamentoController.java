package br.com.SmartPDV.SmartPDV.Controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.Services.PagamentoService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api-smartpdv/payment")
public class PagamentoController {
    private final PagamentoService pagamentoService;

    @PostMapping("/{idVenda}/")
    public void realizarPagamento(@PathVariable Long idVenda, @RequestParam Integer formaPgto,
            @RequestParam Integer qtdParcelas) {
        this.pagamentoService.inserePagamento(idVenda, formaPgto, qtdParcelas);
    }

}
