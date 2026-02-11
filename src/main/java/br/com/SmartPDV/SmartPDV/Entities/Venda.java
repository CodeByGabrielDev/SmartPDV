package br.com.SmartPDV.SmartPDV.Entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Collate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Venda {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_caixa")
	private Caixa caixa;
	@ManyToOne
	@JoinColumn(name = "id_cliente_vinculado")
	private Clientes cliente;
	@Column(name = "data_hora")
	private LocalDateTime dataHora;
	@Column(name = "valor_total")
	private double valorTotal;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;
	private double desconto;
	@ManyToOne
	@JoinColumn(name = "id_funcionario")
	private UsuariosLoja usuario;
	@OneToMany(mappedBy = "venda")
	private List<ItemVenda>itemVenda = new ArrayList<>();
	@OneToMany(mappedBy = "venda")
	private List<Pagamento>pgto = new ArrayList<>();
	@OneToMany(mappedBy = "venda")
	private List<NotaFiscal>nota = new ArrayList<>();
	
	public Venda(Caixa caixa, Clientes cliente, LocalDateTime dataHora, double valorTotal, double desconto) {
		super();
		this.caixa = caixa;
		this.cliente = cliente;
		this.dataHora = dataHora;
		this.valorTotal = valorTotal;
		this.desconto = desconto;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Caixa getCaixa() {
		return caixa;
	}

	public void setCaixa(Caixa caixa) {
		this.caixa = caixa;
	}

	public Clientes getCliente() {
		return cliente;
	}

	public void setCliente(Clientes cliente) {
		this.cliente = cliente;
	}

	public LocalDateTime getDataHora() {
		return dataHora;
	}

	public void setDataHora(LocalDateTime dataHora) {
		this.dataHora = dataHora;
	}

	public double getValorTotal() {
		return valorTotal;
	}

	public void setValorTotal(double valorTotal) {
		this.valorTotal = valorTotal;
	}

	public double getDesconto() {
		return desconto;
	}

	public void setDesconto(double desconto) {
		this.desconto = desconto;
	}

}
