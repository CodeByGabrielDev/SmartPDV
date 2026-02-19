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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "nota_entrada")
public class NotaEntrada {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long nfNumero;
	@Column(name = "chave_nfe")
	private Long chaveNfe;
	@Column(name = "qtd_produtos")
	private Integer qtdProduto;
	private Boolean entradaRealizada;
	@Column(name = "data_emissao")
	private LocalDateTime dataEmissao;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;



	public NotaEntrada(Long nfNumero, Long chaveNfe, Integer qtdProduto, Boolean entradaRealizada,
			LocalDateTime dataEmissao, Loja loja) {
		super();
		this.nfNumero = nfNumero;
		this.chaveNfe = chaveNfe;
		this.qtdProduto = qtdProduto;
		this.entradaRealizada = entradaRealizada;
		this.dataEmissao = dataEmissao;
		this.loja = loja;
	}

	
}
