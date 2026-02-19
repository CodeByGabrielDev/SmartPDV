package br.com.SmartPDV.SmartPDV.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Digits;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Pagamento {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "id_venda")
	private Venda venda;
	@ManyToOne
	@JoinColumn(name = "forma_pgto")
	private FormaPgto formaPgto;

	private Double valor;
	@ManyToOne
	@JoinColumn(name = "bandeira_cartao")
	private BandeirasCartao bandeiraCartao;

	private Integer qtdParcelas;

	public Pagamento(Venda venda, FormaPgto formaPgto, Double valor, BandeirasCartao bandeiraCartao,
			Integer qtdParcelas) {
		super();
		this.venda = venda;
		this.formaPgto = formaPgto;
		this.valor = valor;
		this.bandeiraCartao = bandeiraCartao;
		this.qtdParcelas = qtdParcelas;
	}

}
