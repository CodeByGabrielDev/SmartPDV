package br.com.SmartPDV.SmartPDV.Entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Collate;

import br.com.SmartPDV.SmartPDV.Enum.TiposCliente;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Clientes")
public class Clientes {
	/*
	 * Cliente - id - nome - cpfCnpj - email - telefone - tipoPessoa (FISICA /
	 * JURIDICA) - dataCadastro - ativo
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@Column(name = "nome_cliente")
	private String nomeCliente;
	@Column(name = "cpf_cnpj")
	private String cpfCnpj;
	private String email;
	private String telefone;
	private TiposCliente tipo;
	@Column(name = "data_cadastramento") // auditoria
	private LocalDateTime dataCadastramento;
	@OneToMany(mappedBy = "cliente")
	private List<Venda> venda = new ArrayList<>();
	private boolean inativo;

	public Clientes() {

	}

	public Clientes(String nomeCliente, String cpfCnpj, String email, String telefone, TiposCliente tipo,
			LocalDateTime dataCadastramento, boolean inativo) {
		super();
		this.nomeCliente = nomeCliente;
		this.cpfCnpj = cpfCnpj;
		this.email = email;
		this.telefone = telefone;
		this.tipo = tipo;
		this.dataCadastramento = dataCadastramento;
		this.inativo = inativo;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getNomeCliente() {
		return nomeCliente;
	}

	public void setNomeCliente(String nomeCliente) {
		this.nomeCliente = nomeCliente;
	}

	public String getCpfCnpj() {
		return cpfCnpj;
	}

	public void setCpfCnpj(String cpfCnpj) {
		this.cpfCnpj = cpfCnpj;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}

	public LocalDateTime getDataCadastramento() {
		return dataCadastramento;
	}

	public void setDataCadastramento(LocalDateTime dataCadastramento) {
		this.dataCadastramento = dataCadastramento;
	}

	public boolean isInativo() {
		return inativo;
	}

	public void setInativo(boolean inativo) {
		this.inativo = inativo;
	}

	public TiposCliente getTipo() {
		return tipo;
	}

	public void setTipo(TiposCliente tipo) {
		this.tipo = tipo;
	}

}
