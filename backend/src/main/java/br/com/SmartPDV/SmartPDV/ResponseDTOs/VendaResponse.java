package br.com.SmartPDV.SmartPDV.ResponseDTOs;

import java.time.LocalDateTime;

import br.com.SmartPDV.SmartPDV.Entities.Caixa;
import br.com.SmartPDV.SmartPDV.Entities.Clientes;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VendaResponse {

	private Long ticket;
	private Long id_caixa;
	private String cpf_cliente;
	private LocalDateTime data_hora_venda;
	private Double valor_total;
	private Long id_loja;
	private Double desconto;
	private String nome_funcionario;
	private Long numero_fiscal;
}
