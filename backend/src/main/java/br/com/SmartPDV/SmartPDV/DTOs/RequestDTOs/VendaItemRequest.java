package br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VendaItemRequest {

	private List<ItensVendaRequest>itens_venda;

}
