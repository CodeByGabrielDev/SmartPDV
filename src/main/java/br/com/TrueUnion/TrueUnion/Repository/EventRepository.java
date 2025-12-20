package br.com.TrueUnion.TrueUnion.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.TrueUnion.TrueUnion.Entities.Ceremonialist;
import br.com.TrueUnion.TrueUnion.Entities.Event;

@Repository
public interface EventRepository extends CrudRepository<Event, Integer> {

	@Query("""
			SELECT e
			FROM Event e
			WHERE e.ceremonialist = :ceremonialist
			AND (
			     (e.startDate <= :finalDate)
			     AND
			     (e.finalDate >= :startDate)
			    )
			""")
	List<Event> findEventsInInterval(@Param("ceremonialist") Ceremonialist ceremonialist,
			@Param("startDate") LocalDate startDate, @Param("finalDate") LocalDate finalDate);

}
