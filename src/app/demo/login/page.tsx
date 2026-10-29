"use client"

import React, { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  User, 
  Lock, 
  Loader2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  HelpCircle,
  Compass,
  ArrowLeft,
  Bot
} from "lucide-react"
import { Logo } from "@/components/ui/Logo"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"

export default function DemoLoginPage() {
  const [selectedOption, setSelectedOption] = useState<"1" | "2" | "3">("1")
  const [matricula, setMatricula] = useState("aluno")
  const [password, setPassword] = useState("cefet123")
  const [roleType, setRoleType] = useState<"aluno" | "professor">("aluno")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleQuickFill = (role: "aluno" | "professor") => {
    setRoleType(role)
    if (role === "aluno") {
      setMatricula("aluno")
      setPassword("cefet123")
    } else {
      setMatricula("professor")
      setPassword("cefet123")
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const res = await signIn("credentials", {
      matricula,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Credenciais inválidas. Use aluno/cefet123 ou professor/cefet123")
      setIsLoading(false)
    } else {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("malba_session_id")
      }
      useAppStore.getState().setActiveUser(matricula)
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-200">
      
      {/* ================= BARRA SUPERIOR DE CONTROLE DO SHOWROOM ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <Link 
              href="/demo" 
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Showroom</span>
            </Link>
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Showroom &bull; Redesign da Tela de Login
              </span>
              <span className="text-[11px] text-slate-500">
                Alterne entre as 3 opções e teste os botões de 1 clique
              </span>
            </div>
          </div>

          {/* Seletor de Opção de Login */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedOption("1")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedOption === "1"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ✨ Opção 1: Nordic Floating Card
            </button>

            <button
              onClick={() => setSelectedOption("2")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedOption === "2"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              💬 Opção 2: Split Showcase Socrático
            </button>

            <button
              onClick={() => setSelectedOption("3")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedOption === "3"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🏛️ Opção 3: Portal CEFET Acadêmico
            </button>
          </div>

          <Link
            href="/demo/maguerez"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Arco de Maguerez &rarr;</span>
          </Link>

        </div>
      </header>

      {/* ================= CONTEÚDO DO PREVIEW ================= */}
      <main className="flex-1 flex flex-col justify-center">

        {/* ========================================================================= */}
        {/* OPÇÃO 1: NORDIC FLOATING CARD (MINIMALISTA, CALMO, CENTRALIZADO) */}
        {/* ========================================================================= */}
        {selectedOption === "1" && (
          <div className="min-h-[calc(100vh-65px)] bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            
            <div className="w-full max-w-[420px] bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 space-y-7 relative">
              
              {/* Logo Centralizado com Subtítulo */}
              <div className="text-center space-y-1.5">
                <Logo size="lg" subtitle="PIBIC BCE 2026" badgeText="CEFET" className="mx-auto" />
                <h1 className="text-xl font-bold text-slate-900 pt-3">Acesso à Plataforma</h1>
                <p className="text-xs text-slate-500">
                  Autenticação integrada com credenciais do SIGAA
                </p>
              </div>

              {/* Botões Rápidos de 1 Clique para Teste de Conta */}
              <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2 pt-0.5">
                  Preenchimento Rápido de Teste:
                </span>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickFill("aluno")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      roleType === "aluno"
                        ? "bg-white text-blue-700 shadow-xs border border-blue-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>🎓</span>
                    <span>Como Aluno</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill("professor")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      roleType === "professor"
                        ? "bg-white text-blue-700 shadow-xs border border-blue-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>👨‍🏫</span>
                    <span>Como Professor</span>
                  </button>
                </div>
              </div>

              {/* Formulário */}
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-200">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Matrícula / Usuário</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      placeholder="Ex: aluno ou 2023123456"
                      className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Senha</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all mt-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar na Plataforma"}
                </Button>
              </form>

              {/* Rodapé Acadêmico */}
              <div className="pt-2 text-center border-t border-slate-100">
                <span className="text-[11px] text-slate-400">
                  Pesquisa PIBIC CEFET-MG &bull; Campus V Divinópolis
                </span>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* OPÇÃO 2: SPLIT SHOWCASE SOCRÁTICO (DOIS LADOS COM DEMO DO DIÁLOGO) */}
        {/* ========================================================================= */}
        {selectedOption === "2" && (
          <div className="min-h-[calc(100vh-65px)] w-full lg:grid lg:grid-cols-12 bg-white animate-in fade-in duration-300">
            
            {/* Lado Esquerdo (5 Colunas): Formulário Limpo */}
            <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 lg:p-16">
              <div className="w-full max-w-[380px] space-y-7">
                
                <div>
                  <Logo size="md" subtitle="PIBIC BCE 2026" badgeText="CEFET" />
                  <h1 className="text-2xl font-black text-slate-900 mt-4 tracking-tight">Bem-vindo de volta!</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Entre com suas credenciais para continuar suas atividades.
                  </p>
                </div>

                {/* Preenchimento Rápido com 1 Clique */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Escolha o perfil para testar:
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickFill("aluno")}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                        roleType === "aluno"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                      }`}
                    >
                      🎓 Aluno
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill("professor")}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                        roleType === "professor"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                      }`}
                    >
                      👨‍🏫 Professor
                    </button>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-200">
                      {error}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Matrícula / CPF</label>
                    <input 
                      type="text"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Senha</label>
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-xs"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Acessar Malba"}
                  </Button>
                </form>

              </div>
            </div>

            {/* Lado Direito (7 Colunas): Showcase Socrático em Fundo Ardósia */}
            <div className="hidden lg:flex lg:col-span-7 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-12 lg:p-16 flex-col justify-between border-l border-slate-800">
              
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">PIBIC CEFET-MG &bull; BCE 2026</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-medium">
                  Metodologia Ativa
                </span>
              </div>

              {/* Balão do Diálogo Socrático Simulado */}
              <div className="max-w-lg space-y-6 my-auto">
                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                    Ensinando o aluno a pensar, não apenas a calcular.
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed font-light">
                    Veja como o Malba responde quando um aluno comete um equívoco:
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3.5 backdrop-blur-sm shadow-xl">
                  {/* Mensagem Aluno */}
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                      A
                    </span>
                    <div className="bg-white/10 rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs leading-relaxed">
                      "Achei que o valor fixo da conta era multiplicado pelos dias do mês."
                    </div>
                  </div>

                  {/* Resposta Socrática Malba */}
                  <div className="flex items-start gap-2.5 justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-3.5 py-2 text-xs leading-relaxed max-w-[85%]">
                      "Boa reflexão! Mas se o termo é 'fixo', o valor total mudaria se a casa ficasse fechada o mês todo?"
                    </div>
                    <span className="w-6 h-6 rounded-full bg-blue-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                      M
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Erradicação da passividade
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> Arco de Maguerez
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Dr. Emerson Costa (Orientador) &bull; Illano Ayala (Orientando)
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* OPÇÃO 3: PORTAL INSTITUCIONAL CEFET-MG (ACADÊMICO PRECISE) */}
        {/* ========================================================================= */}
        {selectedOption === "3" && (
          <div className="min-h-[calc(100vh-65px)] bg-slate-50 flex flex-col justify-between p-6 sm:p-12 animate-in fade-in duration-300">
            
            {/* Header Acadêmico */}
            <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200">
              <Logo size="md" subtitle="Campus V Divinópolis" badgeText="CEFET-MG" />
            </div>

            {/* Conteúdo Central */}
            <div className="max-w-5xl mx-auto w-full grid md:grid-cols-12 gap-10 items-center my-auto py-8">
              
              {/* Esquerda: Informações Institucionais do Projeto */}
              <div className="md:col-span-7 space-y-5">
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                  Programa Institucional de Bolsas de Iniciação Científica (PIBIC)
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  Ensinando o aluno a pensar, não apenas a calcular.
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Plataforma pedagógica desenvolvida no CEFET-MG com IA Socrática. Utilizamos as 5 etapas do <strong>Arco de Maguerez</strong> para erradicar a passividade cognitiva e conduzir o estudante a construir a solução com autonomia.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Incidência ENEM</span>
                    <p className="text-base font-bold text-slate-900 mt-0.5">90 Questões Mapeadas</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Matriz BNCC</span>
                    <p className="text-base font-bold text-slate-900 mt-0.5">29 Tópicos Curriculares</p>
                  </div>
                </div>
              </div>

              {/* Direita: Card de Autenticação */}
              <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Acesso ao SIGAA</h3>
                  <p className="text-xs text-slate-500">Credenciais acadêmicas autorizadas</p>
                </div>

                {/* Preenchimento Rápido */}
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button 
                    type="button" 
                    onClick={() => handleQuickFill("aluno")}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      roleType === "aluno" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"
                    }`}
                  >
                    Aluno
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleQuickFill("professor")}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      roleType === "professor" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"
                    }`}
                  >
                    Professor
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Matrícula</label>
                    <input 
                      type="text" 
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Senha</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl">
                    Entrar no Sistema &rarr;
                  </Button>
                </form>
              </div>

            </div>

            {/* Footer Acadêmico */}
            <div className="max-w-5xl mx-auto w-full pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
              Centro Federal de Educação Tecnológica de Minas Gerais &bull; CEFET-MG &bull; 2026
            </div>

          </div>
        )}

      </main>

    </div>
  )
}
