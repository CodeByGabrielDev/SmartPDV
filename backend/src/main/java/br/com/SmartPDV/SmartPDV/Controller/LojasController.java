package br.com.SmartPDV.SmartPDV.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.LojaRequest;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.LojaResponse;
import br.com.SmartPDV.SmartPDV.Services.LojaService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api-smartpdv/shop")
public class LojasController {

    private final LojaService lojaService;

    @GetMapping
    public List<LojaResponse> retornarTodasASLojasDoBanco() {
        return this.lojaService.retornarTodasAsLojasAtivas();
    }

   /*  @PostMapping("/register")
    public LojaResponse registroDeLojas(@RequestBody LojaRequest loja) {
        return this.registroDeLojas(loja);
    }*/

}
