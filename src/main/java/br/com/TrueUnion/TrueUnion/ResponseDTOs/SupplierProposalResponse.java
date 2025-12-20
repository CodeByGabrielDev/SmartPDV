package br.com.TrueUnion.TrueUnion.ResponseDTOs;



public class SupplierProposalResponse {

	private long id;
	private String supplier_Service;
	private Double value_Proposal;
	private String description_Proposal;
	private String stats;
	private int id_proposal;
	private String social_reason_supplier;

	public SupplierProposalResponse(long id, String supplier_Service, Double value_Proposal,
			String description_Proposal, String stats, int id_proposal, String social_reason_supplier) {
		super();
		this.id = id;
		this.supplier_Service = supplier_Service;
		this.value_Proposal = value_Proposal;
		this.description_Proposal = description_Proposal;
		this.stats = stats;
		this.id_proposal = id_proposal;
		this.social_reason_supplier = social_reason_supplier;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getSupplier_Service() {
		return supplier_Service;
	}

	public void setSupplier_Service(String supplier_Service) {
		this.supplier_Service = supplier_Service;
	}

	public Double getValue_Proposal() {
		return value_Proposal;
	}

	public void setValue_Proposal(Double value_Proposal) {
		this.value_Proposal = value_Proposal;
	}

	public String getDescription_Proposal() {
		return description_Proposal;
	}

	public void setDescription_Proposal(String description_Proposal) {
		this.description_Proposal = description_Proposal;
	}

	public String getStats() {
		return stats;
	}

	public void setStats(String stats) {
		this.stats = stats;
	}

	public int getId_proposal() {
		return id_proposal;
	}

	public void setId_proposal(int id_proposal) {
		this.id_proposal = id_proposal;
	}

	public String getSocial_reason_supplier() {
		return social_reason_supplier;
	}

	public void setSocial_reason_supplier(String social_reason_supplier) {
		this.social_reason_supplier = social_reason_supplier;
	}

}
