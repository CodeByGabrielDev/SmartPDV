package br.com.SmartPDV.SmartPDV.Services;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import br.com.SmartPDV.SmartPDV.Entities.Venda;
import br.com.SmartPDV.SmartPDV.Repository.NotaFiscalRepository;


@Service
public class NotaFiscalService {
	@Autowired
	NotaFiscalRepository notaFiscal;	
	
	
	public void emitirNotaDeVenda(Venda venda) {
		
		
		
	}
}
