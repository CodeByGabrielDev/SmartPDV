package br.com.TrueUnion.TrueUnion.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs.ExchangeRequestDto;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.ExchangeReponseDto;
import br.com.TrueUnion.TrueUnion.Services.ExchangeService;

@RestController
@RequestMapping("/api-trueunionb2b/exchanges")
public class ExchangeController {
	@Autowired
	ExchangeService ex;

	@PostMapping("/events/{idEvent}/ceremonialists/{idCeremonialist}")
	public ExchangeReponseDto alterarCerimonialistaResponsavel(@RequestHeader("Authorization") String token,
			@PathVariable int idEvent, @PathVariable int idCeremonialist, @RequestBody ExchangeRequestDto request) {
		return this.ex.exchangeRequest(token, idEvent, idCeremonialist, request);
	}

	@GetMapping
	public List<ExchangeReponseDto> pegarTodasSolicitacoesEnviadasParaMim(
			@RequestHeader("Authorization") String token) {
		return this.ex.solicitacoesEnviadasParaMim(token);
	}

	@PostMapping("/{idSolicitacao}")
	public ExchangeReponseDto responderSolicitacaoEnviadaParaUsuario(@RequestHeader("Authorization") String token,
			@PathVariable int idSolicitacao, @RequestParam int idResposta) {
		return this.ex.responderSolicitacao(token, idSolicitacao, idResposta);
	}

}
