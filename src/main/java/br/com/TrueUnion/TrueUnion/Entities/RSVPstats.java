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
@Table(name = "RSVP_stats")
public class RSVPstats {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	private String description;
	@OneToMany(mappedBy = "stats")
	private List<GuestList> guestList = new ArrayList<>();

	public RSVPstats(int id, String description, List<GuestList> guestList) {
		super();
		this.id = id;
		this.description = description;
		this.guestList = guestList;
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

	public List<GuestList> getGuestList() {
		return guestList;
	}

	public void setGuestList(List<GuestList> guestList) {
		this.guestList = guestList;
	}

}
