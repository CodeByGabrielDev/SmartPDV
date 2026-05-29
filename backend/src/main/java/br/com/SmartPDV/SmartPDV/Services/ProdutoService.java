package br.com.SmartPDV.SmartPDV.Services;

import org.springframework.stereotype.Service;

import br.com.SmartPDV.SmartPDV.Repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    

}
