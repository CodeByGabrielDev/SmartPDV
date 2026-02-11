package br.com.SmartPDV.SmartPDV.Repository;

import org.springframework.data.repository.CrudRepository;

import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;



@Repository
public interface NotaFiscalRepository extends CrudRepository<NotaFiscal, Long>{

}
