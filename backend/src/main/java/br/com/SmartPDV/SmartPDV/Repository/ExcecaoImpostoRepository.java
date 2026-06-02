package br.com.SmartPDV.SmartPDV.Repository;

import java.util.List;

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

	@Query("SELECT E FROM ExcecaoImposto E WHERE E.loja.id = :id")
	List<ExcecaoImposto> findAllExcecoes(@Param("id") Long id);
}
