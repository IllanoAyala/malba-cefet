export const SERIES = ["1º Ano", "2º Ano", "3º Ano"] as const
export type SerieType = (typeof SERIES)[number]

export const CURSOS_CEFET = [
  "Informática",
  "Mecatrônica",
  "Produção de Moda",
] as const
export type CursoCefetType = (typeof CURSOS_CEFET)[number]

export const CURSO_EXTERNO = "Não sou aluno do CEFET-MG"

/**
 * Retorna a lista de séries cujo conteúdo é acessível para o usuário atual.
 * Regra pedagógica de liberação cumulativa:
 * - 1º Ano: acessa apenas 1º Ano
 * - 2º Ano: acessa 1º e 2º Ano
 * - 3º Ano: acessa 1º, 2º e 3º Ano
 * - Docentes e Administradores: acesso irrestrito aos 3 anos.
 */
export function getAllowedSeries(role?: string | null, serie?: string | null): string[] {
  if (role === "admin" || role === "professor") {
    return [...SERIES]
  }

  if (serie === "1º Ano") {
    return ["1º Ano"]
  }

  if (serie === "2º Ano") {
    return ["1º Ano", "2º Ano"]
  }

  if (serie === "3º Ano") {
    return ["1º Ano", "2º Ano", "3º Ano"]
  }

  // Se não tem série especificada (ex: visitante anônimo ou perfil incompleto),
  // libera o 1º Ano por padrão
  return ["1º Ano"]
}

/**
 * Verifica se um conteúdo específico (de uma determinada série) está desbloqueado para o perfil do usuário.
 */
export function isContentUnlocked(
  contentYear: string,
  role?: string | null,
  serie?: string | null
): boolean {
  if (role === "admin" || role === "professor") return true
  const allowed = getAllowedSeries(role, serie)
  return allowed.includes(contentYear)
}
