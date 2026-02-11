package br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs;

import org.hibernate.validator.constraints.br.CPF;

import br.com.SmartPDV.SmartPDV.Enum.PerfilVendedor;
import jakarta.validation.constraints.Email;

public class FuncionarioRequest {

	private String login;
	@Email
	private String email;
	@CPF
	private String cpf;
	private String nome_vendedor;
	private Integer perfil;
	private String senha;

	public FuncionarioRequest() {
	}

	public FuncionarioRequest(String login, String email, String cpf, String nome_vendedor, Integer perfil,
			String senha) {
		super();
		this.login = login;
		this.email = email;
		this.cpf = cpf;
		this.nome_vendedor = nome_vendedor;
		this.perfil = perfil;
		this.senha = senha;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getNome_vendedor() {
		return nome_vendedor;
	}

	public void setNome_vendedor(String nome_vendedor) {
		this.nome_vendedor = nome_vendedor;
	}

	public Integer getPerfil() {
		return perfil;
	}

	public void setPerfil(Integer perfil) {
		this.perfil = perfil;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

}
