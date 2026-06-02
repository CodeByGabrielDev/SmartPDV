package br.com.SmartPDV.SmartPDV.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.SmartPDV.SmartPDV.DTOs.RequestDTOs.ClienteRequest;
import br.com.SmartPDV.SmartPDV.DTOs.ResponseDTOs.ClienteResponse;
import br.com.SmartPDV.SmartPDV.Services.ClienteService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api-smartpdv/costumer/")
public class ClienteController {

    private final ClienteService clienteService;

    @PostMapping
    public ClienteResponse registrarCliente(@RequestBody ClienteRequest clienteRequest) {
        return this.clienteService.cadastraCliente(clienteRequest);
    }

    @PutMapping("/{idUser}/")
    public ClienteResponse alterarCadastro(@PathVariable Long idUser, @RequestBody ClienteRequest clienteRequest) {
        return this.clienteService.alterarCadastro(idUser, clienteRequest);
    }

    @GetMapping
    public List<ClienteResponse> retornaTodosOsClientesDaLoja() {
        return this.clienteService.retornaClientesDaLoja();
    }

}
