package br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs;

import java.time.LocalDate;

import br.com.TrueUnion.TrueUnion.Entities.Event;
import br.com.TrueUnion.TrueUnion.Entities.ServiceCategory;
import br.com.TrueUnion.TrueUnion.Entities.StatusProposal;
import br.com.TrueUnion.TrueUnion.Entities.User;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class ProposalRequestDto {

	private String message;

	public ProposalRequestDto(String message) {
		super();
		this.message = message;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
