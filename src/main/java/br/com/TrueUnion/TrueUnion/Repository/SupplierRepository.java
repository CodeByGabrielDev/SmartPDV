package br.com.TrueUnion.TrueUnion.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import br.com.TrueUnion.TrueUnion.Entities.Supplier;

public interface SupplierRepository extends CrudRepository<Supplier, Integer> {

	@Query("SELECT E FROM Supplier E WHERE E.id = :id")
	Supplier findByUserId(@Param("id") long id);

	@Query("SELECT E FROM Supplier E WHERE E.contact = :contact OR E.cnpj = :cnpj")
	Supplier findSupplierByContactOrCnpj(@Param("contact") String contact, @Param("cnpj") String cnpj);
}
