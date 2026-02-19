package br.com.SmartPDV.SmartPDV.Enum;

public enum TipoImposto {

	ICMS(1), PIS(2), COFINS(3), IPI(4), IBS(5), CBS(6);

	private final int codigo;

	TipoImposto(int codigo) {
		this.codigo = codigo;
	}

	public int getCodigo() {
		return codigo;
	}

	public static TipoImposto fromCodigo(int codigo) {
		for (TipoImposto perfil : TipoImposto.values()) {
			if (perfil.getCodigo() == codigo)
				return perfil;
		}
		throw new IllegalArgumentException("Código de imposto inválido: " + codigo);
	}
}
