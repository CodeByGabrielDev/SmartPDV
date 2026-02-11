package br.com.SmartPDV.SmartPDV.Config;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Repository.FuncionarioLoja;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class UsuariosLojaDetailsService implements UserDetailsService {

	private final FuncionarioLoja funcionario;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UsuariosLoja usuario = this.funcionario.findByLogin(username);
		if (usuario == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nao encontrado");

		}
		return usuario;
	}

}
