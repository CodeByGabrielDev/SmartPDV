package br.com.SmartPDV.SmartPDV.Services;

import org.springframework.stereotype.Service;

import br.com.SmartPDV.SmartPDV.Client.ViaCepClient;
import br.com.SmartPDV.SmartPDV.ResponseDTOs.ViaCepResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ViaCepService {


    private final ViaCepClient viaCepClient;
    
    


}
