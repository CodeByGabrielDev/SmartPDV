package br.com.TrueUnion.TrueUnion.ResponseDTOs;

import java.time.LocalDate;

import br.com.TrueUnion.TrueUnion.Entities.Ceremonialist;
import br.com.TrueUnion.TrueUnion.Entities.Event;
import br.com.TrueUnion.TrueUnion.Entities.ServiceCategory;
import br.com.TrueUnion.TrueUnion.Entities.StatusProposal;
import br.com.TrueUnion.TrueUnion.Entities.Supplier;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class ProposalRequestResponseDto {

	private long id;

	private String addressee;

	private String sender;

	private String event_name;

	private String category;

	private String message;

	private String stats;

	public ProposalRequestResponseDto(long id, String addressee, String sender, String event_name, String category,
			String message, String stats) {
		super();
		this.id = id;
		this.addressee = addressee;
		this.sender = sender;
		this.event_name = event_name;
		this.category = category;
		this.message = message;
		this.stats = stats;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getAddressee() {
		return addressee;
	}

	public void setAddressee(String addressee) {
		this.addressee = addressee;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getEvent_name() {
		return event_name;
	}

	public void setEvent_name(String event_name) {
		this.event_name = event_name;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getStats() {
		return stats;
	}

	public void setStats(String stats) {
		this.stats = stats;
	}

}
