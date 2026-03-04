package br.com.SmartPDV.SmartPDV.Entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "transito_loja")
public class TransitoLoja {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "id_loja_origem")
	private Loja lojaOrigem;
	@Column(name = "loja_origem_nome")
	private String lojaOrigemNome;
	@ManyToOne
	@JoinColumn(name = "id_loja_destino")
	private Loja lojaDestino;
	@Column(name = "loja_destino_nome")
	private String lojaDestinoNome;
	@ManyToOne
	@JoinColumn(name = "id_nota_fiscal")
	private NotaFiscal notaFiscalEmitida;
	@Column(name = "numero_nota")
	private Long numeroNota;
	@Column(name = "data_envio")
	private LocalDateTime dataEnvio;
	@Column(name = "data_recebimento")
	private LocalDateTime dataRecebimento;

	public TransitoLoja(Loja lojaOrigem, String lojaOrigemNome, Loja lojaDestino, String lojaDestinoNome,
			NotaFiscal notaFiscalEmitida, Long numeroNota, LocalDateTime dataEnvio, LocalDateTime dataRecebimento) {
		super();
		this.lojaOrigem = lojaOrigem;
		this.lojaOrigemNome = lojaOrigemNome;
		this.lojaDestino = lojaDestino;
		this.lojaDestinoNome = lojaDestinoNome;
		this.notaFiscalEmitida = notaFiscalEmitida;
		this.numeroNota = numeroNota;
		this.dataEnvio = dataEnvio;
		this.dataRecebimento = dataRecebimento;
	}

}
