package br.com.SmartPDV.SmartPDV.Services;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.SmartPDV.SmartPDV.Client.ViaCepClient;
import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ClienteRequest;
import br.com.SmartPDV.SmartPDV.Entities.Clientes;
import br.com.SmartPDV.SmartPDV.Entities.UsuariosLoja;
import br.com.SmartPDV.SmartPDV.Enum.TiposCliente;
import br.com.SmartPDV.SmartPDV.Repository.ClienteRepository;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.ClienteResponse;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.ViaCepResponse;
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
            throw new ResponseStatusException(HttpStatus.CONFLICT, " Ja existe um cliente cadastrado com esse cpf");
        }
        if (this.clienteRepository.selectByEmail(clienteRequest.getEmail()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "ja existe um cliente cadastrado com esse email");
        }

        if (viaCepResponse == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    " Nao foi encontrado inforamcoes para esse Cep, utilize um cep vizinho ou cep da loja");
        }
        Clientes clientes = new Clientes(clienteRequest.getNome_cliente(), clienteRequest.getCpf_cnpj(),
                clienteRequest.getEmail(), clienteRequest.getTelefone(), viaCepResponse.getCep(),
                viaCepResponse.getLogradouro(), viaCepResponse.getBairro(), viaCepResponse.getLocalidade(),
                viaCepResponse.getUf(), viaCepResponse.getEstado(), TiposCliente.PESSOA_FISICA, LocalDateTime.now(),
                usuariosLoja.getLojaVinculada(), false);

        this.clienteRepository.save(clientes);
        return new ClienteResponse(clientes.getNomeCliente(), clientes.getCpfCnpj(), clientes.getEmail(),
                clientes.getTelefone(), clientes.getTipo().toString(), clientes.getCep(), clientes.getLogradouro(),
                clientes.getBairro(), clientes.getLocalidade(), clientes.getUf(), clientes.getEstado());

    }

    @Transactional
    public ClienteResponse alterarCadastro(Long idCliente, ClienteRequest clienteRequest) {
        UsuariosLoja usuariosLoja = (UsuariosLoja) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Clientes cliente = this.clienteRepository.findById(idCliente).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nao foi encontrado o respectivo cliente"));
        if (cliente.getLoja().getId() != usuariosLoja.getLojaVinculada().getId()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "proibido alterar informacao de um cliente que esteja vinculado a outra loja");
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
        return new ClienteResponse(cliente.getNomeCliente(), cliente.getCpfCnpj(), cliente.getEmail(),
                cliente.getTelefone(), cliente.getTipo().toString(), cliente.getCep(), cliente.getLogradouro(),
                cliente.getBairro(), cliente.getLocalidade(), cliente.getUf(), cliente.getEstado());

    }
}
