package br.com.SmartPDV.SmartPDV.ResponseDTOs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ViaCepResponse {
    
    private String cep;
    private String logradouro;
    private String bairro;
    private String localidade;
    private String uf;
    private String estado;

}
