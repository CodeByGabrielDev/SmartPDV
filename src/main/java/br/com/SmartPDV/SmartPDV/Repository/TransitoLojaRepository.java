package br.com.SmartPDV.SmartPDV.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.TransitoLoja;

@Repository
public interface TransitoLojaRepository extends CrudRepository<TransitoLoja, Long> {
	@Query("SELECT E FROM TransitoLoja E WHERE E.lojaDestino.id = :idLojaUsuario AND E.dataRecebimento IS NULL")
	List<TransitoLoja> buscarTodasAsNotasDisponiveis(@Param("idLojaUsuario") Long idLojaUsuario);

}
