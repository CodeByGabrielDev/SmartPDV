package br.com.SmartPDV.SmartPDV.Enum;

public enum FormaPagamento {

    DINHEIRO(1),
    CARTAO_CREDITO(2),
    CARTAO_DEBITO(3),
    PIX(4),
    CREDIARIO(5),
    CHEQUE(6);

    private final int codigo;

    FormaPagamento(int codigo) {
        this.codigo = codigo;
    }

    public int getCodigo() {
        return codigo;
    }
}
