package br.com.TrueUnion.TrueUnion.Entities;

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
public class Expense {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	private String description;
	@ManyToOne
	@JoinColumn(name = "id_category")
	private ExpenseCategory category;
	@Column(name = "total_value")
	private double totalValue;
	@Column(name = "quantity_parcels")
	private int quantityParcels;
	@ManyToOne
	@JoinColumn(name = "id_payment_stats")
	private PaymentStats paymentStats;
	@ManyToOne
	@JoinColumn(name = "id_event")
	private Event event;
	@ManyToOne
	@JoinColumn(name = "id_contract")
	private Contract contract;
	@OneToMany(mappedBy = "expense")
	private List<Parcel> parcels = new ArrayList<>();

	public Expense(String description, ExpenseCategory category, double totalValue, int quantityParcels,
			PaymentStats paymentStats, Event event, Contract contract) {
		super();
		this.description = description;
		this.category = category;
		this.totalValue = totalValue;
		this.quantityParcels = quantityParcels;
		this.paymentStats = paymentStats;
		this.event = event;
		this.contract = contract;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public ExpenseCategory getCategory() {
		return category;
	}

	public void setCategory(ExpenseCategory category) {
		this.category = category;
	}

	public double getTotalValue() {
		return totalValue;
	}

	public void setTotalValue(double totalValue) {
		this.totalValue = totalValue;
	}

	public int getQuantityParcels() {
		return quantityParcels;
	}

	public void setQuantityParcels(int quantityParcels) {
		this.quantityParcels = quantityParcels;
	}

	public PaymentStats getPaymentStats() {
		return paymentStats;
	}

	public void setPaymentStats(PaymentStats paymentStats) {
		this.paymentStats = paymentStats;
	}

	public Event getEvent() {
		return event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}

	public Contract getContract() {
		return contract;
	}

	public void setContract(Contract contract) {
		this.contract = contract;
	}

	public List<Parcel> getParcels() {
		return parcels;
	}

	public void setParcels(List<Parcel> parcels) {
		this.parcels = parcels;
	}

}
