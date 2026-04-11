package br.com.SmartPDV.SmartPDV.ResponseDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PagamentoResponse {

    private String ticket_venda;
    private String forma_Pgto;
    private String nome_loja;
    private Double valor;
    private String bandeira_Cartao;
    private Long numero_nota_Fiscal;
    private Integer qtd_Parcelas;

}
