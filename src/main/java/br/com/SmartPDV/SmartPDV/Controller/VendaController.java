package br.com.SmartPDV.SmartPDV.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.Services.VendaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api-smartpdv/seller")
@RequiredArgsConstructor
public class VendaController {

	private final VendaService vendaService;

	@PostMapping
	public void realizarVenda() {
		
	}

}
