package br.com.TrueUnion.TrueUnion.Entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "service_category")
public class ServiceCategory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	private String description;
	@OneToMany(mappedBy = "category")
	private List<Supplier> supplier = new ArrayList<>();
	@OneToMany(mappedBy = "serviceCategory")
	private List<SupplierService> service = new ArrayList<>();
	@OneToMany(mappedBy = "category")
	private List<ProposalRequest> proposalRequest = new ArrayList<>();

	public ServiceCategory() {

	}

	public ServiceCategory(long id, String description, List<Supplier> supplier) {
		super();
		this.id = id;
		this.description = description;
		this.supplier = supplier;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<Supplier> getSupplier() {
		return supplier;
	}

	public void setSupplier(List<Supplier> supplier) {
		this.supplier = supplier;
	}

	public List<SupplierService> getService() {
		return service;
	}

	public void setService(List<SupplierService> service) {
		this.service = service;
	}

}
