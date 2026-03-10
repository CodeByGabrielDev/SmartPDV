package br.com.SmartPDV.SmartPDV.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.EstoqueProduto;

@Repository
public interface EstoqueProdutoRepository extends CrudRepository<EstoqueProduto, Long> {
	@Query("SELECT E FROM EstoqueProduto E WHERE E.loja.id = :idLoja AND E.produto.id = :idEstoqueProduto")
	EstoqueProduto selectEstoqueProdutoByIdAndCodigoFilial(@Param("idLoja") Long idLoja,
			@Param("idEstoqueProduto") Long idEstoqueProduto);
	@Query("SELECT E FROM EstoqueProduto E WHERE E.codigoBarra = :codigo_barra")
	EstoqueProduto selectByCodigoBarra(@Param("codigo_barra")String codigo_barra);
}
