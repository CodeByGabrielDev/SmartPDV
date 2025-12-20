package br.com.TrueUnion.TrueUnion.ResponseDTOs;

public class ExchangeReponseDto {

	private long id;

	private String event_name;

	private String applicant_name;

	private String addreesse_name;

	private String status_request;

	public ExchangeReponseDto(long id, String event_name, String applicant_name, String addreesse_name,
			String status_request) {
		super();
		this.id = id;
		this.event_name = event_name;
		this.applicant_name = applicant_name;
		this.addreesse_name = addreesse_name;
		this.status_request = status_request;
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

	public String getApplicant_name() {
		return applicant_name;
	}

	public void setApplicant_name(String applicant_name) {
		this.applicant_name = applicant_name;
	}

	public String getAddreesse_name() {
		return addreesse_name;
	}

	public void setAddreesse_name(String addreesse_name) {
		this.addreesse_name = addreesse_name;
	}

	public String getStatus_request() {
		return status_request;
	}

	public void setStatus_request(String status_request) {
		this.status_request = status_request;
	}

}
