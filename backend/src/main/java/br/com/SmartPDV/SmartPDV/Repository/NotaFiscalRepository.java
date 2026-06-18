package br.com.SmartPDV.SmartPDV.Repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Entities.Venda;

@Repository
public interface NotaFiscalRepository extends JpaRepository<NotaFiscal, Long> {

    @Query("SELECT e FROM NotaFiscal e WHERE e.loja.id = :idLoja AND e.serieNf = :serieNfe ORDER BY e.nfNumero DESC")
    List<NotaFiscal> findLastSequential(
            @Param("idLoja") Long idLoja,
            @Param("serieNfe") Integer serieNfe,
            Pageable pageable);

    @Query("SELECT DISTINCT E FROM NotaFiscal E LEFT JOIN FETCH E.itensFiscais WHERE E.loja.id = :idLoja")
    List<NotaFiscal> findIssuedInvoicesWithItens(@Param("idLoja") Long idLoja);

    @Query("SELECT DISTINCT E FROM NotaFiscal E LEFT JOIN FETCH E.numero WHERE E.loja.id = :idLoja")
    List<NotaFiscal> findIssuedInvoicesWithImpostos(@Param("idLoja") Long idLoja);

    @Query("SELECT E FROM NotaFiscal E WHERE E.venda.id = :idVenda AND E.loja.id = :idLoja")
    NotaFiscal findInvoiceByIdVendaAndCodeStore(@Param("idVenda") Long idVenda, @Param("idLoja") Long idLoja);
}