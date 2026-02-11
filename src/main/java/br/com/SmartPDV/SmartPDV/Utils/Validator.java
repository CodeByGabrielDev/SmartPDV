package br.com.SmartPDV.SmartPDV.Utils;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class Validator {

	public static boolean validarSenha(String senha) {

		boolean temLetra = false;
		boolean temNumero = false;
		boolean temEspecial = false;
		if (senha.length() < 8) {
			return false;
		}
		for (char c : senha.toCharArray()) {
			if (Character.isDigit(c)) {
				temNumero = true;
			} else if (Character.isLetter(c)) {
				temLetra = true;
			} else {
				temEspecial = true;
			}
		}
		if (temLetra && temNumero && temEspecial) {
			return true;
		}
		return false;
	}

	public static String validaCnpj(String cnpj) {
		if (cnpj.isBlank() || cnpj == null) {
			throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "o cnpj fornecido esta vazio ou null");
		}
		for (char c : cnpj.toCharArray()) {
			if (Character.isAlphabetic(c)) {
				throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Cnpj nao pode conter letras.");
			}

		}
		return cnpj.replace(".", "")
				   .replace("-", "")
				   .replace("/", "")
				   .trim();

	}

}
