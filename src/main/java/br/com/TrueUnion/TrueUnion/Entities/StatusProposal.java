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
@Table(name = "status_proposal")
public class StatusProposal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String description;
	@OneToMany(mappedBy = "stats")
	private List<SupplierProposal> supplierProposal = new ArrayList<>();

	@OneToMany(mappedBy = "stats")
	private List<ProposalRequest> proposalRequest = new ArrayList<>();

	public StatusProposal() {

	}

	public StatusProposal(String description, List<SupplierProposal> supplierProposal) {
		super();
		this.description = description;
		this.supplierProposal = supplierProposal;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<SupplierProposal> getSupplierProposal() {
		return supplierProposal;
	}

	public void setSupplierProposal(List<SupplierProposal> supplierProposal) {
		this.supplierProposal = supplierProposal;
	}

	public List<ProposalRequest> getProposalRequest() {
		return proposalRequest;
	}

	public void setProposalRequest(List<ProposalRequest> proposalRequest) {
		this.proposalRequest = proposalRequest;
	}

}
