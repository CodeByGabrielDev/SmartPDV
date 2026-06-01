package br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs;

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
	private String IE;
	private String endereco;

	

}
