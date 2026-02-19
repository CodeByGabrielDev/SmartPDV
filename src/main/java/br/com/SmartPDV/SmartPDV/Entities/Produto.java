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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Produto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String descricao;
	@Column(name = "codigo_barra")
	private String codigoBarra;
	private String sku;
	@Column(name = "preco_venda")
	private Double precoVenda;
	private Double custo;
	private Boolean inativo;
	@OneToMany(mappedBy = "produto")
	private List<EstoqueProduto> estoqueProd = new ArrayList<>();
	@OneToMany(mappedBy = "produto")
	private List<MovimentoEstoque> movimento = new ArrayList<>();
	@OneToMany(mappedBy = "produto")
	private List<ItemVenda> itemVenda = new ArrayList<>();
	@OneToMany(mappedBy = "produto")
	private List<NotaFiscalItem> notaFiscalItem = new ArrayList<>();

	

	public Produto(String descricao, String codigoBarra, String sku, Double precoVenda, Double custo, Boolean inativo) {
		super();
		this.descricao = descricao;
		this.codigoBarra = codigoBarra;
		this.sku = sku;
		this.precoVenda = precoVenda;
		this.custo = custo;
		this.inativo = inativo;
	}

	

}
