package br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs;

import br.com.SmartPDV.SmartPDV.Enum.TipoImposto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExcecaoImpostoItemRequest {

	private TipoImposto tipo;
	private double aliquota;
	private double reducao_Base;
}
