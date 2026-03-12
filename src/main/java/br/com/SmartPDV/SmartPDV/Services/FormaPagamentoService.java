package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import br.com.SmartPDV.SmartPDV.Entities.FormaPgto;
import br.com.SmartPDV.SmartPDV.Repository.FormaPgtoRepository;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.FormaPgtoResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class FormaPagamentoService {

    private final FormaPgtoRepository formaPgtoRepository;

    public List<FormaPgtoResponse> listarFormasDePagamento() {
        List<FormaPgtoResponse> listaDeResposta = new ArrayList<>();
        for (FormaPgto f : this.formaPgtoRepository.selectAll()) {
            listaDeResposta.add(new FormaPgtoResponse(f.getDescFormaPgto()));
        }
        return listaDeResposta;
    }
}
