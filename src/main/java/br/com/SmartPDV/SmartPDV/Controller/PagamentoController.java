package br.com.SmartPDV.SmartPDV.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.Services.PagamentoService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api-smartpdv/payment")
public class PagamentoController {
    private final PagamentoService pagamentoService;

    @PostMapping
    public void realizarPagamento(Long idVenda, Integer formaPgto, Integer qtdParcelas){

    }


    
}
