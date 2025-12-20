package br.com.TrueUnion.TrueUnion.Repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import br.com.TrueUnion.TrueUnion.Entities.ServiceCategory;

@Repository
public interface ServiceCategoryRepository extends CrudRepository<ServiceCategory, Integer> {

}
