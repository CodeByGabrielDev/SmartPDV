package br.com.TrueUnion.TrueUnion.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.TrueUnion.TrueUnion.Entities.Ceremonialist;
import br.com.TrueUnion.TrueUnion.Entities.Event;

@Repository
public interface CeremonialistRepository extends CrudRepository<Ceremonialist, Integer> {
	@Query("SELECT E FROM Ceremonialist E WHERE E.cpf = :cpf OR E.contact = :contact")
	Ceremonialist findCeremonialistByCpfOrContact(@Param("cpf") String cpf, @Param("contact") String contact);

	@Query("SELECT E FROM Ceremonialist E WHERE E.id = :id")
	Ceremonialist findCerimonialistByIdUser(@Param("id") long id);

	@Query("SELECT E FROM Event E WHERE E.ceremonialist = :cere")
	List<Event> findAllEventsOfActuallyUser(@Param("cere") Ceremonialist cere);
}
