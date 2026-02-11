package br.com.SmartPDV.SmartPDV.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "PDV_configuracao")
public class PDVConfiguracao {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_loja_vinculacao")
	private Loja loja;
	@Min(1)
	@Max(10)
	private int numeroTerminal;
	private boolean inativo;

	public PDVConfiguracao(Loja loja, @Min(1) @Max(10) int numeroTerminal, boolean inativo) {
		super();
		this.loja = loja;
		this.numeroTerminal = numeroTerminal;
		this.inativo = inativo;
	}

}
