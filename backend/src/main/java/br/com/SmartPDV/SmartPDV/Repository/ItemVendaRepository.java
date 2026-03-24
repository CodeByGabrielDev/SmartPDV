package br.com.SmartPDV.SmartPDV.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;

@Repository
public interface ItemVendaRepository extends CrudRepository<ItemVenda, Long> {
    @Query("SELECT E FROM ItemVenda E WHERE E.venda.id =:idVenda AND E.loja.id = :idLoja")
    List<ItemVenda> selectByVendaAndCodigoFilial(Long idVenda, Long idLoja);
}
