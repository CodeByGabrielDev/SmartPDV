package br.com.SmartPDV.SmartPDV.Repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;

@Repository
public interface NotaFiscalRepository extends JpaRepository<NotaFiscal, Long> {

    @Query("SELECT e FROM NotaFiscal e WHERE e.loja.id = :idLoja AND e.serieNf = :serieNfe ORDER BY e.nfNumero DESC")
    List<NotaFiscal> findLastSequential(
            @Param("idLoja") Long idLoja, 
            @Param("serieNfe") Integer serieNfe, 
            Pageable pageable
    );

}