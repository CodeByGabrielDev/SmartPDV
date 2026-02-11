package br.com.SmartPDV.SmartPDV.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Digits;

@Entity
public class Pagamento {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_venda")
	private Venda venda;
	@ManyToOne
	@JoinColumn(name = "forma_pgto")
	private FormaPgto formaPgto;

	private double valor;
	@ManyToOne
	@JoinColumn(name = "bandeira_cartao")
	private BandeirasCartao bandeiraCartao;

	private int qtdParcelas;

	public Pagamento(Venda venda, FormaPgto formaPgto, double valor, BandeirasCartao bandeiraCartao, int qtdParcelas) {
		super();
		this.venda = venda;
		this.formaPgto = formaPgto;
		this.valor = valor;
		this.bandeiraCartao = bandeiraCartao;
		this.qtdParcelas = qtdParcelas;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Venda getVenda() {
		return venda;
	}

	public void setVenda(Venda venda) {
		this.venda = venda;
	}

	public FormaPgto getFormaPgto() {
		return formaPgto;
	}

	public void setFormaPgto(FormaPgto formaPgto) {
		this.formaPgto = formaPgto;
	}

	public double getValor() {
		return valor;
	}

	public void setValor(double valor) {
		this.valor = valor;
	}

	public BandeirasCartao getBandeiraCartao() {
		return bandeiraCartao;
	}

	public void setBandeiraCartao(BandeirasCartao bandeiraCartao) {
		this.bandeiraCartao = bandeiraCartao;
	}

	public int getQtdParcelas() {
		return qtdParcelas;
	}

	public void setQtdParcelas(int qtdParcelas) {
		this.qtdParcelas = qtdParcelas;
	}

}
