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
import jakarta.persistence.Table;

@Entity
@Table(name = "Supplier_Service")
public class SupplierService {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_supplier")
	private User supplier;
	@ManyToOne
	@JoinColumn(name = "id_category")
	private ServiceCategory serviceCategory;
	@Column(name = "service_name")
	private String serviceName;
	private String description;
	@Column(name = "price_base")
	private double priceBase;
	private boolean active;
	@OneToMany(mappedBy = "supplierService")
	private List<Contract> contract = new ArrayList<>();

	public SupplierService(ServiceCategory serviceCategory, String serviceName, String description, double priceBase) {
		super();
		this.serviceCategory = serviceCategory;
		this.serviceName = serviceName;
		this.description = description;
		this.priceBase = priceBase;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public ServiceCategory getServiceCategory() {
		return serviceCategory;
	}

	public void setServiceCategory(ServiceCategory serviceCategory) {
		this.serviceCategory = serviceCategory;
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

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public List<Contract> getContract() {
		return contract;
	}

	public void setContract(List<Contract> contract) {
		this.contract = contract;
	}

}
