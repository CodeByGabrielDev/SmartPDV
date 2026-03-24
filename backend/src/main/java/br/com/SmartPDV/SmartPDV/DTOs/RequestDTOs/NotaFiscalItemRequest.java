package br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class NotaFiscalItemRequest {
	private String codigo_barra;
	private Integer quantidade_Itens;
	private Double desconto;
}
