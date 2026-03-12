package br.com.SmartPDV.SmartPDV.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.ResponseDTOs.FormaPgtoResponse;
import br.com.SmartPDV.SmartPDV.Services.FormaPagamentoService;
import lombok.RequiredArgsConstructor;

@RequestMapping("/api-smartpdv/payment-method")
@RestController
@RequiredArgsConstructor
public class FormaPagamentoController {

    private final FormaPagamentoService formaPagamentoService;
    @GetMapping
    List<FormaPgtoResponse> listarTodosMeiosDePagamento() {
        return this.formaPagamentoService.listarFormasDePagamento();
    }
}
