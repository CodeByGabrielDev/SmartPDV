package br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotaFiscalItemResponse {

    private Integer numeroItem;
    private String descricaoProduto;
    private String codigoBarra;
    private Integer quantidade;
    private Double valorBrutoItem;
    private Double valorLiquidoItem;
    private Double desconto;
}
