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

@Entity
@Table(name = "movimento_estoque")
public class MovimentoEstoque {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_produto")
	private Produto produto;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;
	private TipoDeMovimento tipo;
	@Column(name = "data_movimentacao")
	private LocalDateTime dataMovimento;

	public MovimentoEstoque() {

	}

	public MovimentoEstoque(Produto produto, Loja loja, TipoDeMovimento tipo, LocalDateTime dataMovimento) {
		super();
		this.produto = produto;
		this.loja = loja;
		this.tipo = tipo;
		this.dataMovimento = dataMovimento;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Produto getProduto() {
		return produto;
	}

	public void setProduto(Produto produto) {
		this.produto = produto;
	}

	public Loja getLoja() {
		return loja;
	}

	public void setLoja(Loja loja) {
		this.loja = loja;
	}

	public TipoDeMovimento getTipo() {
		return tipo;
	}

	public void setTipo(TipoDeMovimento tipo) {
		this.tipo = tipo;
	}

	public LocalDateTime getDataMovimento() {
		return dataMovimento;
	}

	public void setDataMovimento(LocalDateTime dataMovimento) {
		this.dataMovimento = dataMovimento;
	}
	
	

}
