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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "estoque_produto")
public class EstoqueProduto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "id_produto")
	private Produto produto;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;
	@Column(name = "qtd_atual")
	private Integer qtdAtual;

	public EstoqueProduto(Produto produto, Loja loja, Integer qtdAtual) {
		super();
		this.produto = produto;
		this.loja = loja;
		this.qtdAtual = qtdAtual;
	}

}
