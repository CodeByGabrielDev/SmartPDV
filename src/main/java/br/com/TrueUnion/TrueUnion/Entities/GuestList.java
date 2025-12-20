package br.com.TrueUnion.TrueUnion.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Guest_List")
public class GuestList {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_guest")
	private Guest guest;
	@ManyToOne
	@JoinColumn(name = "id_event")
	private Event event;
	@ManyToOne
	@JoinColumn(name = "id_statsRSVP")
	private RSVPstats stats;

	public GuestList(Guest guest, Event event, RSVPstats stats) {

		this.guest = guest;
		this.event = event;
		this.stats = stats;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Guest getGuest() {
		return guest;
	}

	public void setGuest(Guest guest) {
		this.guest = guest;
	}

	public Event getEvent() {
		return event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}

	public RSVPstats getStats() {
		return stats;
	}

	public void setStats(RSVPstats stats) {
		this.stats = stats;
	}

}
