package br.com.SmartPDV.SmartPDV.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Parcelas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "id_pagamento")
    private Pagamento pagamento;
    @Column(name = "numero_ticket")
    private Long numeroTicket;
    @Column(name = "numero_parcela")
    private Integer numeroParcela;
    @ManyToOne
    @JoinColumn(name = "id_loja")
    private Loja loja;
    @Column(name = "valor_parcela")
    private Double valorParcela;
    public Parcelas(Pagamento pagamento, Long numeroTicket, Integer numeroParcela,Loja loja, Double valorParcela) {
        this.pagamento = pagamento;
        this.numeroTicket = numeroTicket;
        this.numeroParcela = numeroParcela;
        this.loja = loja;
        this.valorParcela = valorParcela;
    }

    




}
