package br.com.SmartPDV.SmartPDV.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.Venda;

@Repository
public interface VendaRepository extends CrudRepository<Venda, Long> {
    @Query("SELECT E FROM Venda E WHERE E.loja.id = :idLoja ORDER BY dataHora DESC")
    List<Venda> selectLastTicket(@Param("idLoja") Long idLoja, Pageable pageable);

    @Query("SELECT E FROM Venda E WHERE E.id = :idVenda AND E.loja.id = :idLoja")
    Venda selectByIdAndCodLoja(@Param("idLoja") Long idLoja, @Param("idVenda") Long idVenda);

    @Query("SELECT E FROM Venda E WHERE E.dataHora BETWEEN :diaInicial AND :diaFinal")
    List<Venda> selectVendaByDataFilter(@Param("diaInicial") LocalDate diaInicial,
            @Param("diaFinal") LocalDate diaFinal);

}
