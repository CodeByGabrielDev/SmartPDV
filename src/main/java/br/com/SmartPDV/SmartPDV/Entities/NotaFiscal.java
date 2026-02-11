package br.com.SmartPDV.SmartPDV.Entities;

import java.time.LocalDateTime;

import br.com.SmartPDV.SmartPDV.Enum.StatusNotaFiscal;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "nota_fiscal")
public class NotaFiscal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long nf_numero;
	@Column(name = "serie_nf")
	private int serieNf;
	@Column(name = "chave_nfe")
	private long chaveNfe;
	private int cfop;
	@ManyToOne
	@JoinColumn(name = "id_filial")
	private Loja loja;
	
	@ManyToOne
	@JoinColumn(name = "id_venda_vinculada")
	private Venda venda;
	@Column(name = "data_emissao")
	private LocalDateTime dataEmissao;
	@Column(name = "status_nota")
	private StatusNotaFiscal statusNota;

	public NotaFiscal(int serieNf, long chaveNfe, Venda venda, LocalDateTime dataEmissao, StatusNotaFiscal statusNota) {
		super();
		this.serieNf = serieNf;
		this.chaveNfe = chaveNfe;
		this.venda = venda;
		this.dataEmissao = dataEmissao;
		this.statusNota = statusNota;
	}

	public long getNf_numero() {
		return nf_numero;
	}

	public void setNf_numero(long nf_numero) {
		this.nf_numero = nf_numero;
	}

	public int getSerieNf() {
		return serieNf;
	}

	public void setSerieNf(int serieNf) {
		this.serieNf = serieNf;
	}

	public long getChaveNfe() {
		return chaveNfe;
	}

	public void setChaveNfe(long chaveNfe) {
		this.chaveNfe = chaveNfe;
	}

	public Venda getVenda() {
		return venda;
	}

	public void setVenda(Venda venda) {
		this.venda = venda;
	}

	public LocalDateTime getDataEmissao() {
		return dataEmissao;
	}

	public void setDataEmissao(LocalDateTime dataEmissao) {
		this.dataEmissao = dataEmissao;
	}

	public StatusNotaFiscal getStatusNota() {
		return statusNota;
	}

	public void setStatusNota(StatusNotaFiscal statusNota) {
		this.statusNota = statusNota;
	}

}
