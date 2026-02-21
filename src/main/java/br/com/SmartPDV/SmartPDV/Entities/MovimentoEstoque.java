package br.com.SmartPDV.SmartPDV.Entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.ManyToAny;

import br.com.SmartPDV.SmartPDV.Enum.TipoDeMovimento;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "movimento_estoque")
public class MovimentoEstoque {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "id_produto")
	private Produto produto;
	@Column(name = "qtd_itens")
	private Integer qtdItens;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;
	private TipoDeMovimento tipo;
	@ManyToOne
	@JoinColumn(name = "id_nota_entrada")
	private NotaEntrada entradaMercadoria;
	@Column(name = "data_movimentacao")
	private LocalDateTime dataMovimento;

	public MovimentoEstoque(Produto produto, Loja loja, TipoDeMovimento tipo, LocalDateTime dataMovimento) {
		super();
		this.produto = produto;
		this.loja = loja;
		this.tipo = tipo;
		this.dataMovimento = dataMovimento;
	}

}
