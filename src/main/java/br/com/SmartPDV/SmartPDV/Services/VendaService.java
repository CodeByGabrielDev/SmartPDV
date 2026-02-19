package br.com.SmartPDV.SmartPDV.Services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.SmartPDV.SmartPDV.Repository.LojaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendaService {

	@Transactional
	public void realizarVenda() {

	}
}
