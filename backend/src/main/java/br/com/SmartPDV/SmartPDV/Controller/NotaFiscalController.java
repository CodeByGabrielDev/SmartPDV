package br.com.SmartPDV.SmartPDV.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.NotaFiscalRequest;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.NotaFiscalResponse;
import br.com.SmartPDV.SmartPDV.Services.NotaFiscalService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api-smartpdv/v1/invoice")
public class NotaFiscalController {

    private final NotaFiscalService notaService;

    @PostMapping
    public NotaFiscalResponse emitirNotaFiscalAvulsa(@RequestBody NotaFiscalRequest notaRequest) {
        return this.notaService.emitirNotaAvulsa(notaRequest);
    }

    @GetMapping
    public List<NotaFiscalResponse> listarNotasEmitidasPelaLoja() {
        return this.notaService.listarNotasEmitidasNaLoja();
    }

}
