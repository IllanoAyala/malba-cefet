"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Users,
  GraduationCap,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Download,
  Search,
  Eye,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  Landmark,
  ChevronRight,
  X,
  Loader2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

function formatMinutes(min: number): string {
  if (!min || min <= 0) return "0 min"
  if (min < 60) return `${min} min`
  const hours = Math.floor(min / 60)
  const remainingMin = min % 60
  return remainingMin > 0 ? `${hours}h ${remainingMin}m` : `${hours}h`
}

function formatDate(dateStr?: string | Date): string {
  if (!dateStr) return "Nunca"
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export default function ProfessorTurmasPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Filtros
  const [selectedSerie, setSelectedSerie] = useState("Todas")
  const [selectedCurso, setSelectedCurso] = useState("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)

  const fetchTurmas = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/professor/turmas")
      if (!res.ok) {
        throw new Error("Falha ao carregar dados das turmas.")
      }
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message || "Erro de conexão.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchTurmas()
    }
  }, [status])

  if (status === "loading" || isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500">
          Carregando turmas e histórico de uso dos estudantes...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Erro ao carregar dados</h2>
        <p className="text-xs text-slate-600">{error}</p>
        <Button onClick={fetchTurmas} variant="blue" className="text-xs">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  const teacherClasses: Array<{ serie: string; curso: string }> = data?.teacherClasses || []
  const allStudents: any[] = data?.students || []

  // Extrair séries e cursos disponíveis
  const availableSeries = Array.from(new Set(teacherClasses.map((tc) => tc.serie)))
  const availableCursos = Array.from(new Set(teacherClasses.map((tc) => tc.curso)))

  // Filtrar alunos
  const filteredStudents = allStudents.filter((st) => {
    const matchesSerie = selectedSerie === "Todas" || st.serie === selectedSerie
    const matchesCurso = selectedCurso === "Todos" || st.curso === selectedCurso
    const matchesSearch =
      searchQuery.trim() === "" ||
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.matricula.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSerie && matchesCurso && matchesSearch
  })

  // Exportar relatório em CSV
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return

    const headers = [
      "Nome",
      "Matricula",
      "Serie",
      "Curso",
      "Acessos_Hoje",
      "Acessos_Semana",
      "Acessos_Mes",
      "Tempo_Logado_Minutos",
      "Exercicios_Feitos",
      "Questoes_Unicas_Acertadas",
      "Taxa_Precisao_Pct",
      "Dicas_Socraticas_Pedidas",
      "Ultimo_Acesso",
    ]

    const rows = filteredStudents.map((s) => [
      `"${s.name}"`,
      `"${s.matricula}"`,
      `"${s.serie}"`,
      `"${s.curso}"`,
      s.metrics.accessesToday,
      s.metrics.accessesWeek,
      s.metrics.accessesMonth,
      s.metrics.totalTimeLoggedMinutes,
      s.metrics.totalExercises,
      s.metrics.uniqueQuestionsSolved,
      `${s.metrics.accuracyRate}%`,
      s.metrics.totalHintsRequested,
      `"${formatDate(s.metrics.lastAccessAt)}"`,
    ])

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `relatorio_turmas_malba_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24 md:pb-8">
      {/* Cabeçalho Institucional da Página */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/70">
              <Landmark className="w-3 h-3 text-blue-600" />
              <span>PIBIC CEFET-MG &bull; Campus V</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/80">
              <GraduationCap className="w-3 h-3 text-slate-500" />
              <span>Painel Docente</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Acompanhamento de Turmas
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light max-w-2xl">
            Acompanhe em tempo real o engajamento dos estudantes, tempo de estudo ativo, conteúdos visualizados e evolução na resolução das questões mediadas pelo Malba.
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="rounded-xl text-xs font-bold gap-2 shrink-0 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 hover:border-blue-200 shadow-2xs h-10 px-4 cursor-pointer w-full md:w-auto justify-center"
          disabled={filteredStudents.length === 0}
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Exportar Relatório (CSV)</span>
        </Button>
      </div>

      {/* Cards de Métricas Gerais da Turma */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Alunos Cadastrados</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{filteredStudents.length}</div>
          <p className="text-[11px] text-slate-500">Nas turmas selecionadas</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Ativos Hoje</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {filteredStudents.filter((s) => s.metrics.accessesToday > 0).length}
          </div>
          <p className="text-[11px] text-slate-500">Acessaram nas últimas 24h</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Ativos na Semana</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {filteredStudents.filter((s) => s.metrics.accessesWeek > 0).length}
          </div>
          <p className="text-[11px] text-slate-500">Acessaram nos últimos 7 dias</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Questões Feitas</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {filteredStudents.reduce((acc, s) => acc + s.metrics.totalExercises, 0)}
          </div>
          <p className="text-[11px] text-slate-500">
            {filteredStudents.reduce((acc, s) => acc + s.metrics.uniqueQuestionsSolved, 0)} acertos únicos
          </p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Filtro Série */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600">Série:</span>
            <select
              value={selectedSerie}
              onChange={(e) => setSelectedSerie(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
            >
              <option value="Todas">Todas as Séries</option>
              {availableSeries.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Filtro Curso */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600">Curso:</span>
            <select
              value={selectedCurso}
              onChange={(e) => setSelectedCurso(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
            >
              <option value="Todos">Todos os Cursos</option>
              {availableCursos.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Busca por Nome ou Matrícula */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <Input
            placeholder="Buscar por nome ou matrícula..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Tabela de Estudantes (Tablet & Desktop) + Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Visualização em Tabela para Tablets e Desktops */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Estudante</th>
                <th className="py-3.5 px-4">Turma / Série</th>
                <th className="py-3.5 px-4 text-center">Acessos (Hoje / 7d / 30d)</th>
                <th className="py-3.5 px-4 text-center">Tempo Logado</th>
                <th className="py-3.5 px-4 text-center">Exercícios Feitos</th>
                <th className="py-3.5 px-4 text-center">Último Acesso</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Nenhum aluno encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{st.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Matrícula: {st.matricula}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{st.serie}</div>
                      <div className="text-[11px] text-slate-500">{st.curso}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-bold">
                        <span className={`px-2 py-0.5 rounded-md ${st.metrics.accessesToday > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`} title="Hoje">
                          {st.metrics.accessesToday}h
                        </span>
                        <span className="text-slate-300">/</span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800" title="Últimos 7 dias">
                          {st.metrics.accessesWeek}sem
                        </span>
                        <span className="text-slate-300">/</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700" title="Últimos 30 dias">
                          {st.metrics.accessesMonth}mês
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {formatMinutes(st.metrics.totalTimeLoggedMinutes)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="font-bold text-slate-900">
                        {st.metrics.uniqueQuestionsSolved} / {st.metrics.totalExercises} acertos
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Precisão: {st.metrics.accuracyRate}% &bull; {st.metrics.totalHintsRequested} dicas
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500 text-[11px]">
                      {formatDate(st.metrics.lastAccessAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedStudent(st)}
                        className="rounded-xl text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs font-bold gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver Histórico
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Visualização em Cartões para Smartphones (< md) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Nenhum aluno encontrado para os filtros selecionados.
            </div>
          ) : (
            filteredStudents.map((st) => (
              <div key={st.id} className="p-4 space-y-3 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{st.name}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Matrícula: {st.matricula} &bull; {st.curso}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0 font-bold">
                    {st.serie}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-semibold">Hoje</span>
                    <span className="font-bold text-slate-800 text-xs">{st.metrics.accessesToday}h</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-semibold">Tempo</span>
                    <span className="font-bold text-slate-800 text-xs">{formatMinutes(st.metrics.totalTimeLoggedMinutes)}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block font-semibold">Acertos</span>
                    <span className="font-bold text-emerald-600 text-xs">{st.metrics.uniqueQuestionsSolved}/{st.metrics.totalExercises}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedStudent(st)}
                  variant="outline"
                  size="sm"
                  className="w-full h-10 rounded-xl text-xs font-bold text-blue-700 bg-blue-50/70 border-blue-200 hover:bg-blue-100 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  <span>Ver Dossiê do Aluno</span>
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal / Gaveta Lateral de Detalhes do Aluno */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Topo do Modal */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                  Dossiê de Aprendizagem &bull; Arco de Maguerez
                </span>
                <h3 className="text-xl font-black text-slate-900">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500">
                  Matrícula: {selectedStudent.matricula} &bull; {selectedStudent.serie} &bull; {selectedStudent.curso}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Métricas de Engajamento Resumidas */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Tempo Total Conectado</span>
                <span className="text-lg font-black text-slate-900">
                  {formatMinutes(selectedStudent.metrics.totalTimeLoggedMinutes)}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Taxa de Acertos</span>
                <span className="text-lg font-black text-emerald-600">
                  {selectedStudent.metrics.accuracyRate}%
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Dicas Socráticas</span>
                <span className="text-lg font-black text-blue-600">
                  {selectedStudent.metrics.totalHintsRequested}
                </span>
              </div>
            </div>

            {/* Histórico Recente de Exercícios */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" /> Questões Resolvidas Recentemente:
              </h4>

              {selectedStudent.history.recentExercises.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  O aluno ainda não resolveu nenhuma questão do ENEM nesta plataforma.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedStudent.history.recentExercises.map((ex: any) => (
                    <div
                      key={ex.id}
                      className="p-3 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900">
                          {ex.topico} &bull; ENEM {ex.anoEnem}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Série: {ex.anoEnsinoMedio} &bull; {formatDate(ex.date)} &bull; Tempo: {Math.round(ex.timeSpentMs / 1000)}s
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {ex.isCorrect ? (
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Acertou
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none gap-1">
                            <XCircle className="w-3.5 h-3.5 text-red-600" /> Não acertou
                          </Badge>
                        )}
                        {ex.hintsRequested > 0 && (
                          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {ex.hintsRequested} dicas
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Linha do Tempo de Navegação e Módulos */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-600" /> Atividades Recentes de Acesso:
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {selectedStudent.history.recentEvents.slice(0, 10).map((ev: any, idx: number) => (
                  <div key={idx} className="text-xs flex items-center justify-between text-slate-600 py-1 border-b border-slate-100 last:border-none">
                    <span className="truncate pr-2 font-medium">
                      {ev.type === "page_view" && `Navegou em: ${ev.target}`}
                      {ev.type === "question_open" && `Abriu questão ID ${ev.target?.slice(0, 8)}...`}
                      {ev.type === "question_answer" && `Submeteu resposta de questão`}
                      {ev.type === "video_open" && `Assistiu videoaula GTMAT`}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {formatDate(ev.date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedStudent(null)}
                className="rounded-xl text-xs font-bold"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
