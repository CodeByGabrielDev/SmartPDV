package br.com.TrueUnion.TrueUnion.Services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs.ExchangeRequestDto;
import br.com.TrueUnion.TrueUnion.Entities.Ceremonialist;
import br.com.TrueUnion.TrueUnion.Entities.Event;
import br.com.TrueUnion.TrueUnion.Entities.ExchangeRequest;
import br.com.TrueUnion.TrueUnion.Entities.ExchangeStats;
import br.com.TrueUnion.TrueUnion.Entities.User;
import br.com.TrueUnion.TrueUnion.Repository.CeremonialistRepository;
import br.com.TrueUnion.TrueUnion.Repository.EventRepository;
import br.com.TrueUnion.TrueUnion.Repository.ExchangeRequestRepository;
import br.com.TrueUnion.TrueUnion.Repository.ExchangeStatsRepository;
import br.com.TrueUnion.TrueUnion.Repository.LoginSessionRepository;
import br.com.TrueUnion.TrueUnion.Repository.StatusEventRepository;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.ExchangeReponseDto;

@Service
public class ExchangeService {

	@Autowired
	CeremonialistRepository cere;
	@Autowired
	EventRepository event;
	@Autowired
	StatusEventRepository statusEvent;
	@Autowired
	ExchangeRequestRepository exchange;
	@Autowired
	ExchangeStatsRepository statsExchange;

	public ExchangeReponseDto exchangeRequest(String token, int idEvent, int idAddressee, ExchangeRequestDto exchange) {
		Event event = this.event.findById(idEvent).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
		Ceremonialist applicant = this.cere.findCerimonialistByIdUser(user.getId());
		Ceremonialist addressee = this.cere.findCerimonialistByIdUser(idAddressee);
		ExchangeStats status = this.statsExchange.findById(1)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
		if (applicant == event.getCeremonialist()) {
			if (addressee.isActive()) {
				if (!event.isCanceled() && event.getStartDate().isAfter(LocalDate.now())) {
					ExchangeRequest exchangeEntity = new ExchangeRequest(event, applicant, addressee,
							exchange.getRequestReason(), LocalDate.now(), null, status);
					this.exchange.save(exchangeEntity);
					return new ExchangeReponseDto(idAddressee, event.getEventName(), applicant.getName(),
							addressee.getName(), status.getDescription());
				}
				throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
			}
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		}
		throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
	}

	public List<ExchangeReponseDto> solicitacoesEnviadasParaMim(String token) {

		Ceremonialist adressee = this.cere.findCerimonialistByIdUser(user.getId());
		List<ExchangeRequest> findAllMyExchangesRequests = this.exchange.findMyExchanges(adressee);
		List<ExchangeReponseDto> respostaEmTela = new ArrayList<>();
		for (ExchangeRequest e : findAllMyExchangesRequests) {
			respostaEmTela.add(new ExchangeReponseDto(e.getId(), e.getEvent().getEventName(),
					e.getApplicant().getEmail(), e.getAddressee().getName(), e.getStats().getDescription()));
		}
		return respostaEmTela;

	}

	public ExchangeReponseDto responderSolicitacao(String token, int idSolicitacao, int idResposta) {

		Ceremonialist adressee = this.cere.findCerimonialistByIdUser(user.getId());
		ExchangeRequest exchange = this.exchange.findById(idSolicitacao)
				.orElseThrow(() -> new RuntimeException());
		if (exchange.getAddressee() == adressee) {
			return returnSwitch(token, idSolicitacao, idResposta);

		} else {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		}

	}

	private ExchangeReponseDto returnSwitch(String token, int idSolicitacao, int idResposta) {
		Ceremonialist adressee = this.cere.findCerimonialistByIdUser(user.getId());
		ExchangeRequest exchange = this.exchange.findById(idSolicitacao)
				.orElseThrow(() -> new RuntimeException());
		ExchangeStats status = this.statsExchange.findById(idResposta)
				.orElseThrow(() -> new RuntimeException());
		Event event = this.event.findById((int) exchange.getEvent().getId())
				.orElseThrow(() -> new RuntimeException());
		switch (idResposta) {
		case 2:
			event.setCeremonialist(adressee);
			exchange.setStats(status);
			exchange.setResponseDate(LocalDate.now());
			this.event.save(event);
			this.exchange.save(exchange);
			return new ExchangeReponseDto(exchange.getId(), exchange.getEvent().getEventName(),
					exchange.getApplicant().getName(), exchange.getAddressee().getName(), status.getDescription());

		case 3:
			exchange.setStats(status);
			exchange.setResponseDate(LocalDate.now());
			this.exchange.save(exchange);
			return new ExchangeReponseDto(exchange.getId(), exchange.getEvent().getEventName(),
					exchange.getApplicant().getName(), exchange.getAddressee().getName(), status.getDescription());
		default:
			throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);
		}
	}

}
