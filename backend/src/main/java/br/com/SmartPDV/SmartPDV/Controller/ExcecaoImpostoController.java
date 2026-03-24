package br.com.SmartPDV.SmartPDV.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ExcecaoImpostoItemRequest;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ExcecaoImpostoRequest;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.ExcecaoImpostoResponse;
import br.com.SmartPDV.SmartPDV.Services.ExcecaoImpostoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api-smartpdv/v1/tax-exception")
public class ExcecaoImpostoController {

	private final ExcecaoImpostoService excecao;

	@PostMapping
	public ExcecaoImpostoResponse insereExcecaoImposto(@RequestBody ExcecaoImpostoRequest excecaoImpostoRequest) {
		return this.excecao.criarExcecaoImposto(excecaoImpostoRequest);
	}

}
