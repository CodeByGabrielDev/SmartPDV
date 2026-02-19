package br.com.SmartPDV.SmartPDV.Entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Collate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Venda {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_caixa")
	private Caixa caixa;
	@ManyToOne
	@JoinColumn(name = "id_cliente_vinculado")
	private Clientes cliente;
	@Column(name = "data_hora")
	private LocalDateTime dataHora;
	@Column(name = "valor_total")
	private double valorTotal;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;
	private double desconto;
	@ManyToOne
	@JoinColumn(name = "id_funcionario")
	private UsuariosLoja usuario;
	@OneToMany(mappedBy = "venda")
	private List<ItemVenda> itemVenda = new ArrayList<>();
	@OneToMany(mappedBy = "venda")
	private List<Pagamento> pgto = new ArrayList<>();
	@OneToMany(mappedBy = "venda")
	private List<NotaFiscal> nota = new ArrayList<>();

	public Venda(Caixa caixa, Clientes cliente, LocalDateTime dataHora, double valorTotal, Loja loja, double desconto,
			UsuariosLoja usuario) {
		super();
		this.caixa = caixa;
		this.cliente = cliente;
		this.dataHora = dataHora;
		this.valorTotal = valorTotal;
		this.loja = loja;
		this.desconto = desconto;
		this.usuario = usuario;
	}

}
