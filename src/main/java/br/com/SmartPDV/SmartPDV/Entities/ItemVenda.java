package br.com.SmartPDV.SmartPDV.Entities;

import org.hibernate.annotations.Collate;

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
@NoArgsConstructor
@Getter
@Setter
@Table(name = "item_venda")
public class ItemVenda {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_venda")
	private Venda venda;
	@ManyToOne
	@JoinColumn(name = "id_produto")
	private Produto produto;
	private int qtd;
	@Column(name = "valor_unitario")
	private double valorUnitario;
	@Column(name = "valor_total")
	private double valorTotal;
	@Column(name = "porcentagem_desconto")
	private double porcentDesconto;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;

	public ItemVenda(Venda venda, Produto produto, int qtd, double valorUnitario, double valorTotal) {
		super();
		this.venda = venda;
		this.produto = produto;
		this.qtd = qtd;
		this.valorUnitario = valorUnitario;
		this.valorTotal = valorTotal;
	}

}
