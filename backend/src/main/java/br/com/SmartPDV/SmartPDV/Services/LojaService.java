package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Repository.LojaRepository;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.LojaResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LojaService {

    private final LojaRepository lojaRepository;

    public List<LojaResponse> retornarTodasAsLojasAtivas() {
        List<LojaResponse> lojas = new ArrayList<>();
        List<Loja> lojasEntity = this.lojaRepository.selectAllLojas();
        for (Loja loja : lojasEntity) {
            lojas.add(new LojaResponse(loja.getRazaoSocial(), loja.getCnpj(), loja.getIE(), loja.getEndereco()));
        }
        return lojas;
    }

}
