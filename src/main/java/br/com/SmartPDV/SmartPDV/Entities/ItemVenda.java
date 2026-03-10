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
	private Long id;
	@ManyToOne
	@JoinColumn(name = "id_venda")
	private Venda venda;

	private Long ticket;
	@ManyToOne
	@JoinColumn(name = "id_produto")
	private Produto produto;
	private Integer qtd;
	@Column(name = "valor_unitario")
	private Double valorUnitario;
	@Column(name = "valor_total")
	private Double valorTotal;
	@Column(name = "porcentagem_desconto")
	private Double porcentDesconto;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;

	public ItemVenda(Venda venda,Long ticket, Produto produto, Integer qtd, Double valorUnitario, Double valorTotal,
			Double porcentDesconto, Loja loja) {
		this.venda = venda;
		this.ticket = ticket;
		this.produto = produto;
		this.qtd = qtd;
		this.valorUnitario = valorUnitario;
		this.valorTotal = valorTotal;
		this.porcentDesconto = porcentDesconto;
		this.loja = loja;
	}

}
