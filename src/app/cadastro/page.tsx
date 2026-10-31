"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Logo } from "@/components/ui/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SocraticChatPreview } from "@/components/features/SocraticChatPreview"
import { AboutMalbaModal } from "@/components/features/AboutMalbaModal"
import { 
  UserCheck, 
  Lock, 
  User, 
  Loader2, 
  AlertCircle,
  Clock,
  HelpCircle,
  Mail,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Eye,
  EyeOff
} from "lucide-react"
import { SERIES, CURSOS_CEFET } from "@/lib/curriculum"

const BLUE = "radial-gradient(circle at 30% 28%, #DBEAFE 0%, #60A5FA 40%, #2563EB 80%, #1E3A8A 100%)"
const SKY = "radial-gradient(circle at 32% 30%, #F0F9FF 0%, #38BDF8 45%, #0284C7 88%, #0369A1 100%)"
const INDIGO = "radial-gradient(circle at 30% 28%, #E0E7FF 0%, #818CF8 42%, #4F46E5 82%, #312E81 100%)"

// Esferas decorativas de fundo: tamanhos, profundidades e animações idênticas à tela de login
const BACKGROUND_SPHERES: { className: string; gradient: string }[] = [
  { className: "-top-16 -left-16 w-48 h-48 opacity-25 blur-2xl animate-float-slow", gradient: BLUE },
  { className: "hidden sm:block top-24 left-[4%] w-10 h-10 opacity-70 shadow-md shadow-blue-500/20 animate-float-reverse", gradient: SKY },
  { className: "hidden md:block top-[22%] left-[48%] w-6 h-6 opacity-60 animate-float-slow", gradient: INDIGO },
  { className: "hidden lg:block top-[38%] -right-20 w-56 h-56 opacity-30 blur-xl animate-float-reverse", gradient: INDIGO },
  { className: "hidden lg:block top-[62%] left-[3%] w-16 h-16 opacity-60 shadow-lg shadow-blue-500/20 animate-float-slow", gradient: BLUE },
  { className: "hidden md:block bottom-12 right-[14%] w-12 h-12 opacity-55 animate-float-reverse", gradient: SKY },
  { className: "-bottom-24 left-[20%] w-64 h-64 opacity-20 blur-3xl animate-float-slow", gradient: SKY },
]

export default function CadastroPage() {
  const router = useRouter()
  const [step, setStep] = useState<"form" | "verify">("form")
  const [role, setRole] = useState<"aluno" | "professor">("aluno")
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  
  // Campos comuns
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [matricula, setMatricula] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [resendSuccessMessage, setResendSuccessMessage] = useState("")
  const [devCode, setDevCode] = useState("")
  const [successPending, setSuccessPending] = useState(false)

  // Campos específicos de Aluno
  const [serie, setSerie] = useState<string>("1º Ano")
  const [isCefet, setIsCefet] = useState<boolean>(true)
  const [curso, setCurso] = useState<string>("Informática")
  const [consent, setConsent] = useState<boolean>(true)

  // Campos específicos de Professor (Turmas lecionadas: série x curso)
  const [selectedClasses, setSelectedClasses] = useState<Array<{ serie: string; curso: string }>>([])

  // Temporizador de reenvio do código (45 segundos)
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const toggleTeacherClass = (serieOption: string, cursoOption: string) => {
    const exists = selectedClasses.some(
      (c) => c.serie === serieOption && c.curso === cursoOption
    )
    if (exists) {
      setSelectedClasses(
        selectedClasses.filter(
          (c) => !(c.serie === serieOption && c.curso === cursoOption)
        )
      )
    } else {
      setSelectedClasses([...selectedClasses, { serie: serieOption, curso: cursoOption }])
    }
  }

  // Passo 1: Validação inicial e envio do código OTP por e-mail
  const handleStartVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const cleanName = name.trim()
    if (!cleanName || cleanName.length < 3) {
      setError("Por favor, preencha seu nome completo.")
      return
    }

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Por favor, informe um endereço de e-mail válido.")
      return
    }

    const cleanMatricula = matricula.trim()
    if (!cleanMatricula || cleanMatricula.length < 3) {
      setError("Por favor, informe uma matrícula ou identificador válido.")
      return
    }

    if (!password || password.length < 4) {
      setError("A senha deve ter no mínimo 4 caracteres.")
      return
    }

    if (role === "professor" && selectedClasses.length === 0) {
      setError("Selecione ao menos uma turma/curso que você leciona no CEFET-MG.")
      return
    }

    setIsSendingCode(true)

    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          name: cleanName,
          matricula: cleanMatricula,
          purpose: "registration",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Não foi possível enviar o código de verificação.")
      }

      if (data.devCode) {
        setDevCode(data.devCode)
      } else {
        setDevCode("")
      }

      setStep("verify")
      setCountdown(45)
      setResendSuccessMessage("")
    } catch (err: any) {
      setError(err.message || "Erro ao enviar código de verificação.")
    } finally {
      setIsSendingCode(false)
    }
  }

  // Reenviar código OTP com rate limiting
  const handleResendCode = async () => {
    if (countdown > 0 || isSendingCode) return
    setError("")
    setIsSendingCode(true)
    setResendSuccessMessage("")

    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          matricula: matricula.trim(),
          purpose: "registration",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Não foi possível reenviar o código.")
      }

      if (data.devCode) {
        setDevCode(data.devCode)
      } else {
        setDevCode("")
      }

      setCountdown(45)
      setResendSuccessMessage("Novo código enviado com sucesso!")
      setTimeout(() => setResendSuccessMessage(""), 5000)
    } catch (err: any) {
      setError(err.message || "Erro ao reenviar código.")
    } finally {
      setIsSendingCode(false)
    }
  }

  // Passo 2: Validação do código e conclusão do cadastro
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const cleanCode = code.trim()
    if (!cleanCode || cleanCode.length !== 6) {
      setError("Digite o código de verificação de 6 dígitos enviado ao seu e-mail.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          code: cleanCode,
          matricula: matricula.trim(),
          password,
          serie: role === "aluno" ? serie : undefined,
          curso: role === "aluno" ? (isCefet ? curso : "Externo / Outro") : undefined,
          isCefet: role === "aluno" ? isCefet : true,
          consent: role === "aluno" ? consent : true,
          teacherClasses: role === "professor" ? selectedClasses : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao realizar cadastro.")
      }

      if (data.pendingApproval) {
        setSuccessPending(true)
        setIsLoading(false)
        return
      }

      // Aluno: login automático e redirecionamento para o dashboard
      const loginRes = await signIn("credentials", {
        redirect: false,
        matricula: matricula.trim(),
        password,
      })

      if (loginRes?.error) {
        router.push("/login?registered=true")
      } else {
        window.location.href = "/"
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao finalizar o cadastro.")
      setIsLoading(false)
    }
  }

  if (successPending) {
    return (
      <div className="relative min-h-screen overflow-x-hidden lg:overflow-hidden bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-8 lg:p-12 font-sans selection:bg-blue-200">
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
          {BACKGROUND_SPHERES.map((s, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${s.className}`}
              style={{ background: s.gradient }}
            />
          ))}
        </div>

        <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200/80">
          <Logo size="md" showBadge={false} />
        </header>

        <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 text-center space-y-4 my-auto mx-auto">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Cadastro Docente Recebido!</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Seu e-mail institucional foi verificado e o cadastro docente no CEFET-MG foi registrado com sucesso. Por questões de segurança pedagógica e proteção aos dados dos discentes, sua conta passará pela <strong>ativação da administração</strong> antes de liberar o acesso.
          </p>
          <div className="pt-4 border-t border-slate-100">
            <Link href="/login">
              <Button variant="blue" className="w-full">
                Voltar à Página de Login
              </Button>
            </Link>
          </div>
        </div>

        <footer className="relative z-10 max-w-6xl mx-auto w-full pt-6 border-t border-slate-200/80 flex items-center justify-center text-center text-xs text-slate-500">
          <span>Centro Federal de Educação Tecnológica de Minas Gerais &bull; CEFET-MG</span>
        </footer>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden lg:overflow-hidden bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-8 lg:p-12 font-sans selection:bg-blue-200">
      
      {/* ================= CAMADA DECORATIVA: ESFERAS DE FUNDO ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
        {BACKGROUND_SPHERES.map((s, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${s.className}`}
            style={{ background: s.gradient }}
          />
        ))}
      </div>

      {/* ================= 1. CABEÇALHO INSTITUCIONAL SUPERIOR ================= */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200/80">
        <Logo size="md" showBadge={false} />
        <button
          type="button"
          onClick={() => setIsAboutOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 bg-white/70 border border-slate-200 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50/60 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Por que Malba?</span>
        </button>
      </header>

      {/* ================= 2. CORPO PRINCIPAL COM GRID DE 12 COLUNAS (IDÊNTICO AO LOGIN) ================= */}
      <main className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-8">
        
        {/* LADO ESQUERDO (7 COLUNAS): APRESENTAÇÃO INSTITUCIONAL & PREVIEW SOCRÁTICO */}
        <div className="lg:col-span-7 space-y-6">

          {/* TÍTULO PRINCIPAL (A FRASE HISTÓRICA DO PROJETO) */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Ensinando o aluno a{" "}
              <span className="whitespace-nowrap">
                <span className="relative inline-block text-blue-600">
                  pensar
                  {/* Sublinhado suave em traço feito à mão */}
                  <svg
                    className="pointer-events-none absolute left-0 -bottom-1.5 sm:-bottom-2 w-full h-2.5 sm:h-3 text-blue-300"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8.5 C 45 3, 95 3.5, 130 6 S 185 9, 197 4"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>,
              </span>{" "}
              não apenas a calcular.
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-light max-w-xl text-pretty">
              Em vez de dar a resposta, o Malba faz as perguntas certas até você chegar lá.
            </p>
          </div>

          {/* PRÉVIA DE DIÁLOGO SOCRÁTICO */}
          <div className="pt-2">
            <SocraticChatPreview />
          </div>

        </div>

        {/* LADO DIREITO (5 COLUNAS): CARD ELEGANTE DE CADASTRO COM 2 PASSOS */}
        <div className="lg:col-span-5 relative">
          
          {/* Esfera Grande em Gradiente Azul (Topo Direito do Card) */}
          <div
            className="pointer-events-none absolute -top-12 -right-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full shadow-2xl shadow-blue-600/25 opacity-90 animate-float-slow"
            style={{
              background: "radial-gradient(circle at 28% 28%, #93C5FD 0%, #3B82F6 38%, #1D4ED8 75%, #172554 100%)",
            }}
            aria-hidden="true"
          />

          {/* Esfera Média em Gradiente Azul/Ciano (Base Esquerda do Card) */}
          <div
            className="pointer-events-none absolute -bottom-10 -left-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-xl shadow-blue-500/20 opacity-85 animate-float-reverse"
            style={{
              background: "radial-gradient(circle at 32% 30%, #BAE6FD 0%, #38BDF8 35%, #2563EB 74%, #1E3A8A 100%)",
            }}
            aria-hidden="true"
          />

          {step === "form" ? (
            /* PASSO 1: PREENCHIMENTO DOS DADOS */
            <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/90 ring-1 ring-slate-200/75 shadow-2xl shadow-blue-950/10 space-y-3 relative z-10 animate-tab-fade">
              
              {/* Cabeçalho do Card */}
              <div>
                <h2 className="text-xl font-bold text-slate-900">Criar Conta no Malba</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Plataforma com IA Socrática orientada pelo Arco de Maguerez
                </p>
              </div>

              {/* Seletor de Perfil: Discente vs Docente */}
              <div className="relative grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
                <span
                  aria-hidden="true"
                  className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    role === "professor" ? "translate-x-full" : "translate-x-0"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => { setRole("aluno"); setError("") }}
                  className={`relative z-10 py-2 px-2.5 rounded-lg text-xs font-bold transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === "aluno" ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Discente
                </button>
                <button
                  type="button"
                  onClick={() => { setRole("professor"); setError("") }}
                  className={`relative z-10 py-2 px-2.5 rounded-lg text-xs font-bold transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === "professor" ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Docente
                </button>
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleStartVerification} className="space-y-2.5">
                {/* 1. Nome Completo (largura total) */}
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-slate-700">Nome Completo</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <Input
                      type="text"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 h-10 text-base sm:text-xs bg-slate-50 border-slate-200 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {/* 2. E-mail (largura total com recomendação) */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">E-mail</label>
                    <span className="text-[10px] text-blue-600 font-semibold">Recomendado CEFET</span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input
                      type="email"
                      placeholder={role === "aluno" ? "exemplo@aluno.cefetmg.br ou outro" : "exemplo@cefetmg.br ou outro"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-10 text-base sm:text-xs bg-slate-50 border-slate-200 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {/* 3. Matrícula (largura total) */}
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-slate-700">
                    {role === "aluno" ? "Matrícula do Aluno (ou CPF/Usuário)" : "Matrícula / SIAPE do Docente"}
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input
                      type="text"
                      placeholder={role === "aluno" ? "Ex: 2024100123" : "Ex: 1984210"}
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      className="pl-9 h-10 text-base sm:text-xs bg-slate-50 border-slate-200 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {/* 4. Senha (largura total) */}
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-slate-700">Senha de Acesso</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 4 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10 h-10 text-base sm:text-xs bg-slate-50 border-slate-200 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      tabIndex={-1}
                      title={showPassword ? "Ocultar senha" : "Ver senha"}
                      aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* ================= CAMPOS ESPECÍFICOS DO PERFIL ================= */}
                <div className="h-[170px] pt-2 border-t border-slate-100">
                  <div key={role} className="h-full animate-tab-fade">
                    {role === "aluno" ? (
                      <div className="h-full flex flex-col gap-1.5">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Série no Ensino Médio:
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {SERIES.map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setSerie(s)}
                                className={`py-1 rounded-lg border text-xs font-bold transition-colors text-center cursor-pointer ${
                                  serie === s
                                    ? "border-blue-600 bg-blue-50 text-blue-800 shadow-2xs"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Estudante do CEFET-MG?
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => setIsCefet(true)}
                              className={`py-1 px-2 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                                isCefet
                                  ? "border-blue-600 bg-blue-50 text-blue-800"
                                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              Sim, sou do CEFET-MG
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsCefet(false)}
                              className={`py-1 px-2 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                                !isCefet
                                  ? "border-blue-600 bg-blue-50 text-blue-800"
                                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              Não sou do CEFET-MG
                            </button>
                          </div>

                          <div
                            className={`transition-opacity duration-200 ${
                              isCefet ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                            aria-hidden={!isCefet}
                          >
                            <div className="relative">
                              <select
                                value={curso}
                                onChange={(e) => setCurso(e.target.value)}
                                tabIndex={isCefet ? 0 : -1}
                                className="w-full h-8 pl-2.5 pr-8 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer"
                              >
                                {CURSOS_CEFET.map((c) => (
                                  <option key={c} value={c}>
                                    Técnico em {c} (Divinópolis)
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        <label className="mt-auto flex items-start gap-1.5 cursor-pointer text-[10.5px] text-slate-600 leading-tight">
                          <input
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            required
                          />
                          <span>
                            Concordo com o acompanhamento pedagógico e pesquisa PIBIC.
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Turmas que você leciona no CEFET-MG:
                        </label>

                        <div className="grid grid-cols-3 gap-1">
                          {SERIES.map((s) => (
                            <div key={s} className="space-y-0.5">
                              <span className="text-[10px] font-bold text-blue-900 block text-center">
                                {s}
                              </span>
                              {CURSOS_CEFET.map((c) => {
                                const isSelected = selectedClasses.some(
                                  (tc) => tc.serie === s && tc.curso === c
                                )
                                return (
                                  <button
                                    key={`${s}-${c}`}
                                    type="button"
                                    onClick={() => toggleTeacherClass(s, c)}
                                    aria-pressed={isSelected}
                                    className={`w-full py-1 px-1 rounded-md border text-[10px] font-semibold transition-colors text-center truncate cursor-pointer ${
                                      isSelected
                                        ? "border-blue-600 bg-blue-600 text-white shadow-2xs"
                                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                                  >
                                    {c}
                                  </button>
                                )
                              })}
                            </div>
                          ))}
                        </div>

                        <p className="mt-auto text-[9.5px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200 leading-tight">
                          Contas de docentes passam por aprovação da administração antes do primeiro acesso.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="blue"
                  className="w-full h-10 rounded-xl font-bold text-xs shadow-xs mt-1 cursor-pointer"
                  disabled={isSendingCode}
                >
                  {isSendingCode ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Enviando código...
                    </>
                  ) : (
                    "Continuar para Verificação"
                  )}
                </Button>
              </form>

              <div className="text-center pt-1.5 border-t border-slate-100">
                <Link
                  href="/login"
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold block hover:underline"
                >
                  Já possui uma conta? Entrar
                </Link>
              </div>

            </div>
          ) : (
            /* PASSO 2: CONFIRMAÇÃO DO CÓDIGO OTP DE 6 DÍGITOS */
            <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/90 ring-1 ring-slate-200/75 shadow-2xl shadow-blue-950/10 space-y-4 relative z-10 animate-tab-fade">
              
              {/* Botão de Retorno ao Passo 1 */}
              <button
                type="button"
                onClick={() => { setStep("form"); setError("") }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar e editar dados</span>
              </button>

              {/* Cabeçalho da Etapa de Verificação */}
              <div className="text-center space-y-2 pt-1 pb-1">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-2xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                    Passo 2 de 2: Confirmação
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">Verifique seu E-mail</h2>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    Enviamos um código de segurança de 6 dígitos para:
                  </p>
                  <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold font-mono text-slate-800 break-all max-w-full">
                    {email}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {resendSuccessMessage && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{resendSuccessMessage}</span>
                </div>
              )}

              {devCode && (
                <div className="p-2.5 bg-blue-50/90 border border-blue-200 text-blue-900 rounded-xl text-xs space-y-0.5 text-center">
                  <span className="text-[9.5px] font-bold text-blue-600 uppercase tracking-wider block">
                    Modo de Teste Local (Sem RESEND_API_KEY no .env)
                  </span>
                  <p className="text-xs text-slate-700">
                    Código gerado:{" "}
                    <strong className="font-mono text-sm text-blue-700 font-extrabold">{devCode}</strong>
                  </p>
                </div>
              )}

              <form onSubmit={handleCompleteRegistration} className="space-y-4 pt-1">
                <div className="space-y-2 text-center">
                  <label className="text-xs font-bold text-slate-700 block">
                    Digite o código de 6 dígitos
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="h-12 text-center font-mono text-xl tracking-[0.35em] font-black bg-slate-50 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                    autoFocus
                    required
                  />
                  <p className="text-[11px] text-slate-500 leading-tight">
                    O código expira em 15 minutos. Verifique também a pasta de <strong>Spam / Lixo Eletrônico</strong>.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="blue"
                  className="w-full h-10 rounded-xl font-bold text-xs shadow-xs cursor-pointer"
                  disabled={isLoading || code.trim().length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" /> Validando código e criando conta...
                    </>
                  ) : role === "aluno" ? (
                    "Concluir Cadastro e Entrar"
                  ) : (
                    "Confirmar e Solicitar Cadastro Docente"
                  )}
                </Button>

                <div className="text-center pt-2 border-t border-slate-100">
                  {countdown > 0 ? (
                    <p className="text-xs text-slate-400 font-medium">
                      Reenviar novo código em <span className="font-bold text-slate-700">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isSendingCode}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1.5 cursor-pointer hover:underline disabled:opacity-50"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${isSendingCode ? "animate-spin" : ""}`} />
                      <span>{isSendingCode ? "Reenviando..." : "Não recebeu o código? Reenviar agora"}</span>
                    </button>
                  )}
                </div>
              </form>

            </div>
          )}

        </div>

      </main>

      {/* ================= 3. RODAPÉ INSTITUCIONAL (IDÊNTICO AO LOGIN) ================= */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full pt-6 border-t border-slate-200/80 flex items-center justify-center text-center text-xs text-slate-500">
        <span>Centro Federal de Educação Tecnológica de Minas Gerais &bull; CEFET-MG</span>
      </footer>

      {/* Modal Institucional "Sobre o Malba" */}
      <AboutMalbaModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

    </div>
  )
}
