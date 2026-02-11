package br.com.SmartPDV.SmartPDV.Services;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Repository.ProdutoRepository;
import jakarta.transaction.Transactional;

@Service
public class ProdutoService {
	@Autowired
	ProdutoRepository produtoRepository;
	@Transactional
	public void inserirProdutoNaTabela(NotaFiscal notaEntrada) {
		
		
	}

}
