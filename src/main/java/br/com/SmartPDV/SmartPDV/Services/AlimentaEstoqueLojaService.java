package br.com.SmartPDV.SmartPDV.Services;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.Entities.EstoqueProduto;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscalItem;
import br.com.SmartPDV.SmartPDV.Entities.TransitoLoja;
import br.com.SmartPDV.SmartPDV.Repository.EstoqueProdutoRepository;
import br.com.SmartPDV.SmartPDV.Repository.TransitoLojaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AlimentaEstoqueLojaService {

	private final EstoqueProdutoRepository estoqueRepository;

	private final TransitoLojaRepository transitoLoja;
	
	
	/*
	 * metodo utilizado para alimentacao de estoque, usuario nao tem acesso a esse metodo.
	 */
	@Transactional
	public void alimentaEstoqueNotaTransito(TransitoLoja transito) {
		if (transito.getDataRecebimento() != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Conflito, nota ja dada entrada anteriormente, horario da entrada: "
							+ transito.getDataRecebimento());
		}
		for (NotaFiscalItem notaItem : transito.getNotaFiscalEmitida().getItensFiscais()) {
			EstoqueProduto estoque = this.estoqueRepository.selectEstoqueProdutoByIdAndCodigoFilial(
					transito.getLojaDestino().getId(), notaItem.getProduto().getId());
			if (estoque == null) {
				estoque = new EstoqueProduto(notaItem.getProduto(), transito.getLojaDestino(), 0,
						notaItem.getProduto().getCodigoBarra());
				this.estoqueRepository.save(estoque);
			}

			estoque.setQtdAtual(estoque.getQtdAtual() + notaItem.getQuantidadeItens());
			this.estoqueRepository.save(estoque);

		}
		transito.setDataRecebimento(LocalDateTime.now());
		this.transitoLoja.save(transito);
	}

	
}
