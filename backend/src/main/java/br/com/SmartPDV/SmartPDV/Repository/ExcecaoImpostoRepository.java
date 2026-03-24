package br.com.SmartPDV.SmartPDV.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.ExcecaoImposto;

@Repository
public interface ExcecaoImpostoRepository extends CrudRepository<ExcecaoImposto, Long> {

	@Query("SELECT E FROM ExcecaoImposto E WHERE E.naturezaoOperacao = :naturezaoOperacao" + " AND E.loja.id = :id")
	ExcecaoImposto findExcecaoByCodFilialAndCfop(@Param("naturezaoOperacao") int naturezaoOperacao,
			@Param("id") long id);
}
