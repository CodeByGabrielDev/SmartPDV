package br.com.SmartPDV.SmartPDV.Entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import br.com.SmartPDV.SmartPDV.Enum.StatusNotaFiscal;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "nota_fiscal")
public class NotaFiscal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long nf_numero;
	@Column(name = "serie_nf")
	private Integer serieNf;
	@Column(name = "chave_nfe")
	private Long chaveNfe;
	private Integer cfop;
	@ManyToOne
	@JoinColumn(name = "id_cliente")
	private Clientes cliente;
	@Column(name = "cpf_cliente")
	private String cpfCliente;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;
	private double desconto;
	@Column(name = "valor_total_imposto")
	private Double valorTotalDeImpostoAPagar;
	@Column(name = "valor_bruto_nota")
	private Double valorBrutoNota;
	@Column(name = "valor_liquido_nota")
	private Double valorLiquidoNota;
	@ManyToOne
	@JoinColumn(name = "id_venda_vinculada")
	private Venda venda;
	@Column(name = "data_emissao")
	private LocalDateTime dataEmissao;
	@Column(name = "status_nota")
	private StatusNotaFiscal statusNota;
	@OneToMany(mappedBy = "nota")
	private List<NotaFiscalItem> itensFiscais = new ArrayList<>();
	@OneToMany(mappedBy = "numero")
	private List<NotaFiscalImpostoItem> numero = new ArrayList<>();

	public NotaFiscal(Integer serieNf, Long chaveNfe, Integer cfop, Loja loja, Double desconto, Venda venda,
			LocalDateTime dataEmissao, StatusNotaFiscal statusNota) {
		super();
		this.serieNf = serieNf;
		this.chaveNfe = chaveNfe;
		this.cfop = cfop;
		this.loja = loja;
		this.desconto = desconto;
		this.venda = venda;
		this.dataEmissao = dataEmissao;
		this.statusNota = statusNota;
	}

}
