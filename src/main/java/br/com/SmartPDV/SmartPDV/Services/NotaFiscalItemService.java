package br.com.SmartPDV.SmartPDV.Services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.SmartPDV.SmartPDV.Entities.ItemVenda;
import br.com.SmartPDV.SmartPDV.Entities.Venda;

@Service
public class NotaFiscalItemService {
	@Transactional
	public void inserirItensFiscais(Venda venda, ItemVenda itensVenda) {
		
	}
}
