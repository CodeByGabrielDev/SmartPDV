package br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotaFiscalImpostoResponse {

    private String tipoImposto;
    private Double baseCalculo;
    private Double aliquota;
    private Double reducaoBase;
    private Double valorCalculado;
}
