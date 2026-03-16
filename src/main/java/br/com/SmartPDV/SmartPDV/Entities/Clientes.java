package br.com.SmartPDV.SmartPDV.Entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Collate;

import br.com.SmartPDV.SmartPDV.Enum.TiposCliente;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
	private String cep;
	private String logradouro;
	private String bairro;
	private String localidade;
	private String uf;
	private String estado;
	@Enumerated(EnumType.STRING)
	private TiposCliente tipo;
	@Column(name = "data_cadastramento")
	private LocalDateTime dataCadastramento;
	@OneToMany(mappedBy = "cliente")
	private List<Venda> venda = new ArrayList<>();
	@ManyToOne
	@JoinColumn(name = "id_loja_vinculada")
	private Loja loja;
	private Boolean inativo;

	public Clientes(String nomeCliente, String cpfCnpj, String email, String telefone, String cep, String logradouro,
			String bairro, String localidade, String uf, String estado, TiposCliente tipo,
			LocalDateTime dataCadastramento, Loja loja, Boolean inativo) {
		this.nomeCliente = nomeCliente;
		this.cpfCnpj = cpfCnpj;
		this.email = email;
		this.telefone = telefone;
		this.cep = cep;
		this.logradouro = logradouro;
		this.bairro = bairro;
		this.localidade = localidade;
		this.uf = uf;
		this.estado = estado;
		this.tipo = tipo;
		this.dataCadastramento = dataCadastramento;
		this.loja = loja;
		this.inativo = inativo;
	}

}
