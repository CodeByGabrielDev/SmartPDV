package br.com.SmartPDV.SmartPDV.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import br.com.SmartPDV.SmartPDV.Entities.Pagamento;

@Repository
public interface PagamentoRepository extends CrudRepository<Pagamento, Long> {
    @Query("SELECT E FROM Pagamento E WHERE E.venda.id = :idVenda AND E.loja.id = :codigoLoja")
    Pagamento selectByidVendaAndCodigoFilial(@Param("idVenda") Long idVenda,@Param("codigoLoja") Long codigoLoja);

}
