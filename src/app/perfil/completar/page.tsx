"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Logo } from "@/components/ui/Logo"
import { Button } from "@/components/ui/button"
import { 
  GraduationCap, 
  School, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  LogOut,
  ArrowRight
} from "lucide-react"
import { SERIES, CURSOS_CEFET } from "@/lib/curriculum"

const BLUE = "radial-gradient(circle at 30% 28%, #DBEAFE 0%, #60A5FA 40%, #2563EB 80%, #1E3A8A 100%)"
const SKY = "radial-gradient(circle at 32% 30%, #F0F9FF 0%, #38BDF8 45%, #0284C7 88%, #0369A1 100%)"
const INDIGO = "radial-gradient(circle at 30% 28%, #E0E7FF 0%, #818CF8 42%, #4F46E5 82%, #312E81 100%)"

const BACKGROUND_SPHERES: { className: string; gradient: string }[] = [
  { className: "-top-16 -left-16 w-48 h-48 opacity-25 blur-2xl animate-float-slow", gradient: BLUE },
  { className: "hidden sm:block top-24 left-[4%] w-10 h-10 opacity-70 shadow-md shadow-blue-500/20 animate-float-reverse", gradient: SKY },
  { className: "hidden md:block top-[22%] left-[48%] w-6 h-6 opacity-60 animate-float-slow", gradient: INDIGO },
  { className: "hidden lg:block top-[38%] -right-20 w-56 h-56 opacity-30 blur-xl animate-float-reverse", gradient: INDIGO },
  { className: "hidden lg:block top-[62%] left-[3%] w-16 h-16 opacity-60 shadow-lg shadow-blue-500/20 animate-float-slow", gradient: BLUE },
  { className: "hidden md:block bottom-12 right-[14%] w-12 h-12 opacity-55 animate-float-reverse", gradient: SKY },
  { className: "-bottom-24 left-[20%] w-64 h-64 opacity-20 blur-3xl animate-float-slow", gradient: SKY },
]

export default function CompleteProfilePage() {
  const router = useRouter()
  const { data: session, update } = useSession()

  const [serie, setSerie] = useState<string>("1º Ano")
  const [isCefet, setIsCefet] = useState<boolean>(true)
  const [curso, setCurso] = useState<string>("Informática")
  const [consent, setConsent] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const finalCurso = isCefet ? curso : "Externo / Outro"

      const res = await fetch("/api/perfil/completar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serie,
          curso: finalCurso,
          isCefet,
          consent
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar informações.")
      }

      // 1. Grava cookie de liberação imediata para evitar qualquer redirecionamento pelo middleware
      document.cookie = `malba_serie_completed=true; path=/; max-age=31536000; SameSite=Lax`

      // 2. Atualiza a sessão cliente do NextAuth
      if (update) {
        try {
          await update({
            serie,
            curso: finalCurso,
            isCefet,
          })
        } catch (updErr) {
          console.warn("Aviso ao atualizar sessão cliente:", updErr)
        }
      }

      setIsSuccess(true)

      // 3. Redirecionamento limpo para o Dashboard
      setTimeout(() => {
        window.location.replace("/")
      }, 500)
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao atualizar seu perfil.")
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-[#F8FAFC] flex flex-col justify-center items-center z-50 p-4">
        {/* Camada decorativa: esferas de fundo idênticas à tela de login */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
          {BACKGROUND_SPHERES.map((s, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${s.className}`}
              style={{ background: s.gradient }}
            />
          ))}
        </div>

        <div className="relative z-10 bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-sm w-full space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Perfil Atualizado!</h2>
          <p className="text-xs text-slate-600">
            Liberando os conteúdos e videoaulas do <strong>{serie}</strong>...
          </p>
          <div className="pt-2 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] flex flex-col justify-center items-center p-4 z-40 overflow-y-auto font-sans selection:bg-blue-200">
      {/* Camada decorativa: esferas de fundo idênticas à tela de login */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
        {BACKGROUND_SPHERES.map((s, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${s.className}`}
            style={{ background: s.gradient }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 my-auto">
        <div className="flex flex-col items-center text-center space-y-2">
          <Logo />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mt-1">
            <Sparkles className="w-3.5 h-3.5" /> Atualização de Matrícula
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Complete seu Perfil Discente
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed font-light">
            Para personalizar sua trilha no <strong>Arco de Maguerez</strong> e liberar os conteúdos da sua série, confirme em qual ano você está estudando.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seleção da Série */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" /> Em qual série você está?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SERIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSerie(s)}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    serie === s
                      ? "border-blue-600 bg-blue-50 text-blue-800 shadow-xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 italic pt-0.5">
              {serie === "1º Ano" && "• Libera conteúdos e questões do 1º Ano do Ensino Médio."}
              {serie === "2º Ano" && "• Libera conteúdos e questões do 1º e 2º Ano (cumulativo)."}
              {serie === "3º Ano" && "• Libera o acervo completo dos 3 anos para revisão ENEM."}
            </p>
          </div>

          {/* Vínculo CEFET-MG */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <School className="w-4 h-4 text-blue-600" /> Você é aluno do CEFET-MG?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsCefet(true)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isCefet
                    ? "border-blue-600 bg-blue-50 text-blue-800 shadow-2xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Sim, sou do CEFET-MG
              </button>
              <button
                type="button"
                onClick={() => setIsCefet(false)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  !isCefet
                    ? "border-blue-600 bg-blue-50 text-blue-800 shadow-2xs"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Não sou do CEFET-MG
              </button>
            </div>
          </div>

          {/* Seleção do Curso Técnico se for CEFET */}
          {isCefet && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <label className="text-xs font-bold text-slate-700">
                Curso Técnico Integrado:
              </label>
              <select
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {CURSOS_CEFET.map((c) => (
                  <option key={c} value={c}>
                    Técnico em {c} (Divinópolis)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Consentimento Pedagógico e de Pesquisa */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 leading-snug">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <span>
                Concordo que minhas interações pedagógicas e resoluções de questões sejam acompanhadas pelos professores e pela pesquisa científica do PIBIC / CEFET-MG.
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="blue"
            className="w-full h-11 rounded-xl font-bold text-sm shadow-md mt-4 flex items-center justify-center gap-2 cursor-pointer"
            disabled={isLoading || !consent}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Salvando perfil...
              </>
            ) : (
              <span>Confirmar e Acessar Plataforma</span>
            )}
          </Button>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 font-medium py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Entrar com outra conta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
