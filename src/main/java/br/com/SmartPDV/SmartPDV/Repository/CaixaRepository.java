package br.com.SmartPDV.SmartPDV.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.Caixa;

@Repository
public interface CaixaRepository extends CrudRepository<Caixa, Long> {

	@Query("SELECT E FROM Caixa E WHERE E.fechado = false AND E.loja.id =:id")
	Caixa findCaixaAberto(@Param("id") long id);
}
