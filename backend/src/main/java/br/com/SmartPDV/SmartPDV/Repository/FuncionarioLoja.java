package br.com.SmartPDV.SmartPDV.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;

@Repository
public interface FuncionarioLoja extends CrudRepository<UsuariosLoja, Long> {

	@Query("SELECT E FROM UsuariosLoja E WHERE E.cpf =:cpf")
	UsuariosLoja findByCpf(@Param("cpf") String cpf);

	@Query("""
			    SELECT u
			    FROM UsuariosLoja u
			    WHERE (u.cpf = :cpf OR u.login = :login)
			      AND u.lojaVinculada.id = :idLoja
			""")
	UsuariosLoja findByCpfOrLoginAndLoja(
			@Param("cpf") String cpf,
			@Param("login") String login,
			@Param("idLoja") Long idLoja);

	@Query("SELECT E FROM UsuariosLoja E WHERE E.email = :email")
	UsuariosLoja findByEmail(@Param("email") String email);

	@Query("SELECT E FROM UsuariosLoja E WHERE E.login = :login")
	UsuariosLoja findByLogin(@Param("login") String login);
}
