package br.com.SmartPDV.SmartPDV.Services;

import org.springframework.http.HttpStatus;

import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.Config.HashSenha;
import br.com.SmartPDV.SmartPDV.Config.TokenService;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.FuncionarioRequest;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.LojaRequest;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Enum.PerfilVendedor;
import br.com.SmartPDV.SmartPDV.Repository.FuncionarioLoja;

import br.com.SmartPDV.SmartPDV.Repository.LojaRepository;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.LojaResponse;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.UsuarioLojaResponse;
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

	@Transactional
	public LojaResponse registrarLoja(LojaRequest loja) {
		return validaDisponibilidadeRegistroDeLoja(loja);
	}

	private LojaResponse validaDisponibilidadeRegistroDeLoja(LojaRequest loja) {
		loja.setCnpj(Validator.validaCnpj(loja.getCnpj()));
		if (this.loja.findByCnpj(loja.getCnpj()) != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Cnpj ja cadastrado na base de dados");
		}
		return salvaInfoNoBancoRetornaDtoLoja(loja);
	}

	private UsuarioLojaResponse validaDisponibilidadeLoginESenha(FuncionarioRequest funcionarioRegister, long idLoja) {
		UsuariosLoja funcionario = this.funcionario.findByCpfAndCodeFilial(funcionarioRegister.getCpf(), idLoja);

		if (funcionario != null && !funcionario.isInativo()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Ja existe um usuario com esse cpf atrelado a essa loja");
		}
		if (!Validator.validarSenha(funcionarioRegister.getSenha())) {
			throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Senha muito fraca");
		}

		if (this.funcionario.findByEmail(funcionarioRegister.getEmail()) != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Usuario ja existentente com esse email");
		}

		return salvaInfoNoBancoRetornaDto(funcionarioRegister, idLoja);

	}

	private UsuarioLojaResponse salvaInfoNoBancoRetornaDto(FuncionarioRequest funcionarioRegister, long idLoja) {
		Loja loja = this.loja.findById(idLoja)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja nao encontrada"));
		if (funcionarioRegister.getPerfil() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Perfil do usuário é obrigatório");
		}
		this.funcionario.save(new UsuariosLoja(funcionarioRegister.getNome_vendedor(), funcionarioRegister.getCpf(),
				funcionarioRegister.getLogin(), funcionarioRegister.getEmail(),
				this.hash.passwordEncoder().encode(funcionarioRegister.getSenha()),
				PerfilVendedor.fromCodigo(funcionarioRegister.getPerfil()), false, loja));
		return new UsuarioLojaResponse(funcionarioRegister.getNome_vendedor(), funcionarioRegister.getCpf(),
				funcionarioRegister.getLogin(), funcionarioRegister.getPerfil().toString(), loja.getRazaoSocial());
	}

	private LojaResponse salvaInfoNoBancoRetornaDtoLoja(LojaRequest loja) {
		this.loja.save(new Loja(loja.getRazaoSocial(), loja.getCnpj(), loja.getIE(), loja.getEndereco(), false));
		return new LojaResponse(loja.getRazaoSocial(), loja.getCnpj(), loja.getIE(), loja.getEndereco());
	}

	public String login(String login, String senha) {
		UsuariosLoja user = this.funcionario.findByLogin(login);

		if (user == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Senha ou login incorreto!");
		}
		if (!this.hash.passwordEncoder().matches(senha, user.getSenha())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha ou login incorreto!");
		}

		return ("Token: " + this.token.gerarToken(user) + " Loja: " + user.getLojaVinculada().getRazaoSocial());
	}

	public void vinculaLojaAoTerminal(long idLoja) {
		Loja lojaEntity = this.loja.findById(idLoja).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loja nao encontrada no banco de dados"));

	}
}
