package br.com.SmartPDV.SmartPDV.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import br.com.SmartPDV.SmartPDV.Entities.Pagamento;
import br.com.SmartPDV.SmartPDV.Entities.Parcelas;
import br.com.SmartPDV.SmartPDV.Repository.PagamentoRepository;
import br.com.SmartPDV.SmartPDV.Repository.ParcelasRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ParcelasService {

    private final ParcelasRepository pagamentoRepository;
    private final NotaFiscalService notaService;
    @Transactional
    public void insertPagamento(Pagamento pagamento) {
        Integer iterador = 1;
        List<Parcelas> parcelas = new ArrayList<>();
        for (int i = 0; i < pagamento.getQtdParcelas(); i++) {
            parcelas.add(new Parcelas(pagamento, pagamento.getVenda().getTicket(), iterador,
                    pagamento.getValor() / pagamento.getQtdParcelas()));
        }
        this.notaService.emitirNotaDeVenda(pagamento.getVenda(), pagamento.getVenda().getItemVenda(),pagamento);
        this.pagamentoRepository.saveAll(parcelas);
    }

}
