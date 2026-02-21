package br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VendaItemRequest {

	private String codigo_produto;
	private Integer qtd;
	private Double porcent_Desconto;
	private String cpf_cliente;

}
