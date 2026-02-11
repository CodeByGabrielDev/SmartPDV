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
@Table(name = "nota_entrada")
public class NotaEntrada {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long nfNumero;
	@Column(name = "chave_nfe")
	private long chaveNfe;
	@Column(name = "qtd_produtos")
	private int qtdProduto;
	private boolean entradaRealizada;
	@Column(name = "data_emissao")
	private LocalDateTime dataEmissao;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;

	public NotaEntrada() {

	}

	public NotaEntrada(long nfNumero, long chaveNfe, int qtdProduto, boolean entradaRealizada,
			LocalDateTime dataEmissao, Loja loja) {
		super();
		this.nfNumero = nfNumero;
		this.chaveNfe = chaveNfe;
		this.qtdProduto = qtdProduto;
		this.entradaRealizada = entradaRealizada;
		this.dataEmissao = dataEmissao;
		this.loja = loja;
	}

	public long getNfNumero() {
		return nfNumero;
	}

	public void setNfNumero(long nfNumero) {
		this.nfNumero = nfNumero;
	}

	public long getChaveNfe() {
		return chaveNfe;
	}

	public void setChaveNfe(long chaveNfe) {
		this.chaveNfe = chaveNfe;
	}

	public boolean isEntradaRealizada() {
		return entradaRealizada;
	}

	public void setEntradaRealizada(boolean entradaRealizada) {
		this.entradaRealizada = entradaRealizada;
	}

	public LocalDateTime getDataEmissao() {
		return dataEmissao;
	}

	public void setDataEmissao(LocalDateTime dataEmissao) {
		this.dataEmissao = dataEmissao;
	}

}
