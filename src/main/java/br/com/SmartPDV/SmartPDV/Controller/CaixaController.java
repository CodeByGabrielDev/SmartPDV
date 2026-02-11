package br.com.SmartPDV.SmartPDV.Controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.ResponseDTOs.CaixaAberturaResponse;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.CaixaFechamentoResponse;
import br.com.SmartPDV.SmartPDV.Services.CaixaService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api-smartpdv/v1/cashiers")
public class CaixaController {

	private final CaixaService caixa;

	@PostMapping("/open")
	public CaixaAberturaResponse abrirCaixa() {
		return this.caixa.realizarAberturaCaixa();
	}

	@PutMapping("/{id}/close")
	public CaixaFechamentoResponse fecharcaixa(@PathVariable long id) {
		return this.caixa.fechamentoDeCaixa(id);
	}
}
