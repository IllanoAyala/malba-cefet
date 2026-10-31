import { Question } from "@prisma/client"

/**
 * Retorna a string da data no fuso horário do Brasil (America/Sao_Paulo) no formato YYYY-MM-DD.
 * Essencial para evitar discrepâncias de fuso horário UTC (especialmente entre 21h e 23h59).
 */
export function getBrazilDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

/**
 * Retorna a data anterior (D - 1) no formato YYYY-MM-DD.
 */
export function getPreviousDateString(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z")
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

export interface DailyMissionItem {
  label: string
  badge: string
  question: any
}

/**
 * Seleciona deterministicamente as 3 questões da "Missão do Dia" para uma determinada data.
 * A trilha pedagógica é composta por:
 * 1. Aquecimento: 1 questão do 1º Ano
 * 2. Exploração: 1 questão do 2º Ano
 * 3. Desafio: 1 questão do 3º Ano (ou da série mais avançada disponível)
 */
export function getDailyMissionForDate(
  questions: any[],
  dateStr: string
): DailyMissionItem[] {
  if (!questions || questions.length === 0) return []

  let seed = 0
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed * 31 + dateStr.charCodeAt(i)) % 100000
  }

  const ano1 = questions.filter((q) => q.ano_ensino_medio === "1º Ano")
  const ano2 = questions.filter((q) => q.ano_ensino_medio === "2º Ano")
  const ano3 = questions.filter((q) => q.ano_ensino_medio === "3º Ano")

  const pickDeterministic = (pool: any[], offset: number) => {
    if (pool.length === 0) return questions[offset % questions.length]
    return pool[(seed + offset) % pool.length]
  }

  const q1 = pickDeterministic(ano1.length > 0 ? ano1 : questions, 1)
  const q2Pool = (ano2.length > 0 ? ano2 : questions).filter((q) => q.id !== q1?.id)
  const q2 = pickDeterministic(q2Pool, 7)
  const q3Pool = (ano3.length > 0 ? ano3 : questions).filter(
    (q) => q.id !== q1?.id && q.id !== q2?.id
  )
  const q3 = pickDeterministic(q3Pool, 13)

  return [
    {
      label: "1. Aquecimento",
      badge: q1?.ano_ensino_medio || "1º Ano",
      question: q1,
    },
    {
      label: "2. Exploração",
      badge: q2?.ano_ensino_medio || "2º Ano",
      question: q2,
    },
    {
      label: "3. Desafio",
      badge: q3?.ano_ensino_medio || "3º Ano",
      question: q3,
    },
  ].filter((item) => Boolean(item.question))
}

/**
 * Verifica se a missão diária de uma data específica foi 100% concluída.
 * Regra da Opção 2: o dia só é validado para a ofensiva se o estudante
 * resolver as 3 questões da trilha diária.
 */
export function isMissionCompleted(
  missionItems: DailyMissionItem[],
  solvedIds: string[] | Set<string>
): boolean {
  if (!missionItems || missionItems.length === 0) return false
  const solvedSet = solvedIds instanceof Set ? solvedIds : new Set(solvedIds)
  return missionItems.every((item) => item.question?.id && solvedSet.has(String(item.question.id)))
}
