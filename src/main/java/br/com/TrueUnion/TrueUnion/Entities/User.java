package br.com.TrueUnion.TrueUnion.Entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Users")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String email;
	private String password;
	private boolean active;
	@Column(name = "register_date")
	private LocalDateTime registerDate;
	@OneToMany(mappedBy = "ceremonialist")
	private List<Event> event = new ArrayList<>();
	@ManyToOne
	@JoinColumn(name = "id_user_type")
	private UserProfile userType;
	@OneToMany(mappedBy = "supplier")
	private List<SupplierService> services = new ArrayList<>();
	@OneToMany(mappedBy = "addressee")
	private List<ProposalRequest> proposalRequest = new ArrayList<>();
	@OneToMany(mappedBy = "supplier")
	private List<SupplierProposal> supplierProposal = new ArrayList<>();
	@OneToMany(mappedBy = "supplier")
	private List<Contract> contracts = new ArrayList<>();
	
	

	public User() {

	}

	public User(String email, String password) {
		super();
		this.email = email;
		this.password = password;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public LocalDateTime getRegisterDate() {
		return registerDate;
	}

	public void setRegisterDate(LocalDateTime registerDate) {
		this.registerDate = registerDate;
	}

	public List<Event> getEvent() {
		return event;
	}

	public void setEvent(List<Event> event) {
		this.event = event;
	}

	public UserProfile getUserType() {
		return userType;
	}

	public void setUserType(UserProfile userType) {
		this.userType = userType;
	}

	public List<SupplierService> getServices() {
		return services;
	}

	public void setServices(List<SupplierService> services) {
		this.services = services;
	}

	public List<ProposalRequest> getProposalRequest() {
		return proposalRequest;
	}

	public void setProposalRequest(List<ProposalRequest> proposalRequest) {
		this.proposalRequest = proposalRequest;
	}

	public List<SupplierProposal> getSupplierProposal() {
		return supplierProposal;
	}

	public void setSupplierProposal(List<SupplierProposal> supplierProposal) {
		this.supplierProposal = supplierProposal;
	}

	public List<Contract> getContracts() {
		return contracts;
	}

	public void setContracts(List<Contract> contracts) {
		this.contracts = contracts;
	}



}
