package br.com.SmartPDV.SmartPDV.Services;

import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderThreadLocalAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ExcecaoImpostoItemRequest;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ExcecaoImpostoRequest;
import br.com.SmartPDV.SmartPDV.Entities.ExcecaoImposto;
import br.com.SmartPDV.SmartPDV.Entities.ExcecaoImpostoItem;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Enum.TipoImposto;
import br.com.SmartPDV.SmartPDV.Repository.ExcecaoImpostoItemRepository;
import br.com.SmartPDV.SmartPDV.Repository.ExcecaoImpostoRepository;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.ExcecaoImpostoItemResponse;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.ExcecaoImpostoResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExcecaoImpostoService {

	private final ExcecaoImpostoRepository excecaoImposto;
	private final ExcecaoImpostoItemRepository excecaoImpostoItem;

	public ExcecaoImpostoResponse criarExcecaoImposto(ExcecaoImpostoRequest excecao) {
		UsuariosLoja usuario = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (usuario.getPerfil().getCodigo() != 4) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
					"Nao autorizado, apenas a contabilidade pode efetuar criação da exceção de imposto");
		}

		if (excecao.getNaturezao_operacao() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nao foi inserido todos os campos necessarios");
		}

		ExcecaoImposto exceptionEntity = new ExcecaoImposto(LocalDateTime.now(), excecao.getNaturezao_operacao(),
				usuario.getLojaVinculada(), excecao.getDescricao(), false, null);
		this.excecaoImposto.save(exceptionEntity);
		return new ExcecaoImpostoResponse(exceptionEntity.getId(), exceptionEntity.getNaturezaoOperacao(),
				exceptionEntity.getLoja().getRazaoSocial(), exceptionEntity.getDescricao(),
				criaExcecaoImpostoItemPersisteERetorna(excecao, exceptionEntity));

	}

	private List<ExcecaoImpostoItemResponse> criaExcecaoImpostoItemPersisteERetorna(ExcecaoImpostoRequest excecao,
			ExcecaoImposto exceptionEntity) {

		List<ExcecaoImpostoItemResponse> excecaoItem = new ArrayList<>();

		for (ExcecaoImpostoItemRequest e : excecao.getItens()) {
			ExcecaoImpostoItem exceptionItem = new ExcecaoImpostoItem(exceptionEntity, e.getTipo(), e.getAliquota(),
					e.getReducao_Base(), false);
			this.excecaoImpostoItem.save(exceptionItem);
			excecaoItem.add(new ExcecaoImpostoItemResponse(e.getTipo(), e.getAliquota(), e.getReducao_Base()));
		}
		return excecaoItem;
	}

	public void vinculaExcecaoDeImpostoNaNota(NotaFiscal notaFiscal) {

		ExcecaoImposto exception = this.excecaoImposto.findExcecaoByCodFilialAndCfop(notaFiscal.getCfop(),
				notaFiscal.getLoja().getId());
		if (exception == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"Nao foi encontado excecao de imposto para essa CFOP e filial");
		}
		
	}
}
