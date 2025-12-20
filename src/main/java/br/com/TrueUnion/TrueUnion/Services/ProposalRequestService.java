package br.com.TrueUnion.TrueUnion.Services;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs.ProposalRequestDto;
import br.com.TrueUnion.TrueUnion.Entities.Ceremonialist;
import br.com.TrueUnion.TrueUnion.Entities.Event;
import br.com.TrueUnion.TrueUnion.Entities.ProposalRequest;
import br.com.TrueUnion.TrueUnion.Entities.ServiceCategory;
import br.com.TrueUnion.TrueUnion.Entities.StatusProposal;
import br.com.TrueUnion.TrueUnion.Entities.Supplier;
import br.com.TrueUnion.TrueUnion.Entities.User;
import br.com.TrueUnion.TrueUnion.Repository.CeremonialistRepository;
import br.com.TrueUnion.TrueUnion.Repository.EventRepository;
import br.com.TrueUnion.TrueUnion.Repository.LoginSessionRepository;
import br.com.TrueUnion.TrueUnion.Repository.ProposalRequestRepository;
import br.com.TrueUnion.TrueUnion.Repository.ServiceCategoryRepository;
import br.com.TrueUnion.TrueUnion.Repository.StatusProposalRepository;
import br.com.TrueUnion.TrueUnion.Repository.SupplierRepository;
import br.com.TrueUnion.TrueUnion.Repository.UserRepository;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.ProposalRequestResponseDto;

@Service
public class ProposalRequestService {

	@Autowired
	ProposalRequestRepository proposalRequest;

	@Autowired
	EventRepository event;
	@Autowired
	UserRepository user;
	@Autowired
	CeremonialistRepository cereRepo;
	@Autowired
	SupplierRepository supplierRepo;
	@Autowired
	LoginSessionRepository loginSession;
	@Autowired
	ServiceCategoryRepository serviceCategory;
	@Autowired
	StatusProposalRepository statusProposal;

	public ProposalRequestResponseDto criarPropostaEEnviar(ProposalRequestDto proposalRequest, int idEvent,
			int idAdresse, String tokenSender, int idCategoryService) {

		User userToken = this.loginSession.findByToken(tokenSender);
		ServiceCategory service = this.serviceCategory.findById(idCategoryService)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
		StatusProposal status = this.statusProposal.findById(1).orElseThrow();
		Event event = this.event.findById(idEvent).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
		Ceremonialist cere = this.cereRepo.findCerimonialistByIdUser(userToken.getId());
		Supplier sup = this.supplierRepo.findById(idAdresse)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

		if (event.getCeremonialist().getId() == userToken.getId()) {
			return criarPropostaNoBancoERetornar(proposalRequest, event, sup, cere, service, status);

		}

		throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);

	}

	public ProposalRequestResponseDto responderProposta(String token, int idProposta, int idResposta) {
		User user = this.returnObject(token);
		ProposalRequest proposal = this.proposalRequest.findById(idProposta)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
		
		StatusProposal status = this.statusProposal.findById(idResposta)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
		if (proposal.getAddressee().getId() == user.getId() && !proposal.getEvent().isCanceled()
				&& proposal.getStats().getId() == 1 && status.getId() != 1 && status.getId() != 2
				&& status.getId() != 5) {
			proposal.setStats(status);
			this.proposalRequest.save(proposal);
			return new ProposalRequestResponseDto(proposal.getId(), proposal.getAddressee().getSocialReason(),
					proposal.getSender().getName(), proposal.getEvent().getEventName(),
					proposal.getCategory().getDescription(), proposal.getMessage(),
					proposal.getStats().getDescription());
		}
		throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

	}

	// Não pode aceitar proposta se já existe contrato ativo

	private User returnObject(String token) {

		User user = this.loginSession.findByToken(token);

		switch (user.getUserType().getId()) {
		case 1:

			return this.supplierRepo.findByUserId(user.getId());

		case 2:
			return this.cereRepo.findCerimonialistByIdUser(user.getId());

		default:
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
	}

	private ProposalRequestResponseDto criarPropostaNoBancoERetornar(ProposalRequestDto proposalRequest, Event event,
			Supplier idAdresse, Ceremonialist cere, ServiceCategory service, StatusProposal status) {

		ProposalRequest proposal = new ProposalRequest(idAdresse, cere, event, service, proposalRequest.getMessage(),
				LocalDate.now(), status);
		this.proposalRequest.save(proposal);
		return new ProposalRequestResponseDto(proposal.getId(), idAdresse.getSocialReason(), cere.getName(),
				event.getEventName(), service.getDescription(), proposal.getMessage(), status.getDescription());
	}

}
