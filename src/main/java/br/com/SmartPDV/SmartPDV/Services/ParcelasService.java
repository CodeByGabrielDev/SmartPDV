package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import br.com.SmartPDV.SmartPDV.Entities.Pagamento;
import br.com.SmartPDV.SmartPDV.Entities.Parcelas;
import br.com.SmartPDV.SmartPDV.Repository.ParcelasRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ParcelasService {

    private final ParcelasRepository pagamentoRepository;
    @Transactional
    public void insertParcelas(Pagamento pagamento) {
        Integer iterador = 1;
        List<Parcelas> parcelas = new ArrayList<>();
        for (int i = 0; i < pagamento.getQtdParcelas(); i++) {
            parcelas.add(new Parcelas(pagamento, pagamento.getVenda().getTicket(), iterador++,pagamento.getLoja(),
                    pagamento.getValor() / pagamento.getQtdParcelas()));
        }
        this.pagamentoRepository.saveAll(parcelas);
    }

}
