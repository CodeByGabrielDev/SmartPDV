package br.com.TrueUnion.TrueUnion.ResponseDTOs;

public class SupplierServiceResponse {

	private long id;
	private String supplier;

	private String serviceCategory;
	private String serviceName;
	private String description;
	private double priceBase;

	public SupplierServiceResponse(long id, String supplier, String serviceCategory, String serviceName,
			String description, double priceBase) {
		super();
		this.id = id;
		this.supplier = supplier;
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

	public String getSupplier() {
		return supplier;
	}

	public void setSupplier(String supplier) {
		this.supplier = supplier;
	}

	public String getServiceCategory() {
		return serviceCategory;
	}

	public void setServiceCategory(String serviceCategory) {
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

}
