package br.com.SmartPDV.SmartPDV.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;

@Repository
public interface NotaFiscalRepository extends JpaRepository<NotaFiscal, Long> {
	@Query("SELECT E FROM NotaFiscal E WHERE E.loja.id = :idLoja AND E.serieNf = :serieNfe ORDER BY E.nfNumero DESC")
	NotaFiscal findLastSequential(@Param("idLoja") Long idLoja, @Param("serieNfe") Integer serieNfe);
}
