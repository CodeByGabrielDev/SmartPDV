package br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs;

public class LojaRequest {

	private String razaoSocial;
	private String cnpj;
	private String IE;
	private String endereco;

	public LojaRequest(String razaoSocial, String cnpj, String iE, String endereco) {
		super();
		this.razaoSocial = razaoSocial;
		this.cnpj = cnpj;
		IE = iE;
		this.endereco = endereco;
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

}
