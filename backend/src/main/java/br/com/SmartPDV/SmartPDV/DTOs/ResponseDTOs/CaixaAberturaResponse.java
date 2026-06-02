package br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CaixaAberturaResponse {

	private Long id;
	private String nome_loja;
	private String nome_usuario_abertura;
	private LocalDateTime horario_abertura;

	public CaixaAberturaResponse(Long id, String nome_loja, String nome_usuario_abertura, LocalDateTime horario_abertura) {
		super();
		this.id = id;
		this.nome_loja = nome_loja;
		this.nome_usuario_abertura = nome_usuario_abertura;
		this.horario_abertura = horario_abertura;
	}

}
