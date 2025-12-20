package br.com.TrueUnion.TrueUnion.Entities;

import java.time.LocalDate;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Exchange_request")
public class ExchangeRequest {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_event")
	private Event event;
	@ManyToOne
	@JoinColumn(name = "id_applicant")
	private Ceremonialist applicant;
	@ManyToOne
	@JoinColumn(name = "id_addressee")
	private Ceremonialist addressee;
	@Column(name = "request_reason")
	private String requestReason;
	@Column(name = "register_date")
	private LocalDate registerDate;
	@Column(name = "response_date")
	private LocalDate responseDate;
	@ManyToOne
	@JoinColumn(name = "id_status")
	private ExchangeStats stats;

	public ExchangeRequest() {

	}

	public ExchangeRequest(Event event, Ceremonialist applicant, Ceremonialist addressee, String requestReason,
			LocalDate registerDate, LocalDate responseDate, ExchangeStats stats) {
		super();
		this.event = event;
		this.applicant = applicant;
		this.addressee = addressee;
		this.requestReason = requestReason;
		this.registerDate = registerDate;
		this.responseDate = responseDate;
		this.stats = stats;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Event getEvent() {
		return event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}

	public Ceremonialist getApplicant() {
		return applicant;
	}

	public void setApplicant(Ceremonialist applicant) {
		this.applicant = applicant;
	}

	public Ceremonialist getAddressee() {
		return addressee;
	}

	public void setAddressee(Ceremonialist addressee) {
		this.addressee = addressee;
	}

	public String getRequestReason() {
		return requestReason;
	}

	public void setRequestReason(String requestReason) {
		this.requestReason = requestReason;
	}

	public LocalDate getRegisterDate() {
		return registerDate;
	}

	public void setRegisterDate(LocalDate registerDate) {
		this.registerDate = registerDate;
	}

	public LocalDate getResponseDate() {
		return responseDate;
	}

	public void setResponseDate(LocalDate responseDate) {
		this.responseDate = responseDate;
	}

	public ExchangeStats getStats() {
		return stats;
	}

	public void setStats(ExchangeStats stats) {
		this.stats = stats;
	}

}
