package br.com.SmartPDV.SmartPDV.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.Loja;

@Repository
public interface LojaRepository extends CrudRepository<Loja, Long> {

	/*
	 * private String razaoSocial;
	 * private String cnpj;
	 * private String IE;
	 */

	@Query("SELECT E FROM Loja E WHERE E.cnpj = :cnpj")
	Loja findByCnpj(@Param("cnpj") String cnpj);

	@Query("SELECT E FROM Loja E WHERE E.cnpj = :cnpj AND E.razaoSocial = :razaoSocial AND E.IE =:ie")
	Loja findByRazaoSocialOrCnpjOrIe(String cnpj, String razaoSocial, String ie);

	@Query("SELECT E FROM Loja E WHERE E.inativo = false")
	List<Loja> selectAllLojas();
}
