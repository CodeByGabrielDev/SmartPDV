package br.com.SmartPDV.SmartPDV.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.FormaPgtoResponse;
import br.com.SmartPDV.SmartPDV.Enum.FormaPagamento;
import br.com.SmartPDV.SmartPDV.Services.FormaPagamentoService;
import lombok.RequiredArgsConstructor;
/*
maria.elisa.lima */
@RequestMapping("/api-smartpdv/payment-method")
@RestController
@RequiredArgsConstructor
public class FormaPagamentoController {

    private final FormaPagamentoService formaPagamentoService;

    @GetMapping
    List<FormaPgtoResponse> listarTodosMeiosDePagamento() {
        return this.formaPagamentoService.listarFormasDePagamento();
    }

    @PostMapping("/create")
    public void criarFormaDePagamento(@RequestParam String descricaoPagamento,
            @RequestParam FormaPagamento formaPagamento) {
        this.formaPagamentoService.criarFormaDePagamento(descricaoPagamento, formaPagamento);
    }

    @DeleteMapping("{idLong}/delete")
    public void deletarFormaPgto(@PathVariable Long idLong) {
        this.deletarFormaPgto(idLong);
    }
}
