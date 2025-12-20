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

@Entity
public class Event {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_user_ceremonialist")
	private Ceremonialist ceremonialist;
	@Column(name = "event_name")
	private String eventName;
	@Column(name = "start_date")
	private LocalDate startDate;
	@Column(name = "final_date")
	private LocalDate finalDate;
	private String local;
	private String description;
	@Column(name = "total_budget")
	private double totalBudget;
	@Column(name = "spent_total")
	private double spentTotal;

	private boolean canceled;
	@Column(name = "cancellation_reason")
	private String cancellationReason;
	@ManyToOne
	@JoinColumn(name = "id_stats_event")
	private StatusEvent stats;
	@OneToMany(mappedBy = "event")
	private List<Task> tasks = new ArrayList<>();
	@OneToMany(mappedBy = "event")
	private List<Expense> expenses = new ArrayList<>();
	@OneToMany(mappedBy = "event")
	private List<GuestList> guestList = new ArrayList<>();
	@OneToMany(mappedBy = "event")
	private List<ProposalRequest> proposalRequest = new ArrayList<>();
	@OneToMany(mappedBy = "event")
	private List<Contract> contract = new ArrayList<>();
	@OneToMany(mappedBy = "event")
	private List<ExchangeRequest>exchange = new ArrayList<>();

	public Event() {

	}

	public Event(Ceremonialist ceremonialist, String eventName, LocalDate startDate, LocalDate finalDate, String local,
			String description, double totalBudget, double spentTotal, StatusEvent stats) {
		super();
		this.ceremonialist = ceremonialist;
		this.eventName = eventName;
		this.startDate = startDate;
		this.finalDate = finalDate;
		this.local = local;
		this.description = description;
		this.totalBudget = totalBudget;
		this.spentTotal = spentTotal;
		this.stats = stats;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getEventName() {
		return eventName;
	}

	public void setEventName(String eventName) {
		this.eventName = eventName;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getFinalDate() {
		return finalDate;
	}

	public void setFinalDate(LocalDate finalDate) {
		this.finalDate = finalDate;
	}

	public String getLocal() {
		return local;
	}

	public void setLocal(String local) {
		this.local = local;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getTotalBudget() {
		return totalBudget;
	}

	public void setTotalBudget(double totalBudget) {
		this.totalBudget = totalBudget;
	}

	public double getSpentTotal() {
		return spentTotal;
	}

	public void setSpentTotal(double spentTotal) {
		this.spentTotal = spentTotal;
	}

	public StatusEvent getStats() {
		return stats;
	}

	public void setStats(StatusEvent stats) {
		this.stats = stats;
	}

	public List<Task> getTasks() {
		return tasks;
	}

	public void setTasks(List<Task> tasks) {
		this.tasks = tasks;
	}

	public List<Expense> getExpenses() {
		return expenses;
	}

	public void setExpenses(List<Expense> expenses) {
		this.expenses = expenses;
	}

	public List<GuestList> getGuestList() {
		return guestList;
	}

	public void setGuestList(List<GuestList> guestList) {
		this.guestList = guestList;
	}

	public List<ProposalRequest> getProposalRequest() {
		return proposalRequest;
	}

	public void setProposalRequest(List<ProposalRequest> proposalRequest) {
		this.proposalRequest = proposalRequest;
	}

	public List<Contract> getContract() {
		return contract;
	}

	public void setContract(List<Contract> contract) {
		this.contract = contract;
	}

	public Ceremonialist getCeremonialist() {
		return ceremonialist;
	}

	public void setCeremonialist(Ceremonialist ceremonialist) {
		this.ceremonialist = ceremonialist;
	}

	public boolean isCanceled() {
		return canceled;
	}

	public void setCanceled(boolean canceled) {
		this.canceled = canceled;
	}

	public String getCancellationReason() {
		return cancellationReason;
	}

	public void setCancellationReason(String cancellationReason) {
		this.cancellationReason = cancellationReason;
	}
	
	
}
