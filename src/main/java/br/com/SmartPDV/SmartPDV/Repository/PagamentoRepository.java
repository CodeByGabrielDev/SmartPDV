package br.com.SmartPDV.SmartPDV.Repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import br.com.SmartPDV.SmartPDV.Entities.Pagamento;

@Repository
public interface PagamentoRepository extends CrudRepository<Pagamento, Long> {

    

}
