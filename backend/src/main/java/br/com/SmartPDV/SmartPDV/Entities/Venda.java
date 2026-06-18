package br.com.SmartPDV.SmartPDV.Entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Collate;

import jakarta.persistence.CascadeType;
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
	private Long id;

	private Long ticket;
	@ManyToOne
	@JoinColumn(name = "id_caixa")
	private Caixa caixa;
	@ManyToOne
	@JoinColumn(name = "id_cliente_vinculado")
	private Clientes cliente;
	@Column(name = "data_hora")
	private LocalDateTime dataHora;
	@Column(name = "valor_total")
	private Double valorTotal;
	@Column(name = "valor_cancelado")
	private Double valorCancelado;
	@Column(name = "data_cancelamento")
	private LocalDateTime dataCancelamento;
	@Column(name = "motivo_cancelamento")
	private String motivoCancelamento;
	private Boolean cancelada;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;
	private Double desconto;
	@ManyToOne
	@JoinColumn(name = "id_funcionario")
	private UsuariosLoja usuario;
	@OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ItemVenda> itemVenda = new ArrayList<>();
	@OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Pagamento> pgto = new ArrayList<>();
	@OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<NotaFiscal> nota = new ArrayList<>();

	public Venda(Long ticket, Caixa caixa, Clientes cliente, LocalDateTime dataHora, Double valorTotal,
			Double valorCancelado, Boolean cancelada, Loja loja,
			Double desconto,
			UsuariosLoja usuario) {
		super();
		this.ticket = ticket;
		this.caixa = caixa;
		this.cliente = cliente;
		this.dataHora = dataHora;
		this.valorTotal = valorTotal;
		this.valorCancelado = valorCancelado;
		this.cancelada = cancelada;
		this.loja = loja;
		this.desconto = desconto;
		this.usuario = usuario;
	}

}
