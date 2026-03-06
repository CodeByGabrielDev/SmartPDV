package br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

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
	@JsonProperty("id_Loja")
	private Long idLoja;
	@JsonProperty("cpf_cliente")
	private String cpfCliente;


}
