package br.com.SmartPDV.SmartPDV.Services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.Client.ViaCepClient;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ClienteRequest;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.ClienteResponse;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.ViaCepResponse;
import br.com.SmartPDV.SmartPDV.Entities.Clientes;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Enum.PerfilVendedor;
import br.com.SmartPDV.SmartPDV.Enum.TiposCliente;
import br.com.SmartPDV.SmartPDV.Repository.ClienteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    private final ViaCepClient viaCepClient;

    public ClienteResponse cadastraCliente(ClienteRequest clienteRequest) {
        UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        ViaCepResponse viaCepResponse = this.viaCepClient.buscarCep(clienteRequest.getCep()).block();
        Clientes cliente = this.clienteRepository.selectByCpfOrCnpj(clienteRequest.getCpf_cnpj());

        if (cliente != null && cliente.getLoja().getId() == usuariosLoja.getLojaVinculada().getId()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um cliente cadastrado com o CPF/CNPJ '" + clienteRequest.getCpf_cnpj() + "' nesta loja.");
        }
        if (this.clienteRepository.selectByEmail(clienteRequest.getEmail()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um cliente cadastrado com o email '" + clienteRequest.getEmail() + "'.");
        }

        if (viaCepResponse == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Não foi possível localizar informações para o CEP informado. Verifique o CEP ou utilize um CEP vizinho.");
        }
        Clientes clientes = new Clientes(clienteRequest.getNome_cliente(), clienteRequest.getCpf_cnpj(),
                clienteRequest.getEmail(), clienteRequest.getTelefone(), viaCepResponse.getCep(),
                viaCepResponse.getLogradouro(), viaCepResponse.getBairro(), viaCepResponse.getLocalidade(),
                viaCepResponse.getUf(), viaCepResponse.getEstado(), TiposCliente.PESSOA_FISICA, LocalDateTime.now(),
                usuariosLoja.getLojaVinculada(), false);

        this.clienteRepository.save(clientes);
        return new ClienteResponse(clientes.getId(), clientes.getNomeCliente(), clientes.getCpfCnpj(),
                clientes.getEmail(),
                clientes.getTelefone(), clientes.getTipo().toString(), clientes.getCep(), clientes.getLogradouro(),
                clientes.getBairro(), clientes.getLocalidade(), clientes.getUf(), clientes.getEstado());

    }

    @Transactional
    public ClienteResponse alterarCadastro(Long idCliente, ClienteRequest clienteRequest) {
        UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Clientes cliente = this.clienteRepository.findById(idCliente).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente com ID '" + idCliente + "' não foi encontrado no sistema."));
        if (cliente.getLoja().getId() != usuariosLoja.getLojaVinculada().getId()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Acesso negado. Você não pode alterar informações de clientes vinculados a outras lojas.");
        }
        if (clienteRequest.getCep() != null) {
            cliente.setCep(clienteRequest.getCep());
        }
        if (clienteRequest.getCpf_cnpj() != null) {
            cliente.setCpfCnpj(clienteRequest.getCpf_cnpj());
        }
        if (clienteRequest.getEmail() != null) {
            cliente.setEmail(clienteRequest.getEmail());
        }
        if (clienteRequest.getNome_cliente() != null) {
            cliente.setNomeCliente(clienteRequest.getNome_cliente());
        }
        if (clienteRequest.getTelefone() != null) {
            cliente.setTelefone(clienteRequest.getTelefone());
        }
        this.clienteRepository.save(cliente);
        return new ClienteResponse(cliente.getId(), cliente.getNomeCliente(), cliente.getCpfCnpj(), cliente.getEmail(),
                cliente.getTelefone(), cliente.getTipo().toString(), cliente.getCep(), cliente.getLogradouro(),
                cliente.getBairro(), cliente.getLocalidade(), cliente.getUf(), cliente.getEstado());

    }

    public List<ClienteResponse> retornaClientesDaLoja() {
        UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        List<Clientes> findAllClientes = this.clienteRepository
                .findAllClientesByShop(usuariosLoja.getLojaVinculada().getId());
        List<ClienteResponse> listaDeclientes = new ArrayList<>();
        for (Clientes clientes : findAllClientes) {
            listaDeclientes.add(new ClienteResponse(clientes.getId(), clientes.getNomeCliente(), clientes.getCpfCnpj(),
                    clientes.getEmail(), clientes.getTelefone(), clientes.getTipo().toString(), clientes.getCep(),
                    clientes.getLogradouro(), clientes.getBairro(), clientes.getLocalidade(), clientes.getUf(),
                    clientes.getEstado()));
        }
        return listaDeclientes;
    }
}
