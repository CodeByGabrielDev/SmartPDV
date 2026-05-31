package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.FormaPgtoResponse;
import br.com.SmartPDV.SmartPDV.Entities.FormaPgto;
import br.com.SmartPDV.SmartPDV.Enum.FormaPagamento;
import br.com.SmartPDV.SmartPDV.Repository.FormaPgtoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class FormaPagamentoService {

    private final FormaPgtoRepository formaPgtoRepository;

    @Transactional
    public void criarFormaDePagamento(String descricaoPagamento, FormaPagamento formaPagamento) {
        if (descricaoPagamento == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, " descricao não pode estar nula");
        }
        if (formaPagamento == null) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, " forma de pagamento nao pode estar null");
        }

        this.formaPgtoRepository.save(new FormaPgto(descricaoPagamento, formaPagamento));
    }

    @Transactional
    public void deletarFormaPgto(Long idLong) {
        FormaPgto formaPgto = this.formaPgtoRepository.findById(idLong)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        " Nao foi encontrado forma de pagamento com esse ID no banco de dados"));

        this.formaPgtoRepository.delete(formaPgto);
    }

    public List<FormaPgtoResponse> listarFormasDePagamento() {
        List<FormaPgtoResponse> listaDeResposta = new ArrayList<>();
        for (FormaPgto f : this.formaPgtoRepository.selectAll()) {
            listaDeResposta
                    .add(new FormaPgtoResponse(f.getId(), f.getFormaPagamento().toString(), f.getDescFormaPgto()));
        }
        return listaDeResposta;
    }
}
