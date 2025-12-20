package br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs;

import java.time.LocalDate;

import br.com.TrueUnion.TrueUnion.Entities.User;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class EventRequest {

	/*
	 * private String eventName; private LocalDate startDate; private LocalDate
	 * finalDate; private String local; private String description;
	 * 
	 * @Column(name = "total_budget") private double totalBudget;
	 */

	private String event_name;
	private LocalDate start_date;
	private LocalDate final_date;
	private String local;
	private String description;
	private double total_budget;

	public EventRequest(String event_name, LocalDate start_date, LocalDate final_date, String local, String description,
			double total_budget) {
		super();
		this.event_name = event_name;
		this.start_date = start_date;
		this.final_date = final_date;
		this.local = local;
		this.description = description;
		this.total_budget = total_budget;
	}

	public String getEvent_name() {
		return event_name;
	}

	public void setEvent_name(String event_name) {
		this.event_name = event_name;
	}

	public LocalDate getStart_date() {
		return start_date;
	}

	public void setStart_date(LocalDate start_date) {
		this.start_date = start_date;
	}

	public LocalDate getFinal_date() {
		return final_date;
	}

	public void setFinal_date(LocalDate final_date) {
		this.final_date = final_date;
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

	public double getTotal_budget() {
		return total_budget;
	}

	public void setTotal_budget(double total_budget) {
		this.total_budget = total_budget;
	}

}
