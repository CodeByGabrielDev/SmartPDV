package br.com.SmartPDV.SmartPDV.ResponseDTOs;

import java.time.LocalDateTime;

import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

public class CaixaAberturaResponse {

	private String nome_loja;
	private String nome_usuario_abertura;
	private LocalDateTime horario_abertura;

	public CaixaAberturaResponse(String nome_loja, String nome_usuario_abertura, LocalDateTime horario_abertura) {
		super();
		this.nome_loja = nome_loja;
		this.nome_usuario_abertura = nome_usuario_abertura;
		this.horario_abertura = horario_abertura;
	}

}
