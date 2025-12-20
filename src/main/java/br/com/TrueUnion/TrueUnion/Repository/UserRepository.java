package br.com.TrueUnion.TrueUnion.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import br.com.TrueUnion.TrueUnion.Entities.User;

public interface UserRepository extends CrudRepository<User, Integer> {
	@Query("SELECT E FROM User E WHERE E.email = :email AND E.password = :password")
	User findByEmailAndPassword(@Param("email") String email, @Param("password") String password);

	@Query("SELECT E FROM User E WHERE E.email = :email")
	User findByEmail(@Param("email") String email);
}
