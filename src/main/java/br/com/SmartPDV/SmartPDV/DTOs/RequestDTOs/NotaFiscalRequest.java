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
public class NotaFiscalRequest {

	private Integer cfop;
	private Integer serieNfe;
	private List<NotaFiscalItemRequest> codigo_barra;
	private Long id_Loja;

}
