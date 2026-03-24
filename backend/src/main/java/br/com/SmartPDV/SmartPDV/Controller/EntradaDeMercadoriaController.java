package br.com.SmartPDV.SmartPDV.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.ResponseDTOs.TransitoLojaResponse;
import br.com.SmartPDV.SmartPDV.Services.TransitoLojaService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api-smartpdv/goods receipt/")
public class EntradaDeMercadoriaController {

    private final TransitoLojaService transitoLoja;

    @GetMapping
    public List<TransitoLojaResponse> mostrarNotasPendentesParaEntrada() {
        return this.transitoLoja.mostraNotasNoTransito();
    }

    @PutMapping("/{idNota}/")
    public void entradaDeMercadoria(@PathVariable Long idNota,@RequestParam String obs) {
        this.transitoLoja.realizarEntradaDeMercadoria(idNota, obs);
    }

}
