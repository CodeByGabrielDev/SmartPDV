package br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LojaResponse {
	private Long id;
	private String razaoSocial;
	private String cnpj;
	@JsonProperty("IE")
	private String IE;
	private String endereco;
}
