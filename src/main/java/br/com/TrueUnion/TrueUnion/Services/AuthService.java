package br.com.TrueUnion.TrueUnion.Services;

import java.time.LocalDateTime;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.TrueUnion.TrueUnion.Config.JwtService;
import br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs.CeremonialistRequest;
import br.com.TrueUnion.TrueUnion.DTOs.RequestDTOs.SupplierRequest;
import br.com.TrueUnion.TrueUnion.Entities.Ceremonialist;
import br.com.TrueUnion.TrueUnion.Entities.ServiceCategory;
import br.com.TrueUnion.TrueUnion.Entities.Supplier;
import br.com.TrueUnion.TrueUnion.Entities.User;
import br.com.TrueUnion.TrueUnion.Repository.CeremonialistRepository;

import br.com.TrueUnion.TrueUnion.Repository.ServiceCategoryRepository;
import br.com.TrueUnion.TrueUnion.Repository.SupplierRepository;
import br.com.TrueUnion.TrueUnion.Repository.UserProfileRepository;
import br.com.TrueUnion.TrueUnion.Repository.UserRepository;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.CeremonialistResponse;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.SupplierResponse;
import br.com.TrueUnion.TrueUnion.ResponseDTOs.UserResponse;
import jakarta.transaction.Transactional;

@Service
public class AuthService {
	@Autowired
	CeremonialistRepository ceremonialist;
	@Autowired
	UserRepository user;

	@Autowired
	SupplierRepository supplier;
	@Autowired
	ServiceCategoryRepository scr;
	@Autowired
	UserProfileRepository userRepo;
	@Autowired
	PasswordEncoder passwordEncoder;
	@Autowired
	JwtService jwt;

	public SupplierResponse registerSupplier(SupplierRequest supplier, int idServiceCategory) {
		User user = this.user.findByEmail(supplier.getEmail());
		if (user != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT);
		}
		validatorSomeAttributesSupplier(supplier);
		Supplier sup = new Supplier(supplier.getEmail(), passwordEncoder.encode(supplier.getPassword()),
				supplier.getSocial_Reason(), supplier.getCnpj(), supplier.getBiography(), supplier.getContact(), 0, 0,
				null);
		sup.setCategory(findServiceCategory(idServiceCategory));
		sup.setActive(true);
		sup.setRegisterDate(LocalDateTime.now());
		sup.setUserType(this.userRepo.findById(1).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
		this.supplier.save(sup);
		return builderSupplierResponse(sup);
	}

	public CeremonialistResponse registerCeremonialist(CeremonialistRequest ceremonialist) {
		User user = this.user.findByEmail(ceremonialist.getEmail());
		if (user != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT);
		}
		validatorSomeAttributesCeremonialist(ceremonialist);

		Ceremonialist userCerimonialist = new Ceremonialist(ceremonialist.getEmail(),
				this.passwordEncoder.encode(ceremonialist.getPassword()), ceremonialist.getCpf(),
				ceremonialist.getName(), ceremonialist.getContact());
		userCerimonialist.setActive(true);
		userCerimonialist.setRegisterDate(LocalDateTime.now());
		userCerimonialist.setUserType(
				this.userRepo.findById(2).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
		this.ceremonialist.save(userCerimonialist);

		return builderCeremonialistResponse(userCerimonialist);

	}

	private ServiceCategory findServiceCategory(int idCategory) {
		return this.scr.findById(idCategory).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

	}

	private void validatorSomeAttributesCeremonialist(CeremonialistRequest cere) {
		Ceremonialist ceremonialist = this.ceremonialist.findCeremonialistByCpfOrContact(cere.getCpf(),
				cere.getContact());
		if (ceremonialist != null) {
			throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);
		}
	}

	private void validatorSomeAttributesSupplier(SupplierRequest sup) {
		Supplier supplier = this.supplier.findSupplierByContactOrCnpj(sup.getContact(), sup.getCnpj());
		if (supplier != null) {
			throw new ResponseStatusException(HttpStatus.CONFLICT);
		}
	}

	@Transactional
	public Object login(String email, String senha) {
		User userObj = this.user.findByEmail(email);
		if (userObj == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}

		if (passwordEncoder.matches(senha, userObj.getPassword())) {
			String token = this.jwt.generateToken(userObj.getEmail(), userObj.getUserType().getProfile());
			return new UserResponse(userObj.getId(), userObj.getEmail(), token, userObj.getUserType().getProfile());
		} else {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		}

	}

	private SupplierResponse builderSupplierResponse(User user) {
		Supplier sup = this.supplier.findByUserId(user.getId());
		return new SupplierResponse(sup.getId(), sup.getEmail(), sup.getSocialReason(), sup.getCnpj(),
				sup.getBiography(), sup.getRating(), sup.getNumberOfReviews(), sup.getCategory().getDescription());
	}

	private CeremonialistResponse builderCeremonialistResponse(User user) {
		Ceremonialist cere = this.ceremonialist.findCerimonialistByIdUser(user.getId());
		return new CeremonialistResponse(cere.getId(), cere.getEmail(), cere.getCpf(), cere.getName(),
				cere.getContact());
	}

}
