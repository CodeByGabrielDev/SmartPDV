package br.com.TrueUnion.TrueUnion.Entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Ceremonialist extends User {

	private String cpf;
	private String name;
	private String contact;
	@OneToMany(mappedBy = "applicant")
	private List<ExchangeRequest> applicant = new ArrayList<>();
	@OneToMany(mappedBy = "addressee")
	private List<ExchangeRequest> addressee = new ArrayList<>();

	public Ceremonialist() {
		super();
	}

	public Ceremonialist(String email, String password, String cpf, String name, String contact) {
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
