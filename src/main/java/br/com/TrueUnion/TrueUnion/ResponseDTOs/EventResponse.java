package br.com.TrueUnion.TrueUnion.ResponseDTOs;

import java.time.LocalDate;

public class EventResponse {

	private long id;
	private String event_name;
	private LocalDate start_date;
	private LocalDate final_date;
	private String local;
	private String ceremonialis_name;
	private String description;
	private double total_budget;

	public EventResponse(long id, String event_name, LocalDate start_date, LocalDate final_date, String local,
			String ceremonialis_name, String description, double total_budget) {
		super();
		this.id = id;
		this.event_name = event_name;
		this.start_date = start_date;
		this.final_date = final_date;
		this.local = local;
		this.ceremonialis_name = ceremonialis_name;
		this.description = description;
		this.total_budget = total_budget;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public String getCeremonialis_name() {
		return ceremonialis_name;
	}

	public void setCeremonialis_name(String ceremonialis_name) {
		this.ceremonialis_name = ceremonialis_name;
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
