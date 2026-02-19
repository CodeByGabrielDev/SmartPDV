package br.com.SmartPDV.SmartPDV.Entities;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import br.com.SmartPDV.SmartPDV.Enum.PerfilVendedor;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Usuarios_loja")
public class UsuariosLoja implements UserDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "nome_vendedor")
	private String nomeVendedor;
	private String cpf;
	private String login;
	private String email;
	private String senha;
	@OneToMany(mappedBy = "usuarios")
	private List<Caixa> caixa = new ArrayList<>();
	private PerfilVendedor perfil;
	private Boolean inativo;
	@OneToMany(mappedBy = "usuario")
	private List<Venda> venda = new ArrayList<>();
	@ManyToOne
	@JoinColumn(name = "id_loja_vinculada")
	private Loja lojaVinculada;

	public UsuariosLoja() {

	}

	public UsuariosLoja(String nomeVendedor, String cpf, String login, String email, String senha,
			PerfilVendedor perfil, boolean inativo, Loja lojaVinculada) {
		super();
		this.cpf = cpf;
		this.nomeVendedor = nomeVendedor;
		this.login = login;
		this.email = email;
		this.senha = senha;
		this.perfil = perfil;
		this.inativo = inativo;
		this.lojaVinculada = lojaVinculada;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(() -> "ROLE_" + this.perfil.name());
	}

	@Override
	public String getPassword() {
		return this.senha;
	}

	@Override
	public String getUsername() {
		return this.login;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return !this.inativo;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return !this.inativo;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getNomeVendedor() {
		return nomeVendedor;
	}

	public void setNomeVendedor(String nomeVendedor) {
		this.nomeVendedor = nomeVendedor;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public List<Caixa> getCaixa() {
		return caixa;
	}

	public void setCaixa(List<Caixa> caixa) {
		this.caixa = caixa;
	}

	public List<Venda> getVenda() {
		return venda;
	}

	public void setVenda(List<Venda> venda) {
		this.venda = venda;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public PerfilVendedor getPerfil() {
		return perfil;
	}

	public void setPerfil(PerfilVendedor perfil) {
		this.perfil = perfil;
	}

	public boolean isInativo() {
		return inativo;
	}

	public void setInativo(boolean inativo) {
		this.inativo = inativo;
	}

	public Loja getLojaVinculada() {
		return lojaVinculada;
	}

	public void setLojaVinculada(Loja lojaVinculada) {
		this.lojaVinculada = lojaVinculada;
	}

}
