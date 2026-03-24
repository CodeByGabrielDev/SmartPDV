package br.com.SmartPDV.SmartPDV.Services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.VendaItemRequest;
import br.com.SmartPDV.SmartPDV.Entities.Caixa;
import br.com.SmartPDV.SmartPDV.Entities.Clientes;
import br.com.SmartPDV.SmartPDV.Entities.NotaFiscal;
import br.com.SmartPDV.SmartPDV.Entities.Pagamento;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Entities.Venda;
import br.com.SmartPDV.SmartPDV.Enum.PerfilVendedor;
import br.com.SmartPDV.SmartPDV.Repository.CaixaRepository;
import br.com.SmartPDV.SmartPDV.Repository.ClienteRepository;

import br.com.SmartPDV.SmartPDV.Repository.VendaRepository;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.VendaResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendaService {

	private final ClienteRepository clienteRepository;
	private final VendaRepository vendaRepository;
	private final CaixaRepository caixa;
	private final VendaItemService vendaItem;

	@Transactional
	public void realizarVenda(VendaItemRequest itens, String cpfOrCnpj) {
		UsuariosLoja usuarioLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (usuarioLoja.getPerfil() != PerfilVendedor.GERENTE
				&& usuarioLoja.getPerfil() != PerfilVendedor.FUNCIONARIO) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
					"Apenas a gerencia ou o funcionario da loja pode realizar vendas.");
		}
		Caixa caixa = this.caixa.findCaixaAberto(usuarioLoja.getLojaVinculada().getId());
		if (caixa == null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					" Não foi realizado a abertura de um caixa para realizar vendas, efetue a abertura do caixa");
		}
		Clientes cliente = findCustomer(cpfOrCnpj);
		Venda venda = new Venda(null, caixa, cliente, LocalDateTime.now(), 0.0, usuarioLoja.getLojaVinculada(), 0.0,
				usuarioLoja);
		geraSequencialTicket(venda.getLoja().getId(), venda);
		this.vendaRepository.save(venda);
		this.vendaItem.insereItensVenda(itens, venda, caixa);

	}

	public List<VendaResponse> relatorioDeVendasPorDia(LocalDateTime diaInicial, LocalDateTime diaFinal) {
		UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		List<Venda> vendas = this.vendaRepository.selectVendaByDataFilter(diaInicial, diaFinal,
				usuariosLoja.getLojaVinculada().getId());
		System.out.println(vendas);
		List<VendaResponse> vendaResponses = new ArrayList<>();
		for (Venda venda : vendas) {
			VendaResponse vendaResponse = new VendaResponse(venda.getTicket(), venda.getCaixa().getId(),
					venda.getCliente().getCpfCnpj(), venda.getDataHora(), venda.getValorTotal(),
					venda.getLoja().getId(), venda.getDesconto(), venda.getUsuario().getNomeVendedor(), null);
			for (Pagamento pagamento : venda.getPgto()) {
				if (venda.getId().equals(pagamento.getVenda().getId())) {
					vendaResponse.setNumero_fiscal(pagamento.getNotaFiscal().getNfNumero());
				}
			}
			vendaResponses.add(vendaResponse);

		}
		return vendaResponses;
	}

	private Clientes findCustomer(String cpfOrCnpj) {
		Clientes cliente = this.clienteRepository.selectByCpfOrCnpj(cpfOrCnpj);
		if (cliente == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"Cliente nao encontrado na base, valide o documento ou cadastre.");
		}
		return cliente;
	}

	private void geraSequencialTicket(Long idLoja, Venda venda) {
		List<Venda> sequential = this.vendaRepository.selectLastTicket(idLoja, PageRequest.of(0, 1));

		if (!sequential.isEmpty() && sequential.get(0).getTicket() != null) {
			venda.setTicket(sequential.get(0).getTicket() + 1);
		} else {
			venda.setTicket(1L);
		}
	}

}
