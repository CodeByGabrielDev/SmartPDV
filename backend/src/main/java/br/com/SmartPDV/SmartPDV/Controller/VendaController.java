package br.com.SmartPDV.SmartPDV.Controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.VendaItemRequest;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.VendaResponse;
import br.com.SmartPDV.SmartPDV.Services.VendaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api-smartpdv/point-of-sale")
@RequiredArgsConstructor
public class VendaController {

	private final VendaService vendaService;

	@PostMapping
	public void realizarVenda(@RequestBody VendaItemRequest itens, @RequestParam String cpfOrCnpj) {
		this.vendaService.realizarVenda(itens, cpfOrCnpj);
	}

	@GetMapping("/sales-report")
	public List<VendaResponse> retirarRelatorioDeVendas(@RequestParam LocalDateTime dataInicial,
			@RequestParam LocalDateTime dataFinal) {
		return this.vendaService.relatorioDeVendasPorDia(dataInicial, dataFinal);
	}

}
