"use client"

import React, { useState, useEffect } from "react"
import {
  X,
  User,
  UserCheck,
  Lock,
  GraduationCap,
  School,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Target,
  Lightbulb,
  Check,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SERIES, CURSOS_CEFET } from "@/lib/curriculum"

export interface EditUserModalUser {
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
  questionsSolved?: number
  correctAnswers?: number
  accuracyRate?: number
  totalHints?: number
  avgTimeSeconds?: number
  lastActiveAt?: string | null
}

interface EditUserModalProps {
  user: EditUserModalUser | null
  isOpen: boolean
  onClose: () => void
  onSaveSuccess: (updatedUser: any) => void
}

export function EditUserModal({
  user,
  isOpen,
  onClose,
  onSaveSuccess,
}: EditUserModalProps) {
  const [name, setName] = useState(user?.name || "")
  const [matricula, setMatricula] = useState(user?.matricula || "")
  const [email, setEmail] = useState(user?.email || "")
  const [role, setRole] = useState<"aluno" | "professor" | "admin">(user?.role || "aluno")
  const [status, setStatus] = useState<string>(user?.status || "active")
  const [serie, setSerie] = useState<string>(user?.serie || "1º Ano")
  const [isCefet, setIsCefet] = useState<boolean>(user?.isCefet !== false)
  const [curso, setCurso] = useState<string>(user?.curso || "Informática")
  const [newPassword, setNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [selectedClasses, setSelectedClasses] = useState<Array<{ serie: string; curso: string }>>(
    user?.teacherClasses || []
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setMatricula(user.matricula || "")
      setEmail(user.email || "")
      setRole(user.role || "aluno")
      setStatus(user.status || "active")
      setSerie(user.serie || "1º Ano")
      setIsCefet(user.isCefet !== false)
      setCurso(user.curso || "Informática")
      setNewPassword("")
      setSelectedClasses(user.teacherClasses || [])
      setError("")
    }
  }, [user])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError("")
    setIsLoading(true)

    try {
      const payload: any = {
        id: user.id,
        name: name.trim(),
        matricula: matricula.trim(),
        email: email.trim().toLowerCase() || null,
        role,
        status,
      }

      if (newPassword.trim()) {
        payload.newPassword = newPassword.trim()
      }

      if (role === "aluno") {
        payload.serie = serie
        payload.isCefet = isCefet
        payload.curso = isCefet ? curso : "Externo / Outro"
      } else if (role === "professor") {
        payload.teacherClasses = selectedClasses
        payload.serie = null
        payload.curso = null
      } else {
        payload.serie = null
        payload.curso = null
      }

      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao atualizar dados do usuário.")
      }

      onSaveSuccess(data.user)
      onClose()
    } catch (err: any) {
      setError(err.message || "Erro ao salvar alterações.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-xs ${
                role === "admin"
                  ? "bg-indigo-600"
                  : role === "professor"
                  ? "bg-emerald-600"
                  : "bg-blue-600"
              }`}
            >
              {name.substring(0, 2).toUpperCase() || "US"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  Editar Usuário
                </h3>
                <code className="text-xs bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md font-mono font-semibold">
                  {user.matricula}
                </code>
              </div>
              <p className="text-xs text-slate-500">
                Gerencie permissões, turmas, credenciais e série curricular
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Formulário com Scroll Suave */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Métricas Rápidas do Usuário */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-[11px]">
            <div className="space-y-0.5">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">
                Resolvidas
              </span>
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <Target className="w-3.5 h-3.5 text-blue-600" />
                <span>{user.questionsSolved ?? 0}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">
                Taxa de Acerto
              </span>
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{user.questionsSolved ? `${user.accuracyRate ?? 0}%` : "—"}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">
                Dicas Pedidas
              </span>
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{user.totalHints ?? 0}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">
                Última Atividade
              </span>
              <div className="flex items-center gap-1 font-medium text-slate-600 truncate">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  {user.lastActiveAt
                    ? new Date(user.lastActiveAt).toLocaleDateString("pt-BR")
                    : "Sem registros"}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Dados Cadastrais Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Nome Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                Matrícula / Usuário SIGAA
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <Input
                  type="text"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 block">E-mail Cadastrado</label>
                {user.emailVerified ? (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                    ✓ E-mail Verificado
                  </span>
                ) : user.email ? (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                    Pendente de verificação
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">
                    Sem e-mail vinculado
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@cefetmg.br ou gmail.com"
                  className="pl-9 h-9 text-xs rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* 3. Perfil de Acesso & Status da Conta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Perfil de Acesso (Role)</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole("aluno")}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    role === "aluno"
                      ? "bg-white text-blue-700 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Discente
                </button>
                <button
                  type="button"
                  onClick={() => setRole("professor")}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    role === "professor"
                      ? "bg-white text-emerald-700 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Docente
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    role === "admin"
                      ? "bg-white text-indigo-700 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Status da Conta</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full h-9 px-3 rounded-xl border text-xs font-bold ${
                  status === "active"
                    ? "bg-emerald-50/70 border-emerald-300 text-emerald-800"
                    : "bg-amber-50/70 border-amber-300 text-amber-800"
                }`}
              >
                <option value="active">✓ Ativa (Acesso Liberado)</option>
                <option value="pending">⏳ Pendente (Aguardando Moderação)</option>
              </select>
            </div>
          </div>

          {/* 4. Campos Exclusivos para Discente (Aluno) */}
          {role === "aluno" && (
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3.5">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-blue-900">
                  Configurações Curriculares do Discente
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Série no Ensino Médio (Define a liberação cumulativa de conteúdos):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SERIES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSerie(s)}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        serie === s
                          ? "border-blue-600 bg-white text-blue-800 shadow-2xs"
                          : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {serie === "1º Ano" && "Libera apenas os conteúdos do 1º Ano."}
                  {serie === "2º Ano" && "Libera cumulativamente os conteúdos do 1º e 2º Ano."}
                  {serie === "3º Ano" && "Libera todos os conteúdos dos 3 anos do Ensino Médio."}
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="font-bold text-slate-700 block">
                  Vínculo com o CEFET-MG:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCefet(true)}
                    className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isCefet
                        ? "border-blue-600 bg-white text-blue-800 shadow-2xs"
                        : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white"
                    }`}
                  >
                    Aluno do CEFET-MG
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCefet(false)}
                    className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      !isCefet
                        ? "border-blue-600 bg-white text-blue-800 shadow-2xs"
                        : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white"
                    }`}
                  >
                    Externo / Outro
                  </button>
                </div>

                {isCefet ? (
                  <div className="pt-1">
                    <label className="font-bold text-slate-700 block mb-1">
                      Curso Técnico Integrado (Divinópolis):
                    </label>
                    <select
                      value={curso}
                      onChange={(e) => setCurso(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                    >
                      {CURSOS_CEFET.map((c) => (
                        <option key={c} value={c}>
                          Técnico em {c}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="pt-1">
                    <label className="font-bold text-slate-700 block mb-1">
                      Descrição da Instituição / Curso Externo:
                    </label>
                    <Input
                      type="text"
                      value={curso === "Informática" ? "" : curso}
                      onChange={(e) => setCurso(e.target.value)}
                      placeholder="Ex: Escola Estadual / Pré-vestibular"
                      className="h-9 text-xs rounded-xl bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Campos Exclusivos para Docente (Professor) */}
          {role === "professor" && (
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-emerald-900">
                  Turmas que o Docente Leciona no CEFET-MG
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                O professor terá acesso ao painel &ldquo;Minhas Turmas&rdquo; para acompanhar as interações dos alunos matriculados nestas combinações:
              </p>

              <div className="grid grid-cols-3 gap-2">
                {SERIES.map((s) => (
                  <div key={s} className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-blue-900 block text-center pb-1 border-b border-slate-100">
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
                          className={`w-full py-1.5 px-2 rounded-lg border text-[11px] font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-600 text-white shadow-2xs"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <span className="truncate">{c}</span>
                          {isSelected && <Check className="w-3 h-3 shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Redefinição de Senha (Opcional) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-slate-800">Redefinir Senha de Acesso</span>
              </div>
              <span className="text-[10px] text-slate-400">Opcional</span>
            </div>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite uma nova senha para alterar (mínimo 4 caracteres)..."
                className="h-9 pr-9 text-xs rounded-xl bg-white"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                tabIndex={-1}
                title={showNewPassword ? "Ocultar senha" : "Ver senha"}
                aria-label={showNewPassword ? "Ocultar senha" : "Ver senha"}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Deixe em branco para preservar a senha atual cadastrada.
            </p>
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-4 rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
