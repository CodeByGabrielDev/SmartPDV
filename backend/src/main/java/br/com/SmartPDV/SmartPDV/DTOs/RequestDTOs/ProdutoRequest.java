package br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoRequest {
    private String descricao;
    private String codigoBarra;
    private String sku;
    private Double precoVenda;
    private Double custo;
}
