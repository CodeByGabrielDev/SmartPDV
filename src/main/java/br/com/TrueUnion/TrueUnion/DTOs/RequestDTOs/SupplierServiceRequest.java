package br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs;

import java.util.ArrayList;
import java.util.List;

import br.com.TrueUnion.TrueUnion.Entities.Contract;
import br.com.TrueUnion.TrueUnion.Entities.ServiceCategory;
import br.com.TrueUnion.TrueUnion.Entities.User;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

public class SupplierServiceRequest {

	private String serviceName;
	private String description;
	private double priceBase;

	public SupplierServiceRequest(String serviceName, String description, double priceBase) {
		super();
		this.serviceName = serviceName;
		this.description = description;
		this.priceBase = priceBase;
	}

	public String getServiceName() {
		return serviceName;
	}

	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getPriceBase() {
		return priceBase;
	}

	public void setPriceBase(double priceBase) {
		this.priceBase = priceBase;
	}

}
