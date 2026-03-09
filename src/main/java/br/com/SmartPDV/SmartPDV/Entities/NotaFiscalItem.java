package br.com.SmartPDV.SmartPDV.Entities;

import java.util.List;

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

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "nota_fiscal_item")
public class NotaFiscalItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "id_nota_fiscal")
	private NotaFiscal nota;
	@Column(name = "nf_numero")
	private Long nfNumero;
	@Column(name = "serie_nfe")
	private Integer serieNfe;
	@ManyToOne
	@JoinColumn(name = "id_produto")
	private Produto produto;
	private Integer numeroItem;
	private Integer quantidadeItens;
	private Double valorBrutoItem;
	private Double valorLiquidoItem;
	private Double desconto;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;
	@ManyToOne
	@JoinColumn(name = "id_excecao_imposto")
	private ExcecaoImposto excecaoImposto;

	public NotaFiscalItem(NotaFiscal nota, Long nfNumero,Integer serieNfe, Produto produto, Integer numeroItem,
			Integer quantidadeItens, Double valorBrutoItem, Double valorLiquidoItem, Double desconto, Loja loja,
			ExcecaoImposto excecaoImposto) {
		
		this.nota = nota;
		this.nfNumero = nfNumero;
		this.serieNfe = serieNfe;
		this.produto = produto;
		this.numeroItem = numeroItem;
		this.quantidadeItens = quantidadeItens;
		this.valorBrutoItem = valorBrutoItem;
		this.valorLiquidoItem = valorLiquidoItem;
		this.desconto = desconto;
		this.loja = loja;
		this.excecaoImposto = excecaoImposto;
	}

}
