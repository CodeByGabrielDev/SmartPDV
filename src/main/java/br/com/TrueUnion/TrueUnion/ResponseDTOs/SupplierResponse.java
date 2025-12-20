package br.com.TrueUnion.TrueUnion.ResponseDTOs;

import br.com.TrueUnion.TrueUnion.Entities.ServiceCategory;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class SupplierResponse extends UserResponse {

	/*
	 * private String socialReason; private String cnpj; private String biography;
	 * private double rating; private int numberOfReviews; private ServiceCategory
	 * category;
	 */

	private String socialReason;
	private String cnpj;
	private String biography;
	private double rating;
	private int numberOfReviews;
	private String category;

	public SupplierResponse(long id, String email, String socialReason, String cnpj, String biography,
			double rating, int numberOfReviews, String category) {
		super(id, email);
		this.socialReason = socialReason;
		this.cnpj = cnpj;
		this.biography = biography;
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

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

}
