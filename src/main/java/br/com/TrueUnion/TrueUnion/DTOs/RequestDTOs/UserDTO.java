package br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public abstract class UserDTO {
	@Email
	private String email;
	@Size(min = 12)
	private String password;

	public UserDTO(String email, String password) {
		super();
		this.email = email;
		this.password = password;
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

}
