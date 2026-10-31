"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  ShieldAlert,
  Users,
  FileSpreadsheet,
  Download,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  KeyRound,
  Search,
  RefreshCw,
  Loader2,
  UserCheck,
  GraduationCap,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Zap,
  BookOpen,
  SlidersHorizontal,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuestionReviewTab } from "@/components/admin/QuestionReviewTab"
import { TabManagementTab } from "@/components/admin/TabManagementTab"
import { EditUserModal } from "@/components/admin/EditUserModal"

interface MonitoredUser {
  id: string
  matricula: string
  name: string
  email?: string | null
  emailVerified?: string | null
  role: "aluno" | "professor" | "admin"
  status?: string
  serie?: string | null
  curso?: string | null
  isCefet?: boolean
  teacherClasses?: Array<{ serie: string; curso: string }>
  createdAt: string
  questionsSolved: number
  correctAnswers: number
  accuracyRate: number
  totalHints: number
  avgTimeSeconds: number
  lastActiveAt: string | null
}

interface TelemetryEntry {
  id: string
  matricula: string
  userName: string
  sessionId: string
  topico: string
  anoEnem: number | null
  timeSeconds: number
  hintsRequested: number
  isCorrect: boolean
  aiModeUsed: string
  createdAt: string
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [adminTab, setAdminTab] = useState<"monitoring" | "questions" | "tabs">("monitoring")
  const [summary, setSummary] = useState<any>(null)
  const [tokenMetrics, setTokenMetrics] = useState<any>(null)
  const [users, setUsers] = useState<MonitoredUser[]>([])
  const [recentLogs, setRecentLogs] = useState<TelemetryEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "aluno" | "professor" | "admin">("all")

  const formatTimeRemaining = (isoTarget?: string | null) => {
    if (!isoTarget) return "Cota 100% renovada"
    const diffMs = new Date(isoTarget).getTime() - Date.now()
    if (diffMs <= 0) return "Renovando agora"
    const totalMinutes = Math.ceil(diffMs / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours > 0) {
      return `em ${hours}h ${minutes}min`
    }
    return `em ${minutes} min`
  }

  // Criação de nova conta
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newMatricula, setNewMatricula] = useState("")
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newRole, setNewRole] = useState<"aluno" | "professor" | "admin">("aluno")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redefinição rápida de senha
  const [resetUserId, setResetUserId] = useState<string | null>(null)
  const [resetPasswordValue, setResetPasswordValue] = useState("")

  // Modal de edição detalhada de usuário
  const [editingUser, setEditingUser] = useState<MonitoredUser | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleOpenEditUser = (user: MonitoredUser) => {
    setEditingUser(user)
    setIsEditModalOpen(true)
  }

  const handleEditUserSuccess = async (updatedUser: any) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
    )
    await fetchAdminData()
  }

  const userRole = (session?.user as any)?.role

  const fetchAdminData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin")
      if (res.status === 403) {
        router.push("/")
        return
      }
      const data = await res.json()
      if (data.users) {
        setSummary(data.summary)
        setTokenMetrics(data.tokenMetrics || null)
        setUsers(data.users)
        setRecentLogs(data.recentLogs || [])
      }
    } catch (err) {
      console.error("Erro ao carregar painel admin:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      if (userRole !== "admin") {
        router.push("/")
      } else {
        fetchAdminData()
      }
    }
  }, [status, userRole])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricula: newMatricula,
          name: newName,
          email: newEmail.trim() ? newEmail.trim() : undefined,
          password: newPassword,
          role: newRole,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || "Não foi possível criar a conta.")
      } else {
        setNewMatricula("")
        setNewName("")
        setNewEmail("")
        setNewPassword("")
        setNewRole("aluno")
        setIsCreateOpen(false)
        await fetchAdminData()
      }
    } catch (err) {
      setFormError("Erro de conexão ao criar conta.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRoleChange = async (userId: string, updatedRole: "aluno" | "professor" | "admin") => {
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: updatedRole }),
      })
      if (res.ok) {
        await fetchAdminData()
      }
    } catch (err) {
      console.error("Erro ao alterar perfil:", err)
    }
  }

  const handleApproveUser = async (userId: string) => {
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, status: "active" }),
      })
      if (res.ok) {
        await fetchAdminData()
      }
    } catch (err) {
      console.error("Erro ao aprovar docente:", err)
    }
  }

  const handleResetPassword = async (userId: string) => {
    if (!resetPasswordValue.trim()) return
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, newPassword: resetPasswordValue }),
      })
      if (res.ok) {
        setResetUserId(null)
        setResetPasswordValue("")
      }
    } catch (err) {
      console.error("Erro ao redefinir senha:", err)
    }
  }

  const handleDeleteUser = async (user: MonitoredUser) => {
    if (!window.confirm(`Tem certeza que deseja remover a conta "${user.name}" (${user.matricula})?`)) {
      return
    }
    try {
      const res = await fetch(`/api/admin?id=${user.id}`, { method: "DELETE" })
      if (res.ok) {
        await fetchAdminData()
      } else {
        const err = await res.json()
        alert(err.error || "Erro ao excluir conta.")
      }
    } catch (err) {
      console.error("Erro ao excluir usuário:", err)
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.matricula.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  if (status === "loading" || isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-16">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Carregando Painel de Monitoramento Admin...</p>
      </div>
    )
  }

  if (userRole !== "admin") {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-3">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Acesso Restrito</h2>
        <p className="text-xs text-slate-500">Esta área é exclusiva para a administração da pesquisa.</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-300 font-sans">
      
      {/* ================= 1. CABEÇALHO DO PAINEL ADMIN & DOWNLOADS DA PESQUISA ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Administração da Pesquisa &bull; PIBIC BCE 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Monitoramento de Contas & Telemetria
          </h1>
          <p className="text-xs text-slate-500">
            <strong>Orientando:</strong> Illano Ayala &bull; <strong>Orientador:</strong> Prof. Dr. Emerson Costa &bull; CEFET-MG Campus V Divinópolis
          </p>
        </div>

        {/* Botões de Download de Dados para Pesquisa */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Atualizar dados agora"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar</span>
          </button>

          <a
            href="/api/telemetry/export?type=users"
            download
            className="h-10 px-4 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Contas (CSV)</span>
          </a>

          <a
            href="/api/telemetry/export?type=telemetry"
            download
            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Telemetria CSV</span>
          </a>
        </div>
      </div>

      {/* ================= SELETOR DE ABAS PRINCIPAIS DO PAINEL ADMIN ================= */}
      <div className="flex border-b border-slate-200 gap-2 pt-1">
        <button
          type="button"
          onClick={() => setAdminTab("monitoring")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            adminTab === "monitoring"
              ? "border-blue-600 text-blue-600 bg-blue-50/30 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Monitoramento &amp; Telemetria</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab("questions")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            adminTab === "questions"
              ? "border-blue-600 text-blue-600 bg-blue-50/30 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Banco de Questões &amp; Revisão</span>
          <span className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            180 Questões
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab("tabs")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            adminTab === "tabs"
              ? "border-blue-600 text-blue-600 bg-blue-50/30 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Visibilidade das Abas</span>
          <span className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            Menu Usuários
          </span>
        </button>
      </div>

      {adminTab === "questions" ? (
        <QuestionReviewTab />
      ) : adminTab === "tabs" ? (
        <TabManagementTab />
      ) : (
        <>
      {/* ================= 2. KPIS DE MONITORAMENTO GLOBAL ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contas Cadastradas</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{summary?.totalUsers || 0}</p>
          <p className="text-[11px] text-slate-500">
            {summary?.totalStudents || 0} discentes &bull; {summary?.totalProfessors || 0} docentes &bull; {summary?.totalAdmins || 0} admin
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Interações Socráticas</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{summary?.totalLogs || 0}</p>
          <p className="text-[11px] text-slate-500">
            {summary?.totalFeedbacks || 0} avaliações qualitativas registradas
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Taxa de Acerto Geral</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{summary?.overallAccuracy ?? 0}%</p>
          <p className="text-[11px] text-slate-500">
            Nas resoluções guiadas pelo Malba
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Média de Dicas / Questão</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{summary?.avgHints ?? 0}</p>
          <p className="text-[11px] text-slate-500">
            Intervenções do Arco de Maguerez
          </p>
        </div>
      </div>

      {/* ================= 2.5 MONITORAMENTO DE TOKENS & COTA DA IA (EXCLUSIVO ADMIN) ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Consumo de Tokens &amp; Cota da IA (Exclusivo Admin)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Os limites de IA (Google Gemini 1.000.000 TPM e Groq) renovam automaticamente: <strong>a cada 60 segundos</strong> para taxa por minuto (TPM) e <strong>em janela móvel de 24 horas</strong> para cota diária (TPD / RPD).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Modelo Ativo: {tokenMetrics?.activeModel || "gemini-3.5-flash-lite"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
              <Clock className="w-3 h-3" />
              <span>
                {tokenMetrics?.tokensUsed24h > 0
                  ? `Próxima liberação ${formatTimeRemaining(tokenMetrics?.nextTokenReleaseAt)}`
                  : "Cota diária 100% livre"}
              </span>
            </span>
          </div>
        </div>

        {/* Cards de Tokens Usados vs Quanto Ainda Tenho */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Cota Diária de Tokens (24h) */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Cota Diária de Tokens (Ciclo 24h)
              </span>
              <span className="text-[11px] font-bold text-blue-600">
                Reset automático (24h)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Tokens Usados (24h)
                </span>
                <p className="text-lg font-black text-slate-900 mt-0.5">
                  {(tokenMetrics?.tokensUsed24h ?? 0).toLocaleString("pt-BR")}
                </p>
                <span className="text-[10px] text-slate-400">
                  {(tokenMetrics?.promptTokens24h ?? 0).toLocaleString("pt-BR")} entrada &bull;{" "}
                  {(tokenMetrics?.completionTokens24h ?? 0).toLocaleString("pt-BR")} saída
                </span>
              </div>

              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/70">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                  Quanto Ainda Tenho
                </span>
                <p className="text-lg font-black text-emerald-700 mt-0.5">
                  {(tokenMetrics?.tokensRemaining24h ?? 100000).toLocaleString("pt-BR")}
                </p>
                <span className="text-[10px] text-emerald-600 font-medium">
                  de {(tokenMetrics?.dailyTokenLimit ?? 100000).toLocaleString("pt-BR")} TPD
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      ((tokenMetrics?.tokensUsed24h ?? 0) / (tokenMetrics?.dailyTokenLimit ?? 100000)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>
                  Uso no ciclo:{" "}
                  {(
                    ((tokenMetrics?.tokensUsed24h ?? 0) / (tokenMetrics?.dailyTokenLimit ?? 100000)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
                <span>
                  {tokenMetrics?.fullDailyResetAt
                    ? `Zera 100% ${formatTimeRemaining(tokenMetrics.fullDailyResetAt)}`
                    : "Totalmente disponível"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Limite por Minuto (TPM - Reseta a cada 60s) */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Velocidade por Minuto (TPM)
                </span>
                <span className="text-[11px] font-bold text-emerald-600">
                  Reseta a cada 60s
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Usados no Minuto
                  </span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">
                    {(tokenMetrics?.tokensUsed1m ?? 0).toLocaleString("pt-BR")}
                  </p>
                  <span className="text-[10px] text-slate-400">Últimos 60 segundos</span>
                </div>

                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200/70">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block">
                    Disponível Agora
                  </span>
                  <p className="text-lg font-black text-blue-700 mt-0.5">
                    {(tokenMetrics?.tokensRemaining1m ?? 8000).toLocaleString("pt-BR")}
                  </p>
                  <span className="text-[10px] text-blue-600 font-medium">
                    de {(tokenMetrics?.minuteTokenLimit ?? 8000).toLocaleString("pt-BR")} TPM
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      ((tokenMetrics?.tokensUsed1m ?? 0) / (tokenMetrics?.minuteTokenLimit ?? 8000)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>
                  {tokenMetrics?.secondsUntilMinuteReset > 0
                    ? `Renova em ${tokenMetrics.secondsUntilMinuteReset}s`
                    : "Janela de 1 min 100% livre"}
                </span>
                <span>
                  Limite: {(tokenMetrics?.minuteTokenLimit ?? 1000000).toLocaleString("pt-BR")} tokens/min
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Requisições Diárias (RPD) & Histórico */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Requisições Diárias (RPD) &amp; Total
                </span>
                <span className="text-[11px] font-bold text-indigo-600">
                  {(tokenMetrics?.requestsRemaining24h ?? 1500).toLocaleString("pt-BR")} restantes hoje
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Chamadas Hoje (24h)
                  </span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">
                    {(tokenMetrics?.requestsUsed24h ?? 0).toLocaleString("pt-BR")}{" "}
                    <span className="text-xs font-semibold text-slate-400">
                      / {(tokenMetrics?.dailyRequestLimit ?? 1500).toLocaleString("pt-BR")}
                    </span>
                  </p>
                  <span className="text-[10px] text-slate-400">
                    Média: ~{tokenMetrics?.avgTokensPerCall || 0} tokens/msg
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Acumulado Pesquisa
                  </span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">
                    {(tokenMetrics?.totalTokensAllTime ?? 0).toLocaleString("pt-BR")}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {tokenMetrics?.totalRequestsAllTime ?? 0} respostas geradas
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-500">
              <span className="truncate max-w-[70%]">
                <strong>Fallbacks ativos:</strong> {tokenMetrics?.fallbackModels?.join(" • ") || "Gemini 3.5 Flash • Qwen 3.8 27B"}
              </span>
              <span>
                {tokenMetrics?.lastCallAt
                  ? `Último uso: ${new Date(tokenMetrics.lastCallAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Sem chamadas recentes"}
              </span>
            </div>
          </div>
        </div>

        {/* Histórico Recente de Chamadas de IA */}
        {tokenMetrics?.recentCalls && tokenMetrics.recentCalls.length > 0 && (
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                Últimas Chamadas Registradas em Tempo Real
              </span>
              <span className="text-[11px] text-slate-400">
                Mostrando as {Math.min(tokenMetrics.recentCalls.length, 5)} respostas mais recentes
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Horário</th>
                    <th className="py-2 px-3">Modelo</th>
                    <th className="py-2 px-3 text-right">Entrada</th>
                    <th className="py-2 px-3 text-right">Saída</th>
                    <th className="py-2 px-3 text-right">Total Tokens</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tokenMetrics.recentCalls.slice(0, 5).map((call: any) => {
                    const isGem = call.model?.includes("gemini")
                    return (
                      <tr key={call.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-500">
                          {new Date(call.createdAt).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                        <td className="py-2 px-3 font-medium">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              isGem
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}
                          >
                            {call.model}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-500">
                          {call.promptTokens.toLocaleString("pt-BR")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-500">
                          {call.completionTokens.toLocaleString("pt-BR")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          {call.totalTokens.toLocaleString("pt-BR")}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ================= 3. TABELA DE CONTAS PRESENTES & GESTÃO DE ACESSOS ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Todas as Contas Presentes ({filteredUsers.length})</h2>
            <p className="text-xs text-slate-500">
              Monitore o desempenho individual por matrícula, altere permissões ou cadastre novos usuários
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Busca por Nome ou Matrícula */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar nome ou matrícula..."
                className="h-9 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filtro de Role */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Todos os Perfis</option>
              <option value="aluno">Discentes (Alunos)</option>
              <option value="professor">Docentes (Professores)</option>
              <option value="admin">Administradores</option>
            </select>

            <Button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Conta</span>
            </Button>
          </div>
        </div>

        {/* Formulário Expansível para Criar Nova Conta */}
        {isCreateOpen && (
          <form onSubmit={handleCreateUser} className="p-6 bg-blue-50/50 border-b border-blue-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Cadastrar Nova Conta no Banco de Dados
              </span>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Cancelar
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Matrícula / Login</label>
                <input
                  type="text"
                  value={newMatricula}
                  onChange={(e) => setNewMatricula(e.target.value)}
                  placeholder="Ex: 20243001234"
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome do estudante ou docente"
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">E-mail (Opcional)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="usuario@cefetmg.br"
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Senha Inicial</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Senha de acesso"
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Perfil (Role)</label>
                <div className="flex gap-2">
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="flex-1 h-9 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="aluno">Discente (aluno)</option>
                    <option value="professor">Docente (professor)</option>
                    <option value="admin">Admin (admin)</option>
                  </select>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                  >
                    {isSubmitting ? "Salvando..." : "Criar"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Tabela de Contas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Conta / Usuário</th>
                <th className="py-3.5 px-4">Matrícula</th>
                <th className="py-3.5 px-4">Perfil (Role)</th>
                <th className="py-3.5 px-4 text-center">Questões Resolvidas</th>
                <th className="py-3.5 px-4 text-center">Taxa de Acerto</th>
                <th className="py-3.5 px-4 text-center">Dicas Pedidas</th>
                <th className="py-3.5 px-4">Última Atividade / Cadastro</th>
                <th className="py-3.5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td
                    className="py-4 px-6 font-bold text-slate-900 cursor-pointer group"
                    onClick={() => handleOpenEditUser(u)}
                    title="Clique para editar dados completos do usuário"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[11px] shrink-0 group-hover:scale-105 transition-transform ${
                          u.role === "admin"
                            ? "bg-indigo-600"
                            : u.role === "professor"
                            ? "bg-emerald-600"
                            : "bg-blue-600"
                        }`}
                      >
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                            <span>{u.name}</span>
                            <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                          </p>
                          {u.status === "pending" && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Pendente
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {u.serie && u.curso ? `${u.serie} • ${u.curso}` : u.serie || u.curso || "Perfil geral"}
                        </div>
                        {u.email && (
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]" title={u.email}>
                            {u.email}
                          </div>
                        )}
                        {u.status === "pending" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleApproveUser(u.id)
                            }}
                            className="mt-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-2xs transition-colors"
                          >
                            ✓ Aprovar Acesso Docente
                          </button>
                        )}
                        {resetUserId === u.id && (
                          <div
                            className="mt-1.5 flex items-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={resetPasswordValue}
                              onChange={(e) => setResetPasswordValue(e.target.value)}
                              placeholder="Nova senha..."
                              className="h-7 px-2 bg-white border border-slate-300 rounded-lg text-[11px] w-28"
                            />
                            <button
                              type="button"
                              onClick={() => handleResetPassword(u.id)}
                              className="px-2 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold"
                            >
                              Salvar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setResetUserId(null)
                                setResetPasswordValue("")
                              }}
                              className="text-[10px] text-slate-400 hover:text-slate-600"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <code className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold">
                      {u.matricula}
                    </code>
                  </td>

                  <td className="py-4 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer ${
                        u.role === "admin"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : u.role === "professor"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      <option value="aluno">Discente (aluno)</option>
                      <option value="professor">Docente (professor)</option>
                      <option value="admin">Admin (admin)</option>
                    </select>
                  </td>

                  <td className="py-4 px-4 text-center font-bold text-slate-800">
                    {u.questionsSolved}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        u.questionsSolved === 0
                          ? "bg-slate-100 text-slate-400"
                          : u.accuracyRate >= 60
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {u.questionsSolved === 0 ? "—" : `${u.accuracyRate}%`}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center font-semibold text-slate-600">
                    {u.totalHints}
                  </td>

                  <td className="py-4 px-4 text-slate-500 text-[11px]">
                    {u.lastActiveAt ? (
                      <span className="text-emerald-700 font-medium">
                        Ativo em {new Date(u.lastActiveAt).toLocaleDateString("pt-BR")}
                      </span>
                    ) : (
                      <span>Criado em {new Date(u.createdAt).toLocaleDateString("pt-BR")}</span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditUser(u)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Editar cadastro completo"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setResetUserId(resetUserId === u.id ? null : u.id)
                          setResetPasswordValue("")
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Redefinir senha"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Excluir conta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= 4. LOGS RECENTES DE TELEMETRIA SOCRÁTICA ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Últimas Interações Registradas na Telemetria</h2>
            <p className="text-xs text-slate-500">
              Amostra em tempo real dos dados que compõem a planilha CSV da pesquisa
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Exibindo até 30 registros recentes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6">Conta / Sessão</th>
                <th className="py-3 px-4">Tópico BNCC</th>
                <th className="py-3 px-4 text-center">Tempo</th>
                <th className="py-3 px-4 text-center">Dicas Pedidas</th>
                <th className="py-3 px-4 text-center">Resultado</th>
                <th className="py-3 px-6 text-right">Data / Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Nenhuma interação registrada ainda.
                  </td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-6">
                      <span className="font-bold text-slate-800 block">{log.matricula}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.sessionId}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{log.topico}</td>
                    <td className="py-3 px-4 text-center text-slate-600">{log.timeSeconds}s</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-600">{log.hintsRequested}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.isCorrect
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {log.isCorrect ? "Acertou" : "Errou"}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right text-slate-400 text-[11px]">
                      {new Date(log.createdAt).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* Modal de Edição Completa do Usuário */}
      <EditUserModal
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingUser(null)
        }}
        onSaveSuccess={handleEditUserSuccess}
      />

    </div>
  )
}
