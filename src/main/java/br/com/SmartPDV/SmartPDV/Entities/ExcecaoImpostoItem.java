package br.com.SmartPDV.SmartPDV.Entities;

import br.com.SmartPDV.SmartPDV.Enum.TipoImposto;
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
@Table(name = "excecao_imposto_item")
@Getter
@Setter
@NoArgsConstructor
public class ExcecaoImpostoItem {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "id_excecao_imposto")
	private ExcecaoImposto excecaoImposto;
	private TipoImposto tipo;
	private Double aliquota;
	private Double reducaoBase;
	private Boolean inativo;

	public ExcecaoImpostoItem(ExcecaoImposto excecaoImposto, TipoImposto tipo, Double aliquota, Double reducaoBase,
			Boolean inativo) {
		super();
		this.excecaoImposto = excecaoImposto;
		this.tipo = tipo;
		this.aliquota = aliquota;
		this.reducaoBase = reducaoBase;
		this.inativo = inativo;
	}

}
