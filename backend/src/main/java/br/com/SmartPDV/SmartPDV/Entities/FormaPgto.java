package br.com.SmartPDV.SmartPDV.Entities;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Collate;

import br.com.SmartPDV.SmartPDV.Enum.FormaPagamento;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class FormaPgto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "desc_forma_pgto")
	private String descFormaPgto;
	@Enumerated(EnumType.STRING)
	private FormaPagamento formaPagamento;
	@OneToMany(mappedBy = "formaPgto")
	private List<Pagamento> pgto = new ArrayList<>();

	public FormaPgto(String descFormaPgto, FormaPagamento formaPagamento) {
		this.descFormaPgto = descFormaPgto;
		this.formaPagamento = formaPagamento;
	}

}
