package br.com.SmartPDV.SmartPDV.Services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.Entities.FormaPgto;
import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.Pagamento;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Entities.Venda;
import br.com.SmartPDV.SmartPDV.Repository.FormaPgtoRepository;
import br.com.SmartPDV.SmartPDV.Repository.ItemVendaRepository;
import br.com.SmartPDV.SmartPDV.Repository.PagamentoRepository;
import br.com.SmartPDV.SmartPDV.Repository.VendaRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PagamentoService {

        private final PagamentoRepository pagamentoRepository;
        private final FormaPgtoRepository formaPgtoRepository;
        private final VendaRepository vendaRepository;
        private final ParcelasService parcelas;

        private final NotaFiscalService notaFiscalService;

        @Transactional
        public void inserePagamento(Long idVenda, Long formaPgto, Integer qtdParcelas) {
                UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                                .getPrincipal();

                if (qtdParcelas <= 0) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "Número de parcelas inválido. Informe um valor maior que zero.");
                }
                FormaPgto formaPgtoEntity = this.formaPgtoRepository.findById(formaPgto)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Forma de pagamento não encontrada. Verifique o ID informado."));

                Venda vendaFind = this.vendaRepository.selectByIdAndCodLoja(usuariosLoja.getLojaVinculada().getId(),
                                idVenda);

                if (usuariosLoja.getLojaVinculada().getId() != vendaFind.getLoja().getId()) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                                        "Acesso negado. Você não pode processar pagamentos de vendas de outras lojas.");
                }

                Pagamento pagamentoValidation = this.pagamentoRepository.selectByidVendaAndCodigoFilial(idVenda,
                                vendaFind.getLoja().getId());
                if (pagamentoValidation != null) {
                        if (pagamentoValidation.isConcluida()) {
                                throw new ResponseStatusException(HttpStatus.CONFLICT,
                                                "Esta venda já foi paga e não pode ser processada novamente.");
                        }

                }
                Pagamento pagamento = new Pagamento(vendaFind, formaPgtoEntity, usuariosLoja.getLojaVinculada(),
                                vendaFind.getValorTotal(), null, null,
                                vendaFind.getTicket(), qtdParcelas);
                pagamento.setConcluida(true);
                this.pagamentoRepository.save(pagamento);
                this.notaFiscalService.emitirNotaDeVenda(pagamento.getVenda(), pagamento.getVenda().getItemVenda(),
                                pagamento);

                this.parcelas.insertParcelas(pagamento);
        }

}
