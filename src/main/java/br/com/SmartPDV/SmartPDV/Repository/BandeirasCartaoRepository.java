package br.com.SmartPDV.SmartPDV.Repository;

import org.springframework.data.repository.CrudRepository;

import org.springframework.stereotype.Repository;

import br.com.SmartPDV.SmartPDV.Entities.BandeirasCartao;



@Repository
public interface BandeirasCartaoRepository extends CrudRepository<BandeirasCartao, Integer> {

}
