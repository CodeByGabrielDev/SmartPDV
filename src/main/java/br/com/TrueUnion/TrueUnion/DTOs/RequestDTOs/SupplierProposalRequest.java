package br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs;

import java.time.LocalDate;

import br.com.TrueUnion.TrueUnion.Entities.ProposalRequest;
import br.com.TrueUnion.TrueUnion.Entities.StatusProposal;
import br.com.TrueUnion.TrueUnion.Entities.SupplierService;
import br.com.TrueUnion.TrueUnion.Entities.User;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class SupplierProposalRequest {

	private Double valueProposal;

	private String descriptionProposal;

	public SupplierProposalRequest(Double valueProposal, String descriptionProposal) {
		super();
		this.valueProposal = valueProposal;
		this.descriptionProposal = descriptionProposal;
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

}
