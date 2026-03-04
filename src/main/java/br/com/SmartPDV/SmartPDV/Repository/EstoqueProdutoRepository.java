package br.com.SmartPDV.SmartPDV.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.EstoqueProduto;

@Repository
public interface EstoqueProdutoRepository extends CrudRepository<EstoqueProduto, Long> {
	@Query(name = "SELECT E FROM EstoqueProduto E WHERE E.loja.id = :idLoja AND E.produto.id = :idEstoqueProduto")
	EstoqueProduto buscarEstoqueProdutoByIdAndCodigoFilial(@Param("idLoja") Long idLoja,
			@Param("idEstoqueProduto") Long idEstoqueProduto);
}
