package br.com.TrueUnion.TrueUnion.Entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Guest {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	private String name;
	
	private String email;
	
	private String contact;
	@Column(name = "register_date")
	private LocalDateTime registerDate;
	@OneToMany(mappedBy = "guest")
	private List<GuestList>guestList= new ArrayList<>();
	
}
