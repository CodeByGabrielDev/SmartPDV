package br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItensVendaRequest {

    private String codigo_barra;
    private Integer qtd_item;
    private Double desconto;
}
