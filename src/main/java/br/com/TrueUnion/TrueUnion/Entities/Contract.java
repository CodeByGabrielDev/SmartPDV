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
public class Contract {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_event")
	private Event event;
	@ManyToOne
	@JoinColumn(name = "id_supplier")
	private User supplier;
	@ManyToOne
	@JoinColumn(name = "id_supplier_service")
	private SupplierService supplierService;
	@Column(name = "final_value")
	private double finalValue;
	@Column(name = "contract_date")
	private LocalDate contractDate;
	@ManyToOne
	@JoinColumn(name = "id_stats_contract")
	private ContractStats stats;
	@OneToMany
	private List<Expense> expense = new ArrayList<>();

	public Contract() {

	}

	public Contract(Event event, SupplierService supplierService, double finalValue, LocalDate contractDate,
			ContractStats stats) {
		super();
		this.event = event;
		this.supplierService = supplierService;
		this.finalValue = finalValue;
		this.contractDate = contractDate;
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

	public SupplierService getSupplierService() {
		return supplierService;
	}

	public void setSupplierService(SupplierService supplierService) {
		this.supplierService = supplierService;
	}

	public double getFinalValue() {
		return finalValue;
	}

	public void setFinalValue(double finalValue) {
		this.finalValue = finalValue;
	}

	public LocalDate getContractDate() {
		return contractDate;
	}

	public void setContractDate(LocalDate contractDate) {
		this.contractDate = contractDate;
	}

	public ContractStats getStats() {
		return stats;
	}

	public void setStats(ContractStats stats) {
		this.stats = stats;
	}

	public List<Expense> getExpense() {
		return expense;
	}

	public void setExpense(List<Expense> expense) {
		this.expense = expense;
	}

}
