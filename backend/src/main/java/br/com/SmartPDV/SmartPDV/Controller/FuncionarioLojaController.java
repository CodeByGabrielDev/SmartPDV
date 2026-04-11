package br.com.SmartPDV.SmartPDV.Controller;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
