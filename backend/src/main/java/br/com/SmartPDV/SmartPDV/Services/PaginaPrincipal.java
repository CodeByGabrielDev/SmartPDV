package br.com.SmartPDV.SmartPDV.Services;

import org.springframework.http.HttpStatus;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.Config.HashSenha;
import br.com.SmartPDV.SmartPDV.Config.TokenService;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.FuncionarioRequest;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.LojaRequest;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.LojaResponse;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.UsuarioLojaResponse;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Enum.PerfilVendedor;
import br.com.SmartPDV.SmartPDV.Repository.FuncionarioLoja;

import br.com.SmartPDV.SmartPDV.Repository.LojaRepository;
import br.com.SmartPDV.SmartPDV.Utils.Validator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaginaPrincipal {

	private final FuncionarioLoja funcionario;

	private final HashSenha hash;

	private final LojaRepository loja;

	private final TokenService token;

	// SERVICE PARA REGISTRO DE FUNCIONARIO
	@Transactional
	public UsuarioLojaResponse registrarFuncionario(FuncionarioRequest funcionarioRegister, long idLoja) {
		return validaDisponibilidadeLoginESenha(funcionarioRegister, idLoja);

	}

	private UsuarioLojaResponse validaDisponibilidadeLoginESenha(FuncionarioRequest funcionarioRegister, long idLoja) {
		UsuariosLoja funcionario = this.funcionario.findByCpfAndCodeFilial(funcionarioRegister.getCpf(), idLoja);

		if (funcionario != null && !funcionario.isInativo()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Já existe um funcionário cadastrado com o CPF '" + funcionarioRegister.getCpf() + "' nesta loja.");
		}
		if (!Validator.validarSenha(funcionarioRegister.getSenha())) {
			throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "A senha não atende aos requisitos mínimos. Use ao menos 8 caracteres com letras, números e caracteres especiais.");
		}

		if (this.funcionario.findByEmail(funcionarioRegister.getEmail()) != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um usuário cadastrado com o email '" + funcionarioRegister.getEmail() + "'.");
		}

		return salvaInfoNoBancoRetornaDto(funcionarioRegister, idLoja);

	}

	private UsuarioLojaResponse salvaInfoNoBancoRetornaDto(FuncionarioRequest funcionarioRegister, Long idLoja) {
		Loja loja = this.loja.findById(idLoja)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja com ID '" + idLoja + "' não encontrada no sistema."));
		if (funcionarioRegister.getPerfil() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O perfil do usuário é obrigatório. Selecione um perfil antes de prosseguir.");
		}

		System.out.println("Perfil do usuario: " + funcionarioRegister.getPerfil());
		this.funcionario.save(new UsuariosLoja(funcionarioRegister.getNome_vendedor(), funcionarioRegister.getCpf(),
				funcionarioRegister.getLogin(), funcionarioRegister.getEmail(),
				this.hash.passwordEncoder().encode(funcionarioRegister.getSenha()),
				PerfilVendedor.fromCodigo(funcionarioRegister.getPerfil()), false, loja));
		return new UsuarioLojaResponse(funcionarioRegister.getNome_vendedor(), funcionarioRegister.getCpf(),
				funcionarioRegister.getLogin(), funcionarioRegister.getPerfil().toString(), loja.getRazaoSocial());
	}

	

	public String login(String login, String senha) {
		if (login == null || senha == null) {
			throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Login e senha são obrigatórios para acessar o sistema.");
		}
		UsuariosLoja user = this.funcionario.findByLogin(login);
		if (user == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Login ou senha incorretos. Verifique suas credenciais e tente novamente.");
		}

		if (!this.hash.passwordEncoder().matches(senha, user.getSenha())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login ou senha incorretos. Verifique suas credenciais e tente novamente.");
		}

		return (this.token.gerarToken(user));
	}

}
