package br.com.TrueUnion.TrueUnion.Entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Supplier extends User {
	@Column(name = "social_reason")
	private String socialReason;
	private String cnpj;
	private String biography;
	private String contact;
	private double rating;
	@Column(name = "number_of_reviews")
	private int numberOfReviews;
	@ManyToOne
	@JoinColumn(name = "id_category")
	private ServiceCategory category;

	public Supplier() {
		super();
	}

	public Supplier(String email, String password, String socialReason, String cnpj, String biography, String contact,
			double rating, int numberOfReviews, ServiceCategory category) {
		super(email, password);
		this.socialReason = socialReason;
		this.cnpj = cnpj;
		this.biography = biography;
		this.contact = contact;
		this.rating = rating;
		this.numberOfReviews = numberOfReviews;
		this.category = category;
	}

	public String getSocialReason() {
		return socialReason;
	}

	public void setSocialReason(String socialReason) {
		this.socialReason = socialReason;
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

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	public int getNumberOfReviews() {
		return numberOfReviews;
	}

	public void setNumberOfReviews(int numberOfReviews) {
		this.numberOfReviews = numberOfReviews;
	}

	public ServiceCategory getCategory() {
		return category;
	}

	public void setCategory(ServiceCategory category) {
		this.category = category;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

}
