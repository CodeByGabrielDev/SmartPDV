package br.com.TrueUnion.TrueUnion.Entities;

import java.time.LocalDate;
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
@Table(name = "proposal_request")
public class ProposalRequest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_addressee")
	private Supplier addressee;
	@ManyToOne
	@JoinColumn(name = "id_sender")
	private Ceremonialist sender;
	@ManyToOne
	@JoinColumn(name = "id_event")
	private Event event;
	@ManyToOne
	@JoinColumn(name = "id_category")
	private ServiceCategory category;
	private String message;
	@Column(name = "send_date")
	private LocalDate sendDate;
	@ManyToOne
	@JoinColumn(name = "id_stats_proposal")
	private StatusProposal stats;
	@OneToMany(mappedBy = "proposal")
	private List<SupplierProposal> supplierProposal = new ArrayList<>();

	public ProposalRequest() {
		
	}

	public ProposalRequest(Supplier addressee, Ceremonialist sender, Event event, ServiceCategory category,
			String message, LocalDate sendDate, StatusProposal stats) {
		super();
		this.addressee = addressee;
		this.sender = sender;
		this.event = event;
		this.category = category;
		this.message = message;
		this.sendDate = sendDate;
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

	public ServiceCategory getCategory() {
		return category;
	}

	public void setCategory(ServiceCategory category) {
		this.category = category;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
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

	public List<SupplierProposal> getSupplierProposal() {
		return supplierProposal;
	}

	public void setSupplierProposal(List<SupplierProposal> supplierProposal) {
		this.supplierProposal = supplierProposal;
	}

	public Supplier getAddressee() {
		return addressee;
	}

	public void setAddressee(Supplier addressee) {
		this.addressee = addressee;
	}

	public Ceremonialist getSender() {
		return sender;
	}

	public void setSender(Ceremonialist sender) {
		this.sender = sender;
	}

}
