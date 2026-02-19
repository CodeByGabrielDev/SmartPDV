package br.com.SmartPDV.SmartPDV.Entities;

import br.com.SmartPDV.SmartPDV.Enum.TipoImposto;
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
@Getter
@Setter
@NoArgsConstructor
@Table(name = "nota_fiscal_imposto_item")
public class NotaFiscalImpostoItem {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private TipoImposto tipo;
	@ManyToOne
	@JoinColumn(name = "nf_numero")
	private NotaFiscal numero;
	@Column(name = "valor_liquido_produto")
	private Double valorLiquidoProduto;
	@Column(name = "base_calculo")
	private Double baseCalculo;
	@Column(name = "aliquota_aplicada")
	private Double aliquotaAplicada;
	@Column(name = "reducao_base_")
	private Double reducaoBaseAplicada;

	private Double valorImpostoCalculado;
	/*
	 * tabela que vou utilizar para calcular o imposto, por exemplo, uma nota fiscal
	 * que contem 200 reais em produtos pode conter uma redução na base de calculo
	 * para seguir na implementação do calculo de imposto.
	 * 
	 */

	public NotaFiscalImpostoItem(TipoImposto tipo, NotaFiscal numero, Double valorLiquidoProduto, Double baseCalculo,
			Double aliquotaAplicada, Double reducaoBaseAplicada, Double valorImpostoCalculado) {
		super();
		this.tipo = tipo;
		this.numero = numero;
		this.valorLiquidoProduto = valorLiquidoProduto;
		this.baseCalculo = baseCalculo;
		this.aliquotaAplicada = aliquotaAplicada;
		this.reducaoBaseAplicada = reducaoBaseAplicada;
		this.valorImpostoCalculado = valorImpostoCalculado;

	}

}
