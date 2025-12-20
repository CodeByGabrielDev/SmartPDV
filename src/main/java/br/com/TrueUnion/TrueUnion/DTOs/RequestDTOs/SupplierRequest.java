package br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs;

import org.hibernate.validator.constraints.br.CNPJ;

import br.com.TrueUnion.TrueUnion.Entities.ServiceCategory;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class SupplierRequest extends UserDTO {

	/*
	 * private String socialReason; private String cnpj; private String biography;
	 * private ServiceCategory category;
	 */

	private String social_Reason;
	@CNPJ
	private String cnpj;

	private String biography;

	private String contact;


	public SupplierRequest(String email, String password, String social_Reason, String cnpj, String biography,
			String contact) {
		super(email, password);
		this.social_Reason = social_Reason;
		this.cnpj = cnpj;
		this.biography = biography;
		this.contact = contact;
	}


	public String getCnpj() {
		return cnpj;
	}

	public void setCnpj(String cnpj) {
		this.cnpj = cnpj;
	}

	public String getBiography() {
		return biography;
	}

	public void setBiography(String biography) {
		this.biography = biography;
	}

	

	public String getSocial_Reason() {
		return social_Reason;
	}

	public void setSocial_Reason(String social_Reason) {
		this.social_Reason = social_Reason;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

}
