package br.com.SmartPDV.SmartPDV.Entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
	@ManyToOne
	@JoinColumn(name = "id_nota_fiscal")
	private NotaFiscal notaFiscal;
	private Long numero_fiscal_venda;
	private Integer qtdParcelas;
	@OneToMany(mappedBy = "pagamento")
	private List<Parcelas>parcelas = new ArrayList<>();
	public Pagamento(Venda venda, FormaPgto formaPgto, Double valor, BandeirasCartao bandeiraCartao,
			NotaFiscal notaFiscal, Long numero_fiscal_venda, Integer qtdParcelas) {
		this.venda = venda;
		this.formaPgto = formaPgto;
		this.valor = valor;
		this.bandeiraCartao = bandeiraCartao;
		this.notaFiscal = notaFiscal;
		this.numero_fiscal_venda = numero_fiscal_venda;
		this.qtdParcelas = qtdParcelas;
	}

	
	

}
