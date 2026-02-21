package br.com.SmartPDV.SmartPDV.ResponseDTOs;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import br.com.SmartPDV.SmartPDV.Entities.Clientes;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscalImpostoItem;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscalItem;
import br.com.SmartPDV.SmartPDV.Entities.Venda;
import br.com.SmartPDV.SmartPDV.Enum.StatusNotaFiscal;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

public class NotaFiscalResponse {
	
	
	private Long nf_numero;
	private Integer serieNf;
	private Long chaveNfe;
	private Integer cfop;
	private String cpf_Cliente;
	private String loja;
	private Double desconto;
	private Double valor_Total_De_Imposto_A_Pagar;
	private Double valor_Bruto_Nota;
	private Double valor_Liquido_Nota;
	private Long ticket_venda;
	private LocalDateTime data_Emissao;
	private StatusNotaFiscal status_Nota;
	 
	
}
