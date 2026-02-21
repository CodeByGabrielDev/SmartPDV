package br.com.SmartPDV.SmartPDV.Entities;

import java.time.LocalDateTime;
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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "nota_entrada")
public class NotaEntrada {

	/*
	 * tabela utilizada para no momento que a loja dar entrada na nota que vai estar
	 * pendente no transito de entrada, caso a loja tenha conferido a mercadoria e
	 * dado entrada ai sim vai bater no estoque.
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "nf_numero")
	private Long nfNumero;
	@Column(name = "serie_Nf")
	private Integer serieNf;
	@Column(name = "chave_nfe")
	private String chaveNfe;
	@ManyToOne
	@JoinColumn(name = "id_loja")
	private Loja loja;
	@Column(name = "data_emissao")
	private LocalDateTime dataEmissao;
	@Column(name = "data_entrada")
	private LocalDateTime dataEntrada;
	@Column(name = "valor_total_nota")
	private Double valorTotalNota;
	@Column(name = "valor_total_produtos")
	private Integer valorTotalProdutos;
	@ManyToOne
	@JoinColumn(name = "id_usuario_confirmacao")
	private UsuariosLoja usuario;
	@OneToMany(mappedBy = "entradaMercadoria")
	private List<MovimentoEstoque>mov = new ArrayList<>();

	private String obs;

	public NotaEntrada(Long nfNumero, Integer serieNf, String chaveNfe, Loja loja, LocalDateTime dataEmissao,
			LocalDateTime dataEntrada, Double valorTotalNota, Integer valorTotalProdutos, UsuariosLoja usuario,
			String obs) {
		super();
		this.nfNumero = nfNumero;
		this.serieNf = serieNf;
		this.chaveNfe = chaveNfe;
		this.loja = loja;
		this.dataEmissao = dataEmissao;
		this.dataEntrada = dataEntrada;
		this.valorTotalNota = valorTotalNota;
		this.valorTotalProdutos = valorTotalProdutos;
		this.usuario = usuario;
		this.obs = obs;
	}

	
}
