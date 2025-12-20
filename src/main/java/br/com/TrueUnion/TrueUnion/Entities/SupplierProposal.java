package br.com.TrueUnion.TrueUnion.Entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Supplier_proposal")
public class SupplierProposal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_service_supplier")
	private SupplierService supplierService; 
	@Column(name = "value_proposal")
	private Double valueProposal;
	@Column(name = "description_proposal")
	private String descriptionProposal;
	@Column(name = "send_date")
	private LocalDate sendDate;
	@ManyToOne
	@JoinColumn(name = "id_stats_proposal")
	private StatusProposal stats;
	@ManyToOne
	@JoinColumn(name = "id_proposal_request")
	private ProposalRequest proposal;
	@ManyToOne
	@JoinColumn(name = "id_supplier")
	private User supplier;

	public SupplierProposal(SupplierService supplierService, Double valueProposal, String descriptionProposal,
			LocalDate sendDate, StatusProposal stats, ProposalRequest proposal) {
		super();
		this.supplierService = supplierService;
		this.valueProposal = valueProposal;
		this.descriptionProposal = descriptionProposal;
		this.sendDate = sendDate;
		this.stats = stats;
		this.proposal = proposal;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public SupplierService getSupplierService() {
		return supplierService;
	}

	public void setSupplierService(SupplierService supplierService) {
		this.supplierService = supplierService;
	}

	public Double getValueProposal() {
		return valueProposal;
	}

	public void setValueProposal(Double valueProposal) {
		this.valueProposal = valueProposal;
	}

	public String getDescriptionProposal() {
		return descriptionProposal;
	}

	public void setDescriptionProposal(String descriptionProposal) {
		this.descriptionProposal = descriptionProposal;
	}

	public LocalDate getSendDate() {
		return sendDate;
	}

	public void setSendDate(LocalDate sendDate) {
		this.sendDate = sendDate;
	}

	public StatusProposal getStats() {
		return stats;
	}

	public void setStats(StatusProposal stats) {
		this.stats = stats;
	}

	public ProposalRequest getProposal() {
		return proposal;
	}

	public void setProposal(ProposalRequest proposal) {
		this.proposal = proposal;
	}


}
