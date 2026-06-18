package br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VendaResponse {

	@JsonProperty("id")
	private Long id_banco;

	private Long ticket;
	
	@JsonProperty("idCaixa")
	private Long id_caixa;
	
	@JsonProperty("cpfCliente")
	private String cpf_cliente;
	
	@JsonProperty("dataHora")
	private LocalDateTime data_hora_venda;
	
	@JsonProperty("valorTotal")
	private Double valor_total;
	
	@JsonProperty("idLoja")
	private Long id_loja;
	
	private Double desconto;
	
	@JsonProperty("nomeVendedor")
	private String nome_funcionario;
	
	@JsonProperty("numeroFiscal")
	private Long numero_fiscal;

	@JsonProperty("cancelada")
	private Boolean cancelada;

	@JsonProperty("valorCancelado")
	private Double valorCancelado;

	@JsonProperty("motivoCancelamento")
	private String motivoCancelamento;

	@JsonProperty("dataCancelamento")
	private LocalDateTime dataCancelamento;
}
