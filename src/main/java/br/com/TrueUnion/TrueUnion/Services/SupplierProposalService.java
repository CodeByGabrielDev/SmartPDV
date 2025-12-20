package br.com.TrueUnion.TrueUnion.Services;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs.SupplierProposalRequest;
import br.com.TrueUnion.TrueUnion.Entities.ProposalRequest;
import br.com.TrueUnion.TrueUnion.Entities.StatusProposal;
import br.com.TrueUnion.TrueUnion.Entities.Supplier;
import br.com.TrueUnion.TrueUnion.Entities.SupplierProposal;
import br.com.TrueUnion.TrueUnion.Entities.SupplierService;
import br.com.TrueUnion.TrueUnion.Entities.User;
import br.com.TrueUnion.TrueUnion.Repository.LoginSessionRepository;
import br.com.TrueUnion.TrueUnion.Repository.ProposalRequestRepository;
import br.com.TrueUnion.TrueUnion.Repository.StatusProposalRepository;
import br.com.TrueUnion.TrueUnion.Repository.SupplierProposalRepository;
import br.com.TrueUnion.TrueUnion.Repository.SupplierRepository;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.SupplierProposalResponse;

@Service
public class SupplierProposalService {
	@Autowired
	SupplierRepository supplier;

	@Autowired
	LoginSessionRepository loginSession; // utilizei token manualmente, no front sera utilizado no localStorage
	@Autowired
	ProposalRequestRepository proposalRequestCere;
	@Autowired
	StatusProposalRepository stats;

	public SupplierProposalResponse criarPropostaParaSolicitacao(String token, SupplierProposalRequest supplierRequest,
			int idProposta, int supplierServiceId, int idSupplierService) {
		Supplier sup = returnObject(token);
		ProposalRequest propRequest = this.proposalRequestCere.findById(idProposta)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

		if (propRequest.getStats().getId() == 3 && propRequest.getAddressee().getId() == sup.getId()) {

			
			/*
			 * public SupplierProposal(SupplierService supplierService, Double valueProposal, String descriptionProposal,
			LocalDate sendDate, StatusProposal stats, ProposalRequest proposal)
			
			
			APENAS FALTANDO SUPPLIERSERVICE PARA COMPLETAR O CONSTRUTOR
			 */
		}
		return null;
	}

	private Supplier returnObject(String token) {
		User user = this.loginSession.findByToken(token);
		return this.supplier.findByUserId(user.getId());
	}
}
