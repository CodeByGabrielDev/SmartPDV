package br.com.SmartPDV.SmartPDV.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "nota_fiscal_item")
public class NotaFiscalItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long nfNumero;
	@Column(name = "serie_nfe")
	private int serieNfe;
	@ManyToOne
	@JoinColumn(name = "id_produto")
	private Produto produto;

	public NotaFiscalItem(long nfNumero, int serieNfe, Produto produto) {
		super();
		this.nfNumero = nfNumero;
		this.serieNfe = serieNfe;
		this.produto = produto;
	}

	public long getNfNumero() {
		return nfNumero;
	}

	public void setNfNumero(long nfNumero) {
		this.nfNumero = nfNumero;
	}

	public int getSerieNfe() {
		return serieNfe;
	}

	public void setSerieNfe(int serieNfe) {
		this.serieNfe = serieNfe;
	}

	public Produto getProduto() {
		return produto;
	}

	public void setProduto(Produto produto) {
		this.produto = produto;
	}
	
	

}
