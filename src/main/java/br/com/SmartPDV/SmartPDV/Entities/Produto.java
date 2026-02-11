package br.com.SmartPDV.SmartPDV.Entities;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.ManyToAny;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Produto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String descricao;
	@Column(name = "codigo_barra")
	private String codigoBarra;
	private String sku;
	@Column(name = "preco_venda")
	private double precoVenda;
	private double custo;
	private boolean inativo;
	@OneToMany(mappedBy = "produto")
	private List<EstoqueProduto> estoqueProd = new ArrayList<>();
	@OneToMany(mappedBy = "produto")
	private List<MovimentoEstoque> movimento = new ArrayList<>();
	@OneToMany(mappedBy = "produto")
	private List<ItemVenda> itemVenda = new ArrayList<>();
	@OneToMany(mappedBy = "produto")
	private List<NotaFiscalItem> notaFiscalItem = new ArrayList<>();

	public Produto() {

	}

	public Produto(String descricao, String codigoBarra, String sku, double precoVenda, double custo, boolean inativo) {
		super();
		this.descricao = descricao;
		this.codigoBarra = codigoBarra;
		this.sku = sku;
		this.precoVenda = precoVenda;
		this.custo = custo;
		this.inativo = inativo;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getDesc() {
		return descricao;
	}

	public void setDesc(String descricao) {
		this.descricao = descricao;
	}

	public String getCodigoBarra() {
		return codigoBarra;
	}

	public void setCodigoBarra(String codigoBarra) {
		this.codigoBarra = codigoBarra;
	}

	public String getSku() {
		return sku;
	}

	public void setSku(String sku) {
		this.sku = sku;
	}

	public double getPrecoVenda() {
		return precoVenda;
	}

	public void setPrecoVenda(double precoVenda) {
		this.precoVenda = precoVenda;
	}

	public double getCusto() {
		return custo;
	}

	public void setCusto(double custo) {
		this.custo = custo;
	}

	public boolean isInativo() {
		return inativo;
	}

	public void setInativo(boolean inativo) {
		this.inativo = inativo;
	}

}
