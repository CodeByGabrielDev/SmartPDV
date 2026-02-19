package br.com.SmartPDV.SmartPDV.Entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.ManyToAny;

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
public class Caixa {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;
	@ManyToOne
	@JoinColumn(name = "id_usuario_abertura")
	private UsuariosLoja usuarios;
	@Column(name = "data_abertura")
	private LocalDateTime dataAbertura;
	@Column(name = "data_fechamento")
	private LocalDateTime dataFechamento;
	@Column(name = "valor_incial")
	private Double valorInicial;
	@Column(name = "valor_final")
	private Double valorFinal;
	private Boolean fechado;
	@OneToMany(mappedBy = "caixa")
	private List<Venda> venda = new ArrayList<>();


	public Caixa(Loja loja, UsuariosLoja usuarios, LocalDateTime dataAbertura, LocalDateTime dataFechamento,
			Double valorInicial, Double valorFinal, Boolean fechado) {
		super();
		this.loja = loja;
		this.usuarios = usuarios;
		this.dataAbertura = dataAbertura;
		this.dataFechamento = dataFechamento;
		this.valorInicial = valorInicial;
		this.valorFinal = valorFinal;
		this.fechado = fechado;
	}
	
	
	

	

}
