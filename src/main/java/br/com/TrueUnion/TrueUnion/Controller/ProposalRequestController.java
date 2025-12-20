package br.com.TrueUnion.TrueUnion.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs.ProposalRequestDto;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.ProposalRequestResponseDto;
import br.com.TrueUnion.TrueUnion.Services.ProposalRequestService;
import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/api-trueunionb2b/proposalrequest")
public class ProposalRequestController {
	@Autowired
	ProposalRequestService proposal;

	@PostMapping("/event/{idEvent}/supplier/{idSupplier}/")
	public ProposalRequestResponseDto criarPropostaEEnviar(@RequestHeader("Authorization") String token,
			@PathVariable int idEvent, @PathVariable int idSupplier, @RequestBody ProposalRequestDto proposal,
			@RequestParam int idCategory) {
		return this.proposal.criarPropostaEEnviar(proposal, idEvent, idSupplier, token, idCategory);
	}

	@PutMapping("/{idProposta}/answer")
	public ProposalRequestResponseDto responderProposta(@RequestHeader("Authorization") String token,
			@RequestParam int idResposta, @PathVariable int idProposta) {
		return this.proposal.responderProposta(token, idProposta, idResposta);
	}
}
