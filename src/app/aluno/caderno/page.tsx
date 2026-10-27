"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import {
  STUDY_MODULES,
  OBMEP_APOSTILAS,
  GTMAT_PORTAL_URL,
  OBMEP_PORTAL_URL,
  getModuleForTopic,
} from "@/data/studyMaterials"
import {
  BookMarked,
  RotateCcw,
  CheckCircle2,
  PlayCircle,
  Landmark,
  Award,
  FileText,
  ExternalLink,
  ArrowRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function CadernoPage() {
  const router = useRouter()
  const { solvedQuestionIds, reviewQuestionIds, syncQuestionProgress } = useAppStore()
  const [questions, setQuestions] = useState<any[]>([])

  useEffect(() => {
    const sessionId =
      typeof window !== "undefined" ? window.sessionStorage.getItem("malba_session_id") || "" : ""

    Promise.all([
      fetch("/api/questions").then((r) => r.json()),
      fetch(`/api/telemetry?sessionId=${encodeURIComponent(sessionId)}`).then((r) => r.json()),
    ])
      .then(([qData, tData]) => {
        if (Array.isArray(qData)) setQuestions(qData)
        if (tData && Array.isArray(tData.solvedQuestionIds)) {
          syncQuestionProgress(tData.solvedQuestionIds, tData.reviewQuestionIds || [])
        }
      })
      .catch((e) => console.error(e))
  }, [])

  const reviewQuestions = questions.filter((q) => reviewQuestionIds.includes(String(q.id)))
  const solvedQuestions = questions.filter((q) => solvedQuestionIds.includes(String(q.id)))

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
            <BookMarked className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
              Caderno de Estudos &bull; Matemática Geral
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Caderno de Revisão &amp; Fontes Oficiais
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Revise os temas em que você teve dúvida com apoio direto das unidades didáticas e videoaulas do <strong>GTMAT CEFET-MG</strong> e das apostilas do <strong>PIC / OBMEP</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
              Para Revisar
            </span>
            <span className="text-xl font-black text-white">{reviewQuestions.length}</span>
          </div>
          <div className="h-8 w-px bg-white/15" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">
              Dominadas
            </span>
            <span className="text-xl font-black text-emerald-400">{solvedQuestions.length}</span>
          </div>
        </div>
      </div>

      {/* Questões Pendentes de Revisão */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-600" />
            <span>Questões Marcadas para Revisão ({reviewQuestions.length})</span>
          </h2>
          <Button variant="outline" size="sm" onClick={() => router.push("/materias")}>
            Abrir Trilhas Teóricas
          </Button>
        </div>

        {reviewQuestions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              Nenhuma questão pendente de revisão no momento!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Quando você errar uma questão e acionar o Tutor Socrático, ela aparecerá automaticamente aqui com o material do GTMAT CEFET-MG e da OBMEP correspondente.
            </p>
            <Button variant="blue" size="sm" onClick={() => router.push("/explorador")}>
              Praticar Questões
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewQuestions.map((q) => {
              const mod = getModuleForTopic(q.topico_bncc)
              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white border border-amber-200 shadow-2xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className="bg-amber-50 text-amber-800 border border-amber-200">
                        {q.ano_ensino_medio} &bull; {q.topico_bncc}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-400">Questão #{q.id}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3">{q.enunciado}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <a
                        href={mod.gtmatUnitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold inline-flex items-center gap-1 hover:bg-blue-100"
                      >
                        <Landmark className="w-3 h-3" />
                        <span>GTMAT: {mod.gtmatUnitTitle}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <a
                        href={mod.obmepApostila.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold inline-flex items-center gap-1 hover:bg-amber-100"
                      >
                        <Award className="w-3 h-3" />
                        <span>{mod.obmepApostila.number} (PDF)</span>
                      </a>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => router.push(`/materias?module=${mod.id}`)}
                        className="text-xs font-bold text-slate-600 hover:text-blue-600 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-red-500" />
                        <span>Ver Videoaula GTMAT</span>
                      </button>
                      <Button
                        size="sm"
                        variant="blue"
                        className="text-xs h-8"
                        onClick={() => router.push(`/workspace/${q.id}`)}
                      >
                        <span>Tentar Novamente</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Guia Rápido das Fontes Oficiais de Estudo */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Landmark className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Unidades GTMAT CEFET-MG</h3>
            </div>
            <a
              href={GTMAT_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <span>Portal Oficial</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-slate-500">
            Material didático elaborado pelos professores do Departamento de Matemática do CEFET-MG com Textos <strong>[CONT]</strong>, Videoaulas <strong>[VAC]</strong>, Exercícios <strong>[EXE]</strong> e Resoluções <strong>[EXRES]</strong>.
          </p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {STUDY_MODULES.map((m) => (
              <div
                key={m.id}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-blue-600 uppercase block">
                    {m.year} &bull; {m.title}
                  </span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {m.gtmatUnitTitle}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => router.push(`/materias?module=${m.id}`)}
                    className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:text-blue-600 font-bold text-[11px] cursor-pointer"
                  >
                    Vídeo
                  </button>
                  <a
                    href={m.gtmatUnitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded-md bg-blue-600 text-white font-bold text-[11px] inline-flex items-center gap-1"
                  >
                    <span>Abrir</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900">Apostilas do PIC / OBMEP</h3>
            </div>
            <a
              href={OBMEP_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-amber-700 hover:underline inline-flex items-center gap-1"
            >
              <span>Site da OBMEP</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-slate-500">
            Coleção oficial do Programa de Iniciação Científica Jr. da OBMEP (IMPA/SBM) em PDF gratuito para aprofundamento conceitual e resolução de problemas.
          </p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {OBMEP_APOSTILAS.map((ap) => (
              <a
                key={ap.number}
                href={ap.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200/70 flex items-center justify-between gap-2 text-xs transition-colors"
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">
                    {ap.number} &bull; {ap.authors}
                  </span>
                  <span className="font-semibold text-slate-900 truncate block">{ap.title}</span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-amber-600 text-white font-bold text-[11px] shrink-0 inline-flex items-center gap-1">
                  <FileText className="w-3 h-3" /> PDF
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
