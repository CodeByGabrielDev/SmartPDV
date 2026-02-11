package br.com.SmartPDV.SmartPDV.Entities;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Collate;
import org.hibernate.annotations.ManyToAny;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "estoque_produto")
public class EstoqueProduto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_produto")
	private Produto produto;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;
	@Column(name = "qtd_atual")
	private int qtdAtual;

	
	
	public EstoqueProduto() {

	}

	public EstoqueProduto(Produto produto, Loja loja, int qtdAtual) {
		super();
		this.produto = produto;
		this.loja = loja;
		this.qtdAtual = qtdAtual;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Produto getProduto() {
		return produto;
	}

	public void setProduto(Produto produto) {
		this.produto = produto;
	}

	public Loja getCodigoFilial() {
		return loja;
	}

	public void setCodigoFilial(Loja loja) {
		this.loja = loja;
	}

	public int getQtdAtual() {
		return qtdAtual;
	}

	public void setQtdAtual(int qtdAtual) {
		this.qtdAtual = qtdAtual;
	}

}
