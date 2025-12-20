package br.com.TrueUnion.TrueUnion.Services;

import java.net.Authenticator;
import java.time.LocalDate;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs.EventRequest;
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
import br.com.TrueUnion.TrueUnion.ResponseDTOs.EventResponse;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.ExchangeReponseDto;
import jakarta.transaction.Transactional;

@Service
public class EventService {
	@Autowired
	LoginSessionRepository loginSession;
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

	@Transactional
	public EventResponse createEvent(String token, EventRequest event) {
		org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String email = auth.getName();
		if (validatorDate(event.getStart_date(), event.getFinal_date()) && validateOfBeginEvent(event, cere)) {
			Event eventEntity = new Event(cere, event.getEvent_name(), event.getStart_date(), event.getFinal_date(),
					event.getLocal(), event.getDescription(), event.getTotal_budget(), 0,
					this.statusEvent.findById(3).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
			eventEntity.setCanceled(false);
			eventEntity.setCancellationReason(null);
			this.event.save(eventEntity);
			return new EventResponse(eventEntity.getId(), eventEntity.getEventName(), eventEntity.getStartDate(),
					eventEntity.getFinalDate(), eventEntity.getLocal(), eventEntity.getCeremonialist().getName(),
					eventEntity.getDescription(), eventEntity.getTotalBudget());
		}
		throw new ResponseStatusException(HttpStatus.CONFLICT);
	}

	public EventResponse cancelEvent(String reasonCancellation, int idEvent, String userToken, String password) {
		Event event = this.event.findById(idEvent).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
		User user = this.loginSession.findByToken(userToken);
		Ceremonialist ceremonialist = this.cere.findCerimonialistByIdUser(user.getId());
		if (ceremonialist == event.getCeremonialist()) {
			if (validatePassword(password, ceremonialist) && reasonCancellation != null) {
				event.setCanceled(true);
				event.setCancellationReason(reasonCancellation);
				this.event.save(event);
			}
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		}
		throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

	}

	public List<EventResponse> findAllEvents(String token) {
		User user = this.loginSession.findByToken(token);
		Ceremonialist cere = this.cere.findCerimonialistByIdUser(user.getId());
		List<Event> eventList = this.cere.findAllEventsOfActuallyUser(cere);
		return convert(eventList);

	}

	private boolean validatePassword(String password, Ceremonialist ceremonialist) {
		if (ceremonialist.getPassword().equals(password)) {
			return true;
		}
		return false;

	}

	private boolean validatorDate(LocalDate startDate, LocalDate finalDate) {
		if (startDate.isAfter(finalDate) || startDate.isBefore(LocalDate.now())) {
			return false;
		} else {
			return true;
		}

	}

	private List<EventResponse> convert(List<Event> events) {
		List<EventResponse> response = new ArrayList<>();
		for (Event e : events) {
			response.add(new EventResponse(e.getId(), e.getEventName(), e.getStartDate(), e.getFinalDate(),
					e.getLocal(), e.getCeremonialist().getName(), e.getDescription(), e.getTotalBudget()));
		}
		return response;
	}

	private boolean validateOfBeginEvent(EventRequest event, Ceremonialist cere) {
		List<Event> events = this.event.findEventsInInterval(cere, event.getStart_date(), event.getFinal_date());
		if (events.isEmpty()) {
			return true;
		}
		return false;
	}

}
