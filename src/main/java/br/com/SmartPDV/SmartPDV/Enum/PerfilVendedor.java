package br.com.SmartPDV.SmartPDV.Enum;

public enum PerfilVendedor {

	ADMIN(1), GERENTE(2), FUNCIONARIO(3), CONTABILIDADE(4);

	private final int codigo;

	PerfilVendedor(int codigo) {
		this.codigo = codigo;
	}

	public int getCodigo() {
		return codigo;
	}

	public static PerfilVendedor fromCodigo(int codigo) {
		for (PerfilVendedor perfil : PerfilVendedor.values()) {
			if (perfil.getCodigo() == codigo)
				return perfil;
		}
		throw new IllegalArgumentException("Código de perfil inválido: " + codigo);
	}
}
