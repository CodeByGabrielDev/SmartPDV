package br.com.SmartPDV.SmartPDV.Repository;

import java.util.List;

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
	EstoqueProduto selectByCodigoBarra(@Param("codigo_barra") String codigo_barra);

	@Query("SELECT E FROM EstoqueProduto E WHERE E.codigoBarra = :codigo_barra AND E.loja.id = :id")
	EstoqueProduto selectByCodigoBarra(@Param("codigo_barra") String codigo_barra, @Param("id") Long id);

	@Query("SELECT E FROM EstoqueProduto E WHERE E.loja.id =:id")
	List<EstoqueProduto> findAllItens(@Param("id") Long id);

	@Query("SELECT E FROM EstoqueProduto E WHERE E.codigoBarra IN (:codigosBarras) AND E.loja.id = :id")
	List<EstoqueProduto> findAllItensInByIdShop(@Param("codigosBarras") List<String> codigosBarras,
			@Param("id") Long id);
}
