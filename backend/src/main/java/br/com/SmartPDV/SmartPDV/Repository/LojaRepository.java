package br.com.SmartPDV.SmartPDV.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.Loja;
@Repository
public interface LojaRepository extends CrudRepository<Loja, Long> {

	@Query("SELECT E FROM Loja E WHERE E.cnpj = :cnpj")
	Loja findByCnpj(@Param("cnpj") String cnpj);
}
