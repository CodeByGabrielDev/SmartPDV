package br.com.SmartPDV.SmartPDV.Entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.websocket.server.ServerEndpoint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Loja {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "razao_social")
	private String razaoSocial;
	private String cnpj;
	private String IE;
	private String endereco;
	private Boolean inativo;
	@OneToMany(mappedBy = "loja")
	private List<EstoqueProduto> estoque = new ArrayList<>();
	@OneToMany(mappedBy = "loja")
	private List<MovimentoEstoque> movimento = new ArrayList<>();
	@OneToMany(mappedBy = "loja")
	private List<Caixa> caixa = new ArrayList<>();
	@OneToMany(mappedBy = "loja")
	private List<NotaEntrada> entrada = new ArrayList<>();
	@OneToMany(mappedBy = "loja")
	private List<Venda> venda = new ArrayList<>();
	@OneToMany(mappedBy = "loja")
	private List<ItemVenda> itemVenda = new ArrayList<>();
	@OneToMany(mappedBy = "loja")
	private List<BandeirasCartao> bandeira = new ArrayList<>();
	@OneToMany(mappedBy = "loja")
	private List<NotaFiscal> notaFiscal = new ArrayList<>();
	@OneToMany(mappedBy = "lojaVinculada")
	private List<UsuariosLoja> usuario = new ArrayList<>();
	@OneToMany(mappedBy = "loja")
	private List<NotaFiscalItem> notaItem = new ArrayList<>();

	public Loja(String razaoSocial, String cnpj, String iE, String endereco, Boolean inativo) {
		super();
		this.razaoSocial = razaoSocial;
		this.cnpj = cnpj;
		IE = iE;
		this.endereco = endereco;
		this.inativo = inativo;
	}

}
