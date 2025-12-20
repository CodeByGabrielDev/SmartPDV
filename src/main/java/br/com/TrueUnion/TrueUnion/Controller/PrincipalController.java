package br.com.TrueUnion.TrueUnion.Controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs.CeremonialistRequest;
import br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs.SupplierRequest;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.CeremonialistResponse;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.SupplierResponse;
import br.com.TrueUnion.TrueUnion.Services.AuthService;

@RestController
@RequestMapping("/api-trueunionb2b/auth")
public class PrincipalController {

	@Autowired
	AuthService loginSessionService;

	@PostMapping("/register/supplier")
	public SupplierResponse registerSupplier(@RequestBody SupplierRequest supRequest, @RequestParam int idCategory) {
		return this.loginSessionService.registerSupplier(supRequest, idCategory);
	}

	@PostMapping("/register/ceremonialist")
	public CeremonialistResponse registerCeremonialist(@RequestBody CeremonialistRequest cere) {
		return this.loginSessionService.registerCeremonialist(cere);
	}

	@PostMapping("/login")
	public Object login(@RequestParam String email,@RequestParam String password) {
		return this.loginSessionService.login(email, password);
	}

}
