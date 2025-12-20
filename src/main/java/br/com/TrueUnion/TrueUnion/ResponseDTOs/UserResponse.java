package br.com.TrueUnion.TrueUnion.ResponseDTOs;

public class UserResponse {

	private long id;
	private String email;
	private String token;
	private String role;
	public UserResponse(long id, String email, String token,String role) {
		super();
		this.id = id;
		this.email = email;
		this.token = token;
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

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
	
	
	

}
