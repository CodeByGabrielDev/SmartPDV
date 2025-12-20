package br.com.TrueUnion.TrueUnion.Entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Parcel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "id_expense")
	private Expense expense;
	@Column(name = "number_parcel")
	private int numberParcel;
	@Column(name = "parcel_value")
	private double parcelValue;

	private LocalDate maturity;

	private boolean payed;

	private LocalDateTime payday;
}
