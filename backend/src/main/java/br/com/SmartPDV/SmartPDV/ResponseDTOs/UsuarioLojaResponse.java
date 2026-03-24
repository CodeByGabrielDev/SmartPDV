package br.com.SmartPDV.SmartPDV.ResponseDTOs;

public class UsuarioLojaResponse {

	private String nome_vendedor;

	private String cpf;

	private String login;

	private String perfil;

	private String loja;

	public UsuarioLojaResponse(String nome_vendedor, String cpf, String login, String perfil, String loja) {
		super();
		this.nome_vendedor = nome_vendedor;
		this.cpf = cpf;
		this.login = login;
		this.perfil = perfil;
		this.loja = loja;
	}

	public String getNome_vendedor() {
		return nome_vendedor;
	}

	public void setNome_vendedor(String nome_vendedor) {
		this.nome_vendedor = nome_vendedor;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPerfil() {
		return perfil;
	}

	public void setPerfil(String perfil) {
		this.perfil = perfil;
	}

}
