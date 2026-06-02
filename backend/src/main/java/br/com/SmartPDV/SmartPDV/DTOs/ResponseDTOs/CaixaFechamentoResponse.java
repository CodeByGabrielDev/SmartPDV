package br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs;

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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CaixaFechamentoResponse {

	private Long id;
	private String nome_loja;
	private String login_usuario_fechamento;
	private LocalDateTime data_abertura;
	private LocalDateTime data_fechamento;
	private Double valor_inicial;
	private Double valor_final;

}
