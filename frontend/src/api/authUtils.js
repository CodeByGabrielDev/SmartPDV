/**
 * Decodifica o payload do JWT armazenado no localStorage.
 * Não valida a assinatura — apenas lê os claims para uso na UI.
 */
export function getTokenPayload() {
  try {
    let token = localStorage.getItem('token');
    if (!token) return null;
    token = token.trim().replace(/^"|"$/g, '');
    if (token.startsWith('Token: ')) token = token.substring(7);
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch {
    return null;
  }
}

/**
 * Retorna o perfil do usuário logado (ex: "GERENTE", "ADMIN", "MATRIZ").
 */
export function getPerfilUsuario() {
  return getTokenPayload()?.perfil ?? null;
}

/**
 * Verifica se o usuário tem um dos perfis autorizados.
 */
export function temPerfil(...perfis) {
  const perfil = getPerfilUsuario();
  return perfis.includes(perfil);
}
