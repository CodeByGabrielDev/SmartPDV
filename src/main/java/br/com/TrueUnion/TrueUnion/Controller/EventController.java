package br.com.TrueUnion.TrueUnion.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs.EventRequest;
import br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs.ExchangeRequestDto;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.EventResponse;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.ExchangeReponseDto;
import br.com.TrueUnion.TrueUnion.Services.EventService;

@RestController
@RequestMapping("/api-trueunionb2b/ceremonialist/events")
public class EventController {
	@Autowired
	EventService event;

	@PostMapping
	public EventResponse criarEvento(@RequestBody EventRequest event, @RequestHeader("Authorization") String token) {
		return this.event.createEvent(token, event);
	}

	@GetMapping
	public List<EventResponse> encontrarTodosEventos(@RequestHeader("Authorization") String token) {
		return this.event.findAllEvents(token);
	}

	// String reasonCancellation, int idEvent, String userToken, String password
	@PutMapping("/{idEvent}")
	public EventResponse cancelarEvento(@RequestHeader("Authorization") String token,
			@RequestParam String motivo_cancelamento, @PathVariable int idEvent, @RequestParam String password) {
		return this.event.cancelEvent(motivo_cancelamento, idEvent, token, password);
	}

}
