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
@Table(name = "Exchange_stats")
public class ExchangeStats {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String description;
	@OneToMany(mappedBy = "stats")
	private List<ExchangeRequest> exchange = new ArrayList<>();

	public ExchangeStats() {

	}

	public ExchangeStats(int id, String description, List<ExchangeRequest> exchange) {
		super();
		this.id = id;
		this.description = description;
		this.exchange = exchange;
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

	public List<ExchangeRequest> getExchange() {
		return exchange;
	}

	public void setExchange(List<ExchangeRequest> exchange) {
		this.exchange = exchange;
	}

}
