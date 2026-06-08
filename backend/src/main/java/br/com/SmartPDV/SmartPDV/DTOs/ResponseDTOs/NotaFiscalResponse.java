package br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs;

import java.time.LocalDateTime;
import java.util.List;

import br.com.SmartPDV.SmartPDV.Enum.StatusNotaFiscal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NotaFiscalResponse {

    private Long nf_numero;
    private Integer serieNf;
    private Long chaveNfe;
    private Integer cfop;
    private String cpf_Cliente;
    private String loja;
    private Double desconto;
    private Double valor_Total_De_Imposto_A_Pagar;
    private Double valor_Bruto_Nota;
    private Double valor_Liquido_Nota;
    private Long ticket_venda;
    private LocalDateTime data_Emissao;
    private StatusNotaFiscal status_Nota;
    private List<NotaFiscalItemResponse> itens;
    private List<NotaFiscalImpostoResponse> impostos;

    public NotaFiscalResponse(Long nf_numero, Integer serieNf, Long chaveNfe, Integer cfop,
            String cpf_Cliente, String loja, Double desconto,
            Double valor_Total_De_Imposto_A_Pagar, Double valor_Bruto_Nota,
            Double valor_Liquido_Nota, Long ticket_venda, LocalDateTime data_Emissao,
            StatusNotaFiscal status_Nota) {
        this.nf_numero = nf_numero;
        this.serieNf = serieNf;
        this.chaveNfe = chaveNfe;
        this.cfop = cfop;
        this.cpf_Cliente = cpf_Cliente;
        this.loja = loja;
        this.desconto = desconto;
        this.valor_Total_De_Imposto_A_Pagar = valor_Total_De_Imposto_A_Pagar;
        this.valor_Bruto_Nota = valor_Bruto_Nota;
        this.valor_Liquido_Nota = valor_Liquido_Nota;
        this.ticket_venda = ticket_venda;
        this.data_Emissao = data_Emissao;
        this.status_Nota = status_Nota;
    }
}
