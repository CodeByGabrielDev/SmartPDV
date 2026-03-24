package br.com.SmartPDV.SmartPDV.Client;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import br.com.SmartPDV.SmartPDV.ResponseDTOs.ViaCepResponse;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@Service
public class ViaCepClient {

    private final WebClient webClient;

    public Mono<ViaCepResponse> buscarCep(String cep) {
        return this.webClient.get().uri("/{cep}/json/", cep).retrieve().bodyToMono(ViaCepResponse.class);
    }
}
