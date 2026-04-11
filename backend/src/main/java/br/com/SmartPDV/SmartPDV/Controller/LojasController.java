package br.com.SmartPDV.SmartPDV.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.ResponseDTOs.LojaResponse;
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

}
