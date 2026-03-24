package br.com.SmartPDV.SmartPDV.ResponseDTOs;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import br.com.SmartPDV.SmartPDV.Entities.ExcecaoImpostoItem;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExcecaoImpostoResponse {

	private long id;
	private int naturezao_operacao;
	private String loja;
	private String descricao;
	private List<ExcecaoImpostoItemResponse> excecaoImpostoItem = new ArrayList<>();
}
