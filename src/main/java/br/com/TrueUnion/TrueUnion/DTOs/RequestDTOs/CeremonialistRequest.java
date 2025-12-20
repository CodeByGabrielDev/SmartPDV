package br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs;

import org.hibernate.validator.constraints.br.CPF;

public class CeremonialistRequest extends UserDTO {
	@CPF
	private String cpf;
	private String name;
	private String contact;

	public CeremonialistRequest(String email, String password, String cpf, String name, String contact) {
		super(email, password);
		this.cpf = cpf;
		this.name = name;
		this.contact = contact;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

}
