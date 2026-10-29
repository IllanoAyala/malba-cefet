"use client"

import React, { useEffect, useState } from "react"
import { MessageCircleQuestion } from "lucide-react"

type ChatMessage = {
  from: "aluno" | "malba"
  text: string
  stage?: string
}

// Diálogo ilustrativo: a IA devolve perguntas em vez de entregar a resposta.
const MESSAGES: ChatMessage[] = [
  { from: "aluno", text: "Acho que a resposta é 12. Tá certo?" },
  {
    from: "malba",
    stage: "Observação",
    text: "Antes de conferir, me conta: qual informação do enunciado você usou primeiro?",
  },
  { from: "aluno", text: "A área total do terreno… mas esqueci de tirar a parte da piscina." },
  {
    from: "malba",
    stage: "Pontos-chave",
    text: "Ótima percepção! E o que muda no seu cálculo quando você desconta essa parte?",
  },
]

const STEP_MS = 1600
const RESTART_MS = 4500

/**
 * Prévia animada de um diálogo socrático para a tela de login.
 * As mensagens surgem em sequência (com indicador de digitação) e o ciclo reinicia.
 */
export function SocraticChatPreview() {
  const [visibleCount, setVisibleCount] = useState(1)

  useEffect(() => {
    const delay = visibleCount >= MESSAGES.length ? RESTART_MS : STEP_MS
    const timer = setTimeout(() => {
      setVisibleCount((n) => (n >= MESSAGES.length ? 1 : n + 1))
    }, delay)
    return () => clearTimeout(timer)
  }, [visibleCount])

  const isTyping = visibleCount < MESSAGES.length

  return (
    <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden max-w-xl">
      {/* Cabeçalho do "chat" */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-xs font-black shadow-xs">
          M
        </div>
        <div className="leading-tight">
          <p className="text-xs font-bold text-slate-900">Malba</p>
          <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Mediação socrática
          </p>
        </div>
        <span className="ml-auto text-[10px] font-semibold text-slate-500 flex items-center gap-1">
          <MessageCircleQuestion className="w-3 h-3" /> Exemplo de conversa
        </span>
      </div>

      {/* Mensagens — todas ficam sempre renderizadas (as ainda não reveladas ficam invisíveis)
          para que a altura do card nunca mude e o layout da página não "pule". */}
      <div className="px-4 py-2.5 space-y-2" aria-live="polite">
        {MESSAGES.map((msg, i) => {
          const isVisible = i < visibleCount
          const isNextTyping = isTyping && i === visibleCount
          return (
            <div
              key={`${i}-${msg.from}`}
              className={`relative flex ${msg.from === "aluno" ? "justify-end" : "justify-start"}`}
            >
              <div
                key={isVisible ? `on-${i}` : `off-${i}`}
                aria-hidden={!isVisible}
                className={`max-w-[82%] px-3 py-1.5 text-[13px] leading-snug rounded-2xl ${
                  isVisible ? "animate-fade-in-up" : "invisible"
                } ${
                  msg.from === "aluno"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-slate-100 text-slate-800 rounded-bl-md"
                }`}
              >
                {msg.stage && (
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-violet-600 mb-0.5">
                    Arco de Maguerez · {msg.stage}
                  </span>
                )}
                {msg.text}
              </div>

              {isNextTyping && (
                <div
                  className={`absolute top-0 ${msg.from === "aluno" ? "right-0" : "left-0"} flex gap-1 px-3 py-2.5 rounded-2xl bg-slate-100`}
                  aria-hidden="true"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Rodapé com os números da plataforma */}
      <div className="px-4 py-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap gap-x-2">
        <span><strong className="text-slate-700">180</strong> questões ENEM</span>
        <span className="text-slate-300">•</span>
        <span><strong className="text-slate-700">29</strong> tópicos BNCC</span>
        <span className="text-slate-300">•</span>
        <span><strong className="text-slate-700">5</strong> etapas de mediação</span>
      </div>
    </div>
  )
}
