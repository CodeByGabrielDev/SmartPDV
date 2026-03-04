package br.com.SmartPDV.SmartPDV.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.Produto;

@Repository
public interface ProdutoRepository extends CrudRepository<Produto, Long> {

	@Query("SELECT E FROM Produto E WHERE E.codigoBarra = :codigoBarra")
	Produto findByCodigoDeBarra(@Param("codigoBarra") String codigoBarra);
}
