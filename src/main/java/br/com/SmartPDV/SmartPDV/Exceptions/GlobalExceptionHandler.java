package br.com.SmartPDV.SmartPDV.Exceptions;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.ResponseDTOs.ErroResponse;
import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<ErroResponse> handleResponseStatusException(ResponseStatusException ex,
			HttpServletRequest request) {

		ErroResponse erro = new ErroResponse(ex.getStatusCode().value(),
				((HttpStatus) ex.getStatusCode()).getReasonPhrase(), 
				ex.getReason(), request.getRequestURI());

		return ResponseEntity.status(ex.getStatusCode()).body(erro);
	}
}
