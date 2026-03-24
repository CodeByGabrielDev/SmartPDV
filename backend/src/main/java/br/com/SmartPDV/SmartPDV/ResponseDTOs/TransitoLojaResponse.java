package br.com.SmartPDV.SmartPDV.ResponseDTOs;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransitoLojaResponse {
	private Long id;
	private String loja_Origem_Nome;
	private String loja_Destino_Nome;
	private Long numero_Nota;
	private LocalDateTime data_Envio;
	private LocalDateTime data_Recebimento;

}
