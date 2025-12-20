package br.com.TrueUnion.TrueUnion.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.TrueUnion.TrueUnion.Entities.Ceremonialist;
import br.com.TrueUnion.TrueUnion.Entities.ExchangeRequest;

@Repository
public interface ExchangeRequestRepository extends CrudRepository<ExchangeRequest, Integer> {
	@Query("SELECT E FROM ExchangeRequest E WHERE E.addressee = :addressee")
	List<ExchangeRequest> findMyExchanges(@Param("addressee") Ceremonialist addressee);
}
