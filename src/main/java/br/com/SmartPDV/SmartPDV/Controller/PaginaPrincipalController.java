package br.com.SmartPDV.SmartPDV.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.FuncionarioRequest;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.UsuarioLojaResponse;
import br.com.SmartPDV.SmartPDV.Services.PaginaPrincipal;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api-smartpdv/auth")
@RequiredArgsConstructor
public class PaginaPrincipalController {
	
	
	private final PaginaPrincipal paginaService;

	@PostMapping("/register/employee")
	public UsuarioLojaResponse registrarUsuario(@RequestBody FuncionarioRequest funcionario, @RequestParam int idLoja) {
		return this.paginaService.registrarFuncionario(funcionario, idLoja);
	}

	@GetMapping("/login/employee")
	public String login(String login, String senha) {
		
		return this.paginaService.login(login, senha);
	}
}
