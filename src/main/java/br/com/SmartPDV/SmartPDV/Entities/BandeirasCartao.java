package br.com.SmartPDV.SmartPDV.Entities;

import java.util.ArrayList;
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
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name = "bandeiras_cartao")
public class BandeirasCartao {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "tipo_bandeira")
	private String tipoBandeira;
	@OneToMany(mappedBy = "bandeiraCartao")
	private List<Pagamento> bandeira = new ArrayList<>();
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;

	public BandeirasCartao(String tipoBandeira, Loja loja) {
		super();
		this.tipoBandeira = tipoBandeira;
		this.loja = loja;
	}

}
