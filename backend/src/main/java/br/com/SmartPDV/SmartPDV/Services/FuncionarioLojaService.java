package br.com.SmartPDV.SmartPDV.Services;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.Config.HashSenha;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Repository.FuncionarioLoja;
import br.com.SmartPDV.SmartPDV.Utils.Validator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FuncionarioLojaService {

    private final FuncionarioLoja funcionarioLoja;
    private final HashSenha hashSenha;

    @Transactional
    public void resetarSenhaDeFuncionario(String senhaDeUsuario, String senhaDesejada) {
        UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();

        if (!this.hashSenha.passwordEncoder().matches(senhaDeUsuario, usuariosLoja.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, " Senha incorreta, por gentileza validar.");
        }
        if (!Validator.validarSenha(senhaDesejada)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha informada fora do padrao estipulado.");
        }

        usuariosLoja.setSenha(senhaDesejada);
        usuariosLoja.setSenha(this.hashSenha.passwordEncoder().encode(usuariosLoja.getSenha()));
        this.funcionarioLoja.save(usuariosLoja);

    }
}
