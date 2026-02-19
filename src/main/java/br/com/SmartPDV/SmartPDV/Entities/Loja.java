package br.com.SmartPDV.SmartPDV.Entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Loja {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@Column(name = "razao_social")
	private String razaoSocial;

	private String cnpj;

	private String IE;

	private String endereco;

	private boolean inativo;
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
	private List<NotaFiscalItem>notaItem = new ArrayList<>();

	public Loja() {

	}

	public Loja(String razaoSocial, String cnpj, String iE, String endereco, boolean inativo) {
		super();
		this.razaoSocial = razaoSocial;
		this.cnpj = cnpj;
		IE = iE;
		this.endereco = endereco;
		this.inativo = inativo;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getRazaoSocial() {
		return razaoSocial;
	}

	public void setRazaoSocial(String razaoSocial) {
		this.razaoSocial = razaoSocial;
	}

	public String getCnpj() {
		return cnpj;
	}

	public void setCnpj(String cnpj) {
		this.cnpj = cnpj;
	}

	public String getIE() {
		return IE;
	}

	public void setIE(String iE) {
		IE = iE;
	}

	public String getEndereco() {
		return endereco;
	}

	public void setEndereco(String endereco) {
		this.endereco = endereco;
	}

	public boolean isInativo() {
		return inativo;
	}

	public void setInativo(boolean inativo) {
		this.inativo = inativo;
	}

}
