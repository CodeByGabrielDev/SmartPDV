package br.com.SmartPDV.SmartPDV.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.NotaFiscalItem;

@Repository
public interface NotaFiscalitemRepository extends CrudRepository<NotaFiscalItem, Long> {
	@Query("SELECT E FROM NotaFiscalItem E WHERE E.nfNumero =:nf_numero AND E.serieNfe = :serieNfe AND E.loja.id = :cod_filial")
	List<NotaFiscalItem> findItensFiscaisByNfNumeroAndSerieNfAndCodFilial(@Param("nf_numero") long nf_numero,
			@Param("serieNfe") int serieNfe, @Param("cod_filial") long cod_filial);

}
