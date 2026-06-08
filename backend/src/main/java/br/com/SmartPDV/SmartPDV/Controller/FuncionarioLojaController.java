package br.com.SmartPDV.SmartPDV.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.LojaRequest;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.LojaResponse;
import br.com.SmartPDV.SmartPDV.Services.FuncionarioLojaService;
import lombok.RequiredArgsConstructor;

@RequestMapping("/api-smartpdv/my-profile/")
@RestController
@RequiredArgsConstructor
public class FuncionarioLojaController {
    private final FuncionarioLojaService funcionarioLojaService;

    @PutMapping("/password/")
    public void alterarSenha(@RequestParam String senhaDoUsuario, @RequestParam String senhaQueDesejaUtilizar) {
        this.funcionarioLojaService.resetarSenhaDeFuncionario(senhaDoUsuario, senhaQueDesejaUtilizar);
    }

    @GetMapping
    public LojaResponse informarLojaDoCliente() {
        return this.funcionarioLojaService.buscarLojaDoUsuario();
    }
    @PutMapping("/my-shop/")
    public LojaResponse editarInformacoesDaLoja(@RequestBody LojaRequest lojaRequest){
        return this.funcionarioLojaService.editarInformacoesDaLojaAtual(lojaRequest);
    }
}
