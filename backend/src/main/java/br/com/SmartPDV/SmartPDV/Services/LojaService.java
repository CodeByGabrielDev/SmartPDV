package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.LojaRequest;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.LojaResponse;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Repository.LojaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LojaService {

    private final LojaRepository lojaRepository;

    public List<LojaResponse> retornarTodasAsLojasAtivas() {
        List<LojaResponse> lojas = new ArrayList<>();
        List<Loja> lojasEntity = this.lojaRepository.selectAllLojas();
        for (Loja loja : lojasEntity) {
            lojas.add(new LojaResponse(loja.getId(), loja.getRazaoSocial(), loja.getCnpj(), loja.getIE(),
                    loja.getEndereco()));
        }
        return lojas;
    }

    public LojaResponse registrarLoja(LojaRequest lojaRequest) {
        if (this.lojaRepository.findByRazaoSocialOrCnpjOrIe(lojaRequest.getCnpj(), lojaRequest.getRazaoSocial(),
                lojaRequest.getIE()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma loja cadastrada com este CNPJ, Razão Social ou Inscrição Estadual. Verifique os dados informados.");
        }
        System.out.println("Teste do IE nivel QA: " + lojaRequest.getIE());
        validator(lojaRequest);
        Loja loja = new Loja(lojaRequest.getRazaoSocial(), lojaRequest.getCnpj(), lojaRequest.getIE(),
                lojaRequest.getEndereco(), false);

        this.lojaRepository.save(loja);
        return new LojaResponse(loja.getId(), lojaRequest.getRazaoSocial(), lojaRequest.getCnpj(), lojaRequest.getIE(),
                lojaRequest.getEndereco());
    }

    private void validator(LojaRequest lojaRequest) {
        if (lojaRequest.getCnpj() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "O campo CNPJ é obrigatório para cadastrar uma loja.");
        }
        if (lojaRequest.getEndereco() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "O campo endereço é obrigatório para cadastrar uma loja.");
        }
        if (lojaRequest.getIE() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "O campo Inscrição Estadual (IE) é obrigatório para cadastrar uma loja.");
        }
        if (lojaRequest.getRazaoSocial() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "O campo Razão Social é obrigatório para cadastrar uma loja.");
        }
    }

}
