package br.com.SmartPDV.SmartPDV.Entities;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Collate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class FormaPgto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "desc_forma_pgto")
	private String descFormaPgto;
	@OneToMany(mappedBy = "formaPgto")
	private List<Pagamento> pgto = new ArrayList<>();

	public FormaPgto(Long id, String descFormaPgto) {
		super();
		this.id = id;
		this.descFormaPgto = descFormaPgto;
	}

}
