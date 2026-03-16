package br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs;

import br.com.SmartPDV.SmartPDV.Enum.TiposCliente;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ClienteRequest {
    
    private String nome_cliente;
    private String cep;
	private String cpf_cnpj;
	private String email;
	private String telefone;
	private TiposCliente tipo;
}
