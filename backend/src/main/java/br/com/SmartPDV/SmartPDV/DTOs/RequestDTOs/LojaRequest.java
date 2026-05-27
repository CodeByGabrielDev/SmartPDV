package br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LojaRequest {

	private String razaoSocial;
	private String cnpj;
	private String IE;
	private String endereco;

}
