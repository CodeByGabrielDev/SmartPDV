package br.com.SmartPDV.SmartPDV.ResponseDTOs;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Entities.Venda;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CaixaFechamentoResponse {

	private String nome_loja;
	private String login_usuario_fechamento;
	private LocalDateTime data_abertura;
	private LocalDateTime data_fechamento;
	private Double valor_inicial;
	private Double valor_final;

	public CaixaFechamentoResponse(String nome_loja, String login_usuario_fechamento, LocalDateTime data_abertura,
			LocalDateTime data_fechamento, Double valor_inicial, Double valor_final) {
		super();
		this.nome_loja = nome_loja;
		this.login_usuario_fechamento = login_usuario_fechamento;
		this.data_abertura = data_abertura;
		this.data_fechamento = data_fechamento;
		this.valor_inicial = valor_inicial;
		this.valor_final = valor_final;
	}

}
