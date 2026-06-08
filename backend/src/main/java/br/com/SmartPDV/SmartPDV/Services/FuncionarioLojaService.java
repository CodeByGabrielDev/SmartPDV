package br.com.SmartPDV.SmartPDV.Services;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.Config.HashSenha;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.LojaRequest;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.LojaResponse;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Repository.FuncionarioLoja;
import br.com.SmartPDV.SmartPDV.Repository.LojaRepository;
import br.com.SmartPDV.SmartPDV.Utils.Validator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FuncionarioLojaService {

    private final FuncionarioLoja funcionarioLoja;
    private final HashSenha hashSenha;
    private final LojaRepository lojaRepository;

    @Transactional
    public void resetarSenhaDeFuncionario(String senhaDeUsuario, String senhaDesejada) {
        UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();

        if (!this.hashSenha.passwordEncoder().matches(senhaDeUsuario, usuariosLoja.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "A senha atual está incorreta. Verifique e tente novamente.");
        }
        if (!Validator.validarSenha(senhaDesejada)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "A nova senha não atende aos requisitos mínimos. Use ao menos 8 caracteres com letras, números e caracteres especiais.");
        }

        usuariosLoja.setSenha(senhaDesejada);
        usuariosLoja.setSenha(this.hashSenha.passwordEncoder().encode(usuariosLoja.getSenha()));
        this.funcionarioLoja.save(usuariosLoja);

    }

    public LojaResponse buscarLojaDoUsuario() {
        UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Loja loja = this.lojaRepository.findById(usuariosLoja.getLojaVinculada().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, " Loja não encontrada"));
        return new LojaResponse(loja.getId(), loja.getRazaoSocial(), loja.getCnpj(), loja.getIE(), loja.getEndereco());
    }

    private void validator(LojaRequest lojaRequest, Loja loja) {

        if (lojaRequest.getCnpj() != null) {
            loja.setCnpj(lojaRequest.getCnpj());
        }
        if (lojaRequest.getEndereco() != null) {
            loja.setEndereco(lojaRequest.getEndereco());
        }
        if (lojaRequest.getIE() != null) {
            loja.setIE(lojaRequest.getIE());
        }
        if (lojaRequest.getRazaoSocial() != null) {
            loja.setRazaoSocial(lojaRequest.getRazaoSocial());
        }
        this.lojaRepository.save(loja);
    }

    @Transactional
    public LojaResponse editarInformacoesDaLojaAtual(LojaRequest lojaRequest) {
        UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Loja loja = this.lojaRepository.findById(usuariosLoja.getLojaVinculada().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, " Loja não encontrada"));
        validator(lojaRequest, loja);
        return new LojaResponse(loja.getId(), loja.getRazaoSocial(), loja.getCnpj(), loja.getIE(), loja.getEndereco());
    }
}
