package br.com.TrueUnion.TrueUnion.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs.SupplierServiceRequest;
import br.com.TrueUnion.TrueUnion.Repository.LoginSessionRepository;
import br.com.TrueUnion.TrueUnion.Repository.SupplierRepository;
import br.com.TrueUnion.TrueUnion.Repository.SupplierServiceRepository;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.SupplierServiceResponse;

@Service
public class SupplierServiceService {

	@Autowired
	SupplierServiceRepository spr;
	@Autowired
	SupplierRepository supRepo;
	@Autowired
	LoginSessionRepository loginSession;

	public SupplierServiceResponse criarServicedeSupplier(String token, int idCategoria,
			SupplierServiceRequest supplierServiceRequest) {

		return null;

	}

}
