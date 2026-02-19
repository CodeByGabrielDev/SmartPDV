package br.com.SmartPDV.SmartPDV.Services;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.Entities.Caixa;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Repository.CaixaRepository;
import br.com.SmartPDV.SmartPDV.Repository.LojaRepository;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.CaixaAberturaResponse;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.CaixaFechamentoResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CaixaService {
	private final LojaRepository loja;
	private final CaixaRepository caixa;

	@Transactional
	public CaixaAberturaResponse realizarAberturaCaixa() {

		UsuariosLoja usuarioSession = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		return ValidaSalvaNoBancoRetornaDto(usuarioSession);

	}

	@Transactional
	public CaixaFechamentoResponse fechamentoDeCaixa(long idCaixa) {

		UsuariosLoja usuarioSession = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();

		Caixa caixa = this.caixa.findById(idCaixa).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caixa nao encontrado na base de dados"));
		if (caixa.getFechado()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Caixa ja fechado");
		}

		if (usuarioSession.getLojaVinculada().getId() != caixa.getLoja().getId()) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
					"Voce nao possui autorizacao para fechar o caixa de uma loja que nao esta atrelada ao seu login");
		}
		caixa.setDataFechamento(LocalDateTime.now());
		caixa.setFechado(true);
		this.caixa.save(caixa);
		return new CaixaFechamentoResponse(caixa.getLoja().getRazaoSocial(), usuarioSession.getLogin(),
				caixa.getDataAbertura(), LocalDateTime.now(), caixa.getValorInicial(), caixa.getValorFinal());
	}

	@Transactional
	public void alimentaCaixaAberto(Double valorParaAlimentar, long idCaixa, UsuariosLoja funcionarioAtual) {
		Caixa caixa = this.caixa.findById(idCaixa).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caixa nao encontrado na base de dados"));

		if (caixa.getLoja().getId() != funcionarioAtual.getLojaVinculada().getId()) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
					"Conflito de codigos de filiais, validar o codigo atrelado ao login realiznado a vneda e o caixa aberto");
		}
		if (caixa.getFechado()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					" Caixa fechado, por gentileza averiguar abertura de caixa.");
		}
		caixa.setValorFinal(caixa.getValorFinal() + valorParaAlimentar);

	}

	private CaixaAberturaResponse ValidaSalvaNoBancoRetornaDto(UsuariosLoja usuarioSession) {
		Caixa caixa = this.caixa.findCaixaAberto(usuarioSession.getLojaVinculada().getId());
		if (caixa != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Ja existe um caixa aberto nessa loja, validar o caixa numero: " + caixa.getId());
		}
		this.caixa.save(new Caixa(usuarioSession.getLojaVinculada(), usuarioSession, LocalDateTime.now(), null, 0.0,
				0.0, false));
		return new CaixaAberturaResponse(usuarioSession.getLojaVinculada().getRazaoSocial(), usuarioSession.getLogin(),
				LocalDateTime.now());
	}
}
