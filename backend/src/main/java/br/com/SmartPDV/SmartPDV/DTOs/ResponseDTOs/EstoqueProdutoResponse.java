package br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EstoqueProdutoResponse {
    private Long id;
    private String nome_produto;
    private String nome_loja;
    private Integer quantidade_atual;
    private String codigo_barra;
    private Double preco_venda;
}
