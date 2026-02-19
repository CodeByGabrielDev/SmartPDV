package br.com.SmartPDV.SmartPDV.Entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import br.com.SmartPDV.SmartPDV.Entities.Loja;
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
@Table(name = "excecao_imposto")
@Getter
@Setter
@NoArgsConstructor
public class ExcecaoImposto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "data_criacao")
	private LocalDateTime dataCriacao;
	@Column(name = "natureza_operacao")
	private Integer naturezaoOperacao;
	@ManyToOne
	@JoinColumn(name = "id_loja_filial")
	private Loja loja;
	private String descricao;
	private Boolean inativo;
	@Column(name = "atualizado_em")
	private LocalDateTime atualizadoEm;
	@OneToMany(mappedBy = "excecaoImposto")
	private List<ExcecaoImpostoItem> excecaoImpostoItem = new ArrayList<>();
	@OneToMany(mappedBy = "excecaoImposto")
	private List<NotaFiscalItem> itensFiscais = new ArrayList<>();


	public ExcecaoImposto(LocalDateTime dataCriacao, Integer naturezaoOperacao, Loja loja, String descricao,
			Boolean inativo, LocalDateTime atualizadoEm) {
		super();
		this.dataCriacao = dataCriacao;
		this.naturezaoOperacao = naturezaoOperacao;
		this.loja = loja;
		this.descricao = descricao;
		this.inativo = inativo;
		this.atualizadoEm = atualizadoEm;
	}

}
