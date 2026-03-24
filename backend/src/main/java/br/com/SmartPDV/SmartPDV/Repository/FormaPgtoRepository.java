package br.com.SmartPDV.SmartPDV.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.FormaPgto;

@Repository
public interface FormaPgtoRepository extends CrudRepository<FormaPgto,Integer>{
    
    @Query("SELECT E FROM FormaPgto E")
    List<FormaPgto> selectAll();
}
