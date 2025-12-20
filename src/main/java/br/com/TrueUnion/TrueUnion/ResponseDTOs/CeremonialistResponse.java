package br.com.TrueUnion.TrueUnion.ResponseDTOs;

public class CeremonialistResponse extends UserResponse {

	private String cpf;
	private String name;
	private String contact;

	public CeremonialistResponse(long id, String email, String cpf, String name, String contact) {
		super(id, email);
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
