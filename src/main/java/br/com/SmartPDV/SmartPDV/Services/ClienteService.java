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
        if (this.clienteRepository.selectByCpfOrCnpj(clienteRequest.getCpf_cnpj()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, " Ja existe um cliente cadastrado com esse cep");
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
}
