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
import jakarta.websocket.server.ServerEndpoint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "Clientes")
public class Clientes {
	/*
	 * Cliente - id - nome - cpfCnpj - email - telefone - tipoPessoa (FISICA /
	 * JURIDICA) - dataCadastro - ativo
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
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
	private Boolean inativo;

	public Clientes(String nomeCliente, String cpfCnpj, String email, String telefone, TiposCliente tipo,
			LocalDateTime dataCadastramento, Boolean inativo) {
		super();
		this.nomeCliente = nomeCliente;
		this.cpfCnpj = cpfCnpj;
		this.email = email;
		this.telefone = telefone;
		this.tipo = tipo;
		this.dataCadastramento = dataCadastramento;
		this.inativo = inativo;
	}

}
