package br.com.SmartPDV.SmartPDV.Entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "transito_entrada_fiscal")
public class TransitoEntradaFiscal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long nfNumero;
	@Column(name = "momento_de_entrada")
	private LocalDateTime momentoEntrada;

	@Column(name = "data_emissao")
	private LocalDateTime dataEmissao;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;
	@Column(name = "qtd_produtos")
	private int qtdProdutos;
	
	
	
}
