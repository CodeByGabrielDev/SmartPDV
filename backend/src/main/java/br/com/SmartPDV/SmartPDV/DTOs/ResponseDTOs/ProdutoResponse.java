package br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoResponse {

    private Long id;

    private String descricao;

    private String codigo_barra;

    private String sku;

    private Double preco_venda;

    private Double custo;

    private Boolean inativo;

    public ProdutoResponse(String descricao, String codigo_barra, String sku, Double preco_venda, Double custo,
            Boolean inativo) {
        this.descricao = descricao;
        this.codigo_barra = codigo_barra;
        this.sku = sku;
        this.preco_venda = preco_venda;
        this.custo = custo;
        this.inativo = inativo;
    }

}
