package br.com.SmartPDV.SmartPDV.Services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.NotaEntrada;
import br.com.SmartPDV.SmartPDV.Entities.TransitoLoja;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Repository.NotaEntradaRepository;
import br.com.SmartPDV.SmartPDV.Repository.TransitoLojaRepository;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.TransitoLojaResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class TransitoLojaService {

	private final TransitoLojaRepository transito;
	private final AlimentaEstoqueLojaService alimentacao;
	private final NotaEntradaRepository notaEntrada;

	@Transactional
	public void realizarEntradaDeMercadoria(Long id) {
		UsuariosLoja user = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		TransitoLoja notaTransito = this.transito.findById(id).orElseThrow(
				() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nota nao encontrada na base de dados"));
		alimentacao.alimentaEstoqueNotaTransito(notaTransito);
		this.notaEntrada
				.save(new NotaEntrada(notaTransito.getNumeroNota(), notaTransito.getNotaFiscalEmitida().getSerieNf(),
						null, notaTransito.getLojaDestino(), notaTransito.getNotaFiscalEmitida().getDataEmissao(),
						LocalDateTime.now(), notaTransito.getNotaFiscalEmitida().getValorLiquidoNota(),
						notaTransito.getNotaFiscalEmitida().getItensFiscais().size(), user, null));
		this.transito.delete(notaTransito);
		
	}

	public List<TransitoLojaResponse> mostraNotasNoTransito() {
		UsuariosLoja user = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<TransitoLojaResponse> listaResponse = new ArrayList<>();
		List<TransitoLoja> notasNoTransitoDisponiveis = this.transito
				.buscarTodasAsNotasDisponiveis(user.getLojaVinculada().getId());

		for (TransitoLoja transito : notasNoTransitoDisponiveis) {
			listaResponse.add(new TransitoLojaResponse(transito.getId(), transito.getLojaOrigemNome(),
					transito.getLojaDestinoNome(), transito.getNumeroNota(), transito.getDataEnvio(), null));
		}
		return listaResponse;

	}
}
