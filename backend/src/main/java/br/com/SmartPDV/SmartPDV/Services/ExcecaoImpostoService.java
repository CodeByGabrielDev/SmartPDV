package br.com.SmartPDV.SmartPDV.Services;

import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderThreadLocalAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ExcecaoImpostoItemRequest;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ExcecaoImpostoRequest;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.ExcecaoImpostoItemResponse;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.ExcecaoImpostoResponse;
import br.com.SmartPDV.SmartPDV.Entities.ExcecaoImposto;
import br.com.SmartPDV.SmartPDV.Entities.ExcecaoImpostoItem;
import br.com.SmartPDV.SmartPDV.Enum.PerfilVendedor;
import br.com.SmartPDV.SmartPDV.Entities.Loja;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Enum.TipoImposto;
import br.com.SmartPDV.SmartPDV.Repository.ExcecaoImpostoItemRepository;
import br.com.SmartPDV.SmartPDV.Repository.ExcecaoImpostoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExcecaoImpostoService {

	private final ExcecaoImpostoRepository excecaoImposto;
	private final ExcecaoImpostoItemRepository excecaoImpostoItem;

	@Transactional
	public ExcecaoImpostoResponse criarExcecaoImposto(ExcecaoImpostoRequest excecao) {
		UsuariosLoja usuario = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (usuario.getPerfil() != PerfilVendedor.CONTABILIDADE
				&& usuario.getPerfil() != PerfilVendedor.ADMIN) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
					"Acesso negado. Somente usuários de contabilidade ou administradores podem criar exceções de imposto.");
		}

		if (excecao.getNaturezao_operacao() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O campo 'Natureza da Operação' é obrigatório para criar uma exceção de imposto.");
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
		if (excecao.getItens() != null && !excecao.getItens().isEmpty()) {
			for (ExcecaoImpostoItemRequest e : excecao.getItens()) {
				ExcecaoImpostoItem exceptionItem = new ExcecaoImpostoItem(exceptionEntity, e.getTipo(), e.getAliquota(),
						e.getReducao_Base(), false);
				this.excecaoImpostoItem.save(exceptionItem);
				excecaoItem.add(new ExcecaoImpostoItemResponse(e.getTipo(), e.getAliquota(), e.getReducao_Base()));
			}
		}

		return excecaoItem;
	}
	@org.springframework.transaction.annotation.Transactional(readOnly = true)
	public List<ExcecaoImpostoResponse> buscarTodasAsExcecoesImposto() {
		UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();

		List<ExcecaoImpostoResponse> listaDeExcecoes = new ArrayList<>();
		List<ExcecaoImposto> findAll = this.excecaoImposto.findAllExcecoes(usuariosLoja.getLojaVinculada().getId());

		return montaDto(listaDeExcecoes, findAll);
	}

	private List<ExcecaoImpostoResponse> montaDto(List<ExcecaoImpostoResponse> listaDeExcecoes,
			List<ExcecaoImposto> findAll) {
		for (ExcecaoImposto excecaoImposto : findAll) {
			List<ExcecaoImpostoItemResponse> excecaoImpostoItemResponses = new ArrayList<>();
			ExcecaoImpostoResponse excecaoImpostoResponse = new ExcecaoImpostoResponse(excecaoImposto.getId(),
					excecaoImposto.getNaturezaoOperacao(), excecaoImposto.getLoja().getRazaoSocial(),
					excecaoImposto.getDescricao());
			if (excecaoImposto.getExcecaoImpostoItem() != null) {
				for (ExcecaoImpostoItem excecaoImpostoItem : excecaoImposto.getExcecaoImpostoItem()) {
					excecaoImpostoItemResponses.add(new ExcecaoImpostoItemResponse(excecaoImpostoItem.getTipo(),
							excecaoImpostoItem.getAliquota(), excecaoImpostoItem.getReducaoBase()));
				}

			}
			excecaoImpostoResponse.setExcecaoImpostoItem(excecaoImpostoItemResponses);
			listaDeExcecoes.add(excecaoImpostoResponse);
		}
		return listaDeExcecoes;

	}
}
