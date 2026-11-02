"use client"

import React, { useState } from "react"
import {
  X,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Calculator,
  Target,
  Code,
  Sparkles,
  FileText,
  Flag,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReportAiModalProps {
  isOpen: boolean
  onClose: () => void
  messageContent: string
  userPrompt?: string | null
  questionId?: string | null
  socraticStep?: number | null
}

const REPORT_REASONS = [
  {
    id: "math_error",
    title: "Erro Matemático / Cálculo",
    desc: "Cálculo incorreto, propriedade matemática errada ou gabarito divergente.",
    icon: Calculator,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    id: "gave_direct_answer",
    title: "Deu a Resposta Direta",
    desc: "Violou o método socrático e entregou a alternativa ou a conta pronta.",
    icon: Target,
    color: "text-rose-600 bg-rose-50 border-rose-200",
  },
  {
    id: "katex_formatting",
    title: "Formatação / KaTeX Quebrado",
    desc: "Fórmula matemática desconfigurada, código cru aparecendo ou erro visual.",
    icon: Code,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    id: "hallucination",
    title: "Alucinação / Confuso",
    desc: "Afirmação incoerente, fuga do enunciado ou raciocínio sem sentido.",
    icon: Sparkles,
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
  {
    id: "other",
    title: "Outro Motivo",
    desc: "Outro tipo de problema pedagógico ou técnico na resposta.",
    icon: FileText,
    color: "text-slate-600 bg-slate-50 border-slate-200",
  },
]

export function ReportAiModal({
  isOpen,
  onClose,
  messageContent,
  userPrompt,
  questionId,
  socraticStep,
}: ReportAiModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("math_error")
  const [details, setDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg("")

    try {
      const res = await fetch("/api/chat/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          messageContent,
          userPrompt,
          reason: selectedReason,
          details,
          socraticStep,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Erro ao registrar relato.")
      }

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setDetails("")
        setSelectedReason("math_error")
        onClose()
      }, 1800)
    } catch (err: any) {
      setErrorMsg(err.message || "Falha na comunicação com o servidor.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Trecho curto para citação visual
  const snippet =
    messageContent.length > 200
      ? messageContent.slice(0, 200).trim() + "..."
      : messageContent

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabeçalho */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Reportar Resposta do Tutor</h3>
              <p className="text-[11px] text-slate-500">Ajude os docentes e pesquisadores a aprimorarem a IA</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-5 space-y-4">
          {success ? (
            <div className="p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">Relato Registrado com Sucesso!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Muito obrigado! Seu apontamento foi salvo no banco de dados e será analisado pela equipe de curadoria pedagógica do CEFET-MG.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Citação da Mensagem */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Trecho da Mensagem Avaliada:
                </span>
                <p className="text-xs text-slate-700 italic line-clamp-3 leading-relaxed">
                  "{snippet}"
                </p>
              </div>

              {/* Seleção do Motivo */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Qual é o principal problema com esta resposta?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {REPORT_REASONS.map((reason) => {
                    const Icon = reason.icon
                    const isSelected = selectedReason === reason.id
                    return (
                      <button
                        key={reason.id}
                        type="button"
                        onClick={() => setSelectedReason(reason.id)}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? "bg-blue-50/80 border-blue-500 ring-2 ring-blue-100 shadow-2xs"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${reason.color}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 leading-tight">
                            {reason.title}
                          </p>
                          <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                            {reason.desc}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Detalhes Opcionais */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Comentário Adicional <span className="font-normal text-slate-400">(opcional)</span>
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Ex: O cálculo deu 12 mas a fórmula correta indicava 15, ou a IA deu a dica 5 logo no início..."
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
                  maxLength={600}
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 px-1">
                  <span>Limite de 600 caracteres</span>
                  <span>{details.length}/600</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Rodapé de Ações */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Flag className="w-3.5 h-3.5" />
                      <span>Enviar Relato</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
