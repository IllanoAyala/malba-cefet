"use client"

import React, { useState, useEffect } from "react"
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Edit3,
  ExternalLink,
  Eye,
  Code,
  Save,
  X,
  Loader2,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  Check,
  Flag,
  FileQuestion,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

interface Alternative {
  letra: string
  texto: string
}

interface QuestionReport {
  id: string
  description: string
  status: string
  createdAt: string
}

interface QuestionItem {
  id: string
  enunciado: string
  alternativas: Alternative[]
  alternativa_correta: string
  ano_enem: number
  ano_ensino_medio: string
  topico_bncc: string
  habilidade_enem: string
  dicas_socraticas?: any
  reports?: QuestionReport[]
  _count?: {
    interactionLogs: number
    reports: number
  }
}

export function QuestionReviewTab() {
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Filtros
  const [searchQuery, setSearchQuery] = useState("")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [topicFilter, setTopicFilter] = useState<string>("all")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [onlyReported, setOnlyReported] = useState(false)

  // Modal de Edição
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null)
  const [editEnunciado, setEditEnunciado] = useState("")
  const [editAlternativas, setEditAlternativas] = useState<Alternative[]>([])
  const [editCorreta, setEditCorreta] = useState("A")
  const [editTopico, setEditTopico] = useState("")
  const [editHabilidade, setEditHabilidade] = useState("")
  const [editAnoEM, setEditAnoEM] = useState("1º Ano")
  const [editAnoEnem, setEditAnoEnem] = useState(2025)
  const [activeModalTab, setActiveModalTab] = useState<"edit" | "preview">("edit")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("")
  const [saveErrorMsg, setSaveErrorMsg] = useState("")

  // Resolução de Reports
  const [resolvingReportId, setResolvingReportId] = useState<string | null>(null)

  const fetchQuestions = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/questions")
      if (!res.ok) throw new Error("Erro ao carregar banco de questões.")
      const data = await res.json()
      setQuestions(data.questions || [])
      setTopics(data.topics || [])
    } catch (err: any) {
      setError(err.message || "Falha na comunicação com o servidor.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  // Abre o modal de edição carregando os dados da questão selecionada
  const handleOpenEdit = (q: QuestionItem) => {
    setEditingQuestion(q)
    setEditEnunciado(q.enunciado)
    setEditAlternativas(
      Array.isArray(q.alternativas) && q.alternativas.length === 5
        ? JSON.parse(JSON.stringify(q.alternativas))
        : [
            { letra: "A", texto: "" },
            { letra: "B", texto: "" },
            { letra: "C", texto: "" },
            { letra: "D", texto: "" },
            { letra: "E", texto: "" },
          ]
    )
    setEditCorreta(q.alternativa_correta || "A")
    setEditTopico(q.topico_bncc || "")
    setEditHabilidade(q.habilidade_enem || "")
    setEditAnoEM(q.ano_ensino_medio || "1º Ano")
    setEditAnoEnem(q.ano_enem || 2025)
    setActiveModalTab("edit")
    setSaveSuccessMsg("")
    setSaveErrorMsg("")
  }

  const handleSaveQuestion = async () => {
    if (!editingQuestion) return
    setIsSaving(true)
    setSaveSuccessMsg("")
    setSaveErrorMsg("")

    try {
      const res = await fetch("/api/admin/questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingQuestion.id,
          enunciado: editEnunciado,
          alternativas: editAlternativas,
          alternativa_correta: editCorreta,
          topico_bncc: editTopico,
          habilidade_enem: editHabilidade,
          ano_ensino_medio: editAnoEM,
          ano_enem: editAnoEnem,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Não foi possível salvar as alterações.")
      }

      // Atualiza a lista local em memória
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestion.id ? { ...q, ...data.question } : q))
      )
      setSaveSuccessMsg("Questão e alternativas salvas com sucesso no banco de dados!")
      setTimeout(() => {
        setEditingQuestion(null)
      }, 1200)
    } catch (err: any) {
      setSaveErrorMsg(err.message || "Erro ao salvar questão.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleResolveReport = async (reportId: string, questionId: string) => {
    setResolvingReportId(reportId)
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reportId, status: "fixed" }),
      })
      if (res.ok) {
        setQuestions((prev) =>
          prev.map((q) => {
            if (q.id === questionId && q.reports) {
              return {
                ...q,
                reports: q.reports.filter((r) => r.id !== reportId),
              }
            }
            return q
          })
        )
      }
    } catch (err) {
      console.error("Erro ao resolver reporte:", err)
    } finally {
      setResolvingReportId(null)
    }
  }

  // Filtragem
  const filteredQuestions = questions.filter((q) => {
    if (yearFilter !== "all" && q.ano_enem !== Number(yearFilter)) return false
    if (topicFilter !== "all" && q.topico_bncc !== topicFilter) return false
    if (gradeFilter !== "all" && q.ano_ensino_medio !== gradeFilter) return false
    if (onlyReported && (!q.reports || q.reports.length === 0)) return false

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const searchSpace = `${q.id} ${q.enunciado} ${q.topico_bncc} ${q.habilidade_enem}`.toLowerCase()
      if (!searchSpace.includes(query)) return false
    }

    return true
  })

  const totalReported = questions.filter((q) => q.reports && q.reports.length > 0).length

  return (
    <div className="space-y-6">
      {/* ================= BARRA DE CONTROLE & ESTATÍSTICAS DO BANCO ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Curadoria &amp; Auditoria de Conteúdo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Banco de Questões &amp; Revisão de Textos
            </h2>
            <p className="text-xs text-slate-500">
              Inspecione o enunciado, imagens, fórmulas matemáticas em KaTeX e as alternativas de cada questão. Você pode editar e salvar correções diretamente no banco.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              <FileQuestion className="w-3.5 h-3.5 text-blue-600" />
              <span>{questions.length} Questões no Total</span>
            </span>

            {totalReported > 0 && (
              <button
                onClick={() => setOnlyReported(!onlyReported)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  onlyReported
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100"
                }`}
              >
                <Flag className="w-3.5 h-3.5 text-amber-500" />
                <span>{totalReported} com Relato de Aluno</span>
              </button>
            )}

            <button
              onClick={fetchQuestions}
              disabled={isLoading}
              className="h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Recarregar questões do banco"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Busca por texto ou ID */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por texto, palavra no enunciado ou ID..."
              className="w-full h-9 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtro Ano ENEM */}
          <div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Todos os Anos do ENEM</option>
              <option value="2025">ENEM 2025</option>
              <option value="2024">ENEM 2024</option>
            </select>
          </div>

          {/* Filtro Tópico BNCC */}
          <div>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Todos os Tópicos BNCC</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Ano do Ensino Médio */}
          <div>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Todas as Séries (EM)</option>
              <option value="1º Ano">1º Ano</option>
              <option value="2º Ano">2º Ano</option>
              <option value="3º Ano">3º Ano</option>
            </select>
          </div>
        </div>

        {/* Resumo de Resultados */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Exibindo <strong>{filteredQuestions.length}</strong> de {questions.length} questões
            {onlyReported && " (filtradas por relato de erro)"}
          </span>
          {(yearFilter !== "all" || topicFilter !== "all" || gradeFilter !== "all" || searchQuery || onlyReported) && (
            <button
              onClick={() => {
                setYearFilter("all")
                setTopicFilter("all")
                setGradeFilter("all")
                setSearchQuery("")
                setOnlyReported(false)
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      </div>

      {/* ================= LISTA DAS QUESTÕES ================= */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Carregando questões do banco de dados...</p>
          <p className="text-xs text-slate-400 mt-1">Conectando ao PostgreSQL Neon e preparando renderização KaTeX</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs space-y-3">
          <FileQuestion className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Nenhuma questão encontrada</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Não foram encontradas questões com os filtros selecionados. Tente ajustar os termos de busca ou limpar os filtros.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => {
            const hasPendingReports = q.reports && q.reports.length > 0
            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl border transition-all duration-200 shadow-xs overflow-hidden ${
                  hasPendingReports ? "border-amber-300 ring-2 ring-amber-100" : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {/* Cabeçalho do Card */}
                <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-white font-bold text-slate-800">
                      ENEM {q.ano_enem}
                    </Badge>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                      {q.ano_ensino_medio}
                    </Badge>
                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">
                      {q.topico_bncc}
                    </Badge>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Gabarito: {q.alternativa_correta}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono hidden md:inline" title="ID da Questão">
                      #{q.id.slice(0, 8)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleOpenEdit(q)}
                      className="h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Revisar / Editar</span>
                    </Button>

                    <a
                      href={`/workspace/${q.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Abrir questão na visão do aluno"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ver no Workspace</span>
                    </a>
                  </div>
                </div>

                {/* Banner de Relatos de Aluno (se houver) */}
                {hasPendingReports && (
                  <div className="p-4 bg-amber-50/80 border-b border-amber-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Relato de Erro Enviado por Aluno:</span>
                      </div>
                      <span className="text-[10px] text-amber-700 font-medium">
                        {q.reports?.length} chamado(s) aberto(s)
                      </span>
                    </div>
                    {q.reports?.map((r) => (
                      <div
                        key={r.id}
                        className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <p className="text-slate-800 font-medium italic">"{r.description}"</p>
                          <span className="text-[10px] text-slate-400">
                            Enviado em {new Date(r.createdAt).toLocaleString("pt-BR")}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={resolvingReportId === r.id}
                          onClick={() => handleResolveReport(r.id, q.id)}
                          className="h-7 px-2.5 text-[11px] border-emerald-300 text-emerald-700 hover:bg-emerald-50 shrink-0 self-start sm:self-auto cursor-pointer"
                        >
                          {resolvingReportId === r.id ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <Check className="w-3 h-3 mr-1" />
                          )}
                          Marcar como Resolvido
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Corpo: Enunciado e Alternativas */}
                <div className="p-5 sm:p-6 space-y-6">
                  {/* Habilidade ENEM */}
                  {q.habilidade_enem && (
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      {q.habilidade_enem}
                    </p>
                  )}

                  {/* Enunciado formatado com KaTeX, Imagens e Tabelas */}
                  <div className="prose max-w-none text-slate-800 text-sm sm:text-base leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        img: ({ node, ...props }) => (
                          <img
                            className="max-w-full sm:max-h-72 rounded-xl my-4 shadow-xs border border-slate-200 bg-white p-1"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-4 not-prose">
                            <table
                              className="min-w-full border-collapse border border-slate-200 rounded-xl overflow-hidden shadow-xs text-xs sm:text-sm bg-white"
                              {...props}
                            />
                          </div>
                        ),
                        thead: ({ node, ...props }) => (
                          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-800" {...props} />
                        ),
                        th: ({ node, ...props }) => (
                          <th className="px-3 py-2 text-center border-r border-slate-200 last:border-r-0" {...props} />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="px-3 py-2 text-center text-slate-700 border-b border-r border-slate-100 last:border-r-0" {...props} />
                        ),
                      }}
                    >
                      {q.enunciado}
                    </ReactMarkdown>
                  </div>

                  {/* Alternativas A–E */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Alternativas da Questão:
                    </span>
                    <div className="grid grid-cols-1 gap-2.5">
                      {Array.isArray(q.alternativas) &&
                        q.alternativas.map((alt) => {
                          const isCorrect = alt.letra === q.alternativa_correta
                          return (
                            <div
                              key={alt.letra}
                              className={`p-3 sm:p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                                isCorrect
                                  ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200 text-emerald-950 font-medium"
                                  : "bg-slate-50/50 border-slate-200/80 text-slate-700"
                              }`}
                            >
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                  isCorrect ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {alt.letra}
                              </span>

                              <div className="flex-1 text-xs sm:text-sm prose prose-sm max-w-none">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm, remarkMath]}
                                  rehypePlugins={[rehypeKatex]}
                                  components={{
                                    p: ({ node, ...props }) => <span {...props} />,
                                    img: ({ node, ...props }) => (
                                      <img
                                        className="max-h-48 w-auto rounded-lg my-1 border border-slate-200 bg-white p-1"
                                        {...props}
                                      />
                                    ),
                                  }}
                                >
                                  {alt.texto}
                                </ReactMarkdown>
                              </div>

                              {isCorrect && (
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                                  Correta (Gabarito)
                                </span>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ================= MODAL DE EDIÇÃO E REVISÃO COMPLETA ================= */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Cabeçalho do Modal */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600 text-white font-bold">
                    ENEM {editAnoEnem}
                  </Badge>
                  <h3 className="text-base font-black text-slate-900">
                    Revisar &amp; Editar Questão #{editingQuestion.id.slice(0, 8)}
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Edite o texto do enunciado, fórmulas em KaTeX, imagens ou alternativas e salve no banco de dados.
                </p>
              </div>

              <button
                onClick={() => setEditingQuestion(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Alternador de Abas do Modal (Edição vs Pré-visualização ao vivo) */}
            <div className="px-5 pt-3 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalTab("edit")}
                  className={`px-3 py-2 text-xs font-bold rounded-t-lg border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeModalTab === "edit"
                      ? "border-blue-600 text-blue-600 bg-blue-50/50"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Editor de Campos</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab("preview")}
                  className={`px-3 py-2 text-xs font-bold rounded-t-lg border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeModalTab === "preview"
                      ? "border-blue-600 text-blue-600 bg-blue-50/50"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pré-visualização do Aluno (KaTeX)</span>
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}
              {saveErrorMsg && (
                <div className="flex items-center gap-1.5 text-xs text-red-700 font-semibold bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  <span>{saveErrorMsg}</span>
                </div>
              )}
            </div>

            {/* Conteúdo do Modal (Scrollável) */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {activeModalTab === "edit" ? (
                <div className="space-y-6">
                  {/* Metadados: Ano, Tópico, Série */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                        Ano ENEM
                      </label>
                      <input
                        type="number"
                        value={editAnoEnem}
                        onChange={(e) => setEditAnoEnem(Number(e.target.value))}
                        className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                        Série do EM
                      </label>
                      <select
                        value={editAnoEM}
                        onChange={(e) => setEditAnoEM(e.target.value)}
                        className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                      >
                        <option value="1º Ano">1º Ano</option>
                        <option value="2º Ano">2º Ano</option>
                        <option value="3º Ano">3º Ano</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                        Tópico BNCC
                      </label>
                      <input
                        type="text"
                        value={editTopico}
                        onChange={(e) => setEditTopico(e.target.value)}
                        placeholder="Ex: Funções, Geometria Espacial..."
                        className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Enunciado */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        Texto do Enunciado (Suporta Markdown, KaTeX $...$ e Imagens ![Texto](/images/...)):
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {editEnunciado.length} caracteres
                      </span>
                    </div>
                    <textarea
                      rows={8}
                      value={editEnunciado}
                      onChange={(e) => setEditEnunciado(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>

                  {/* Alternativas A–E */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        Alternativas de Resposta (A a E):
                      </label>
                      <span className="text-[11px] text-slate-500">
                        Marque o círculo da alternativa que é o <strong>Gabarito Oficial</strong>
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {editAlternativas.map((alt, i) => {
                        const isSelectedAsCorrect = editCorreta === alt.letra
                        return (
                          <div
                            key={alt.letra}
                            className={`p-3 rounded-2xl border flex items-center gap-3 transition-colors ${
                              isSelectedAsCorrect
                                ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200"
                                : "bg-slate-50/50 border-slate-200"
                            }`}
                          >
                            <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                              <input
                                type="radio"
                                name="modal_correct_opt"
                                checked={isSelectedAsCorrect}
                                onChange={() => setEditCorreta(alt.letra)}
                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                                  isSelectedAsCorrect
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {alt.letra}
                              </span>
                            </label>

                            <input
                              type="text"
                              value={alt.texto}
                              onChange={(e) => {
                                const updated = [...editAlternativas]
                                updated[i] = { ...updated[i], texto: e.target.value }
                                setEditAlternativas(updated)
                              }}
                              placeholder={`Texto ou fórmula da alternativa ${alt.letra}...`}
                              className="flex-1 h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                            />

                            {isSelectedAsCorrect ? (
                              <span className="text-[11px] font-bold text-emerald-700 shrink-0 hidden sm:inline">
                                Gabarito
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setEditCorreta(alt.letra)}
                                className="text-[11px] text-slate-400 hover:text-emerald-600 font-medium shrink-0 hidden sm:inline"
                              >
                                Definir como Correta
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Aba de Pré-visualização ao vivo com KaTeX */
                <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Pré-visualização em Tempo Real
                    </span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold">
                      Gabarito Configurado: {editCorreta}
                    </Badge>
                  </div>

                  {/* Render do Enunciado */}
                  <div className="prose max-w-none text-slate-800 text-sm sm:text-base leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        img: ({ node, ...props }) => (
                          <img
                            className="max-w-full sm:max-h-72 rounded-xl my-4 shadow-xs border border-slate-200 bg-white p-1"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-4 not-prose">
                            <table
                              className="min-w-full border-collapse border border-slate-200 rounded-xl overflow-hidden shadow-xs text-xs sm:text-sm bg-white"
                              {...props}
                            />
                          </div>
                        ),
                        thead: ({ node, ...props }) => (
                          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-800" {...props} />
                        ),
                        th: ({ node, ...props }) => (
                          <th className="px-3 py-2 text-center border-r border-slate-200 last:border-r-0" {...props} />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="px-3 py-2 text-center text-slate-700 border-b border-r border-slate-100 last:border-r-0" {...props} />
                        ),
                      }}
                    >
                      {editEnunciado}
                    </ReactMarkdown>
                  </div>

                  {/* Render das Alternativas */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Alternativas Renderizadas:
                    </span>
                    {editAlternativas.map((alt) => {
                      const isCorrect = alt.letra === editCorreta
                      return (
                        <div
                          key={alt.letra}
                          className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                            isCorrect
                              ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-200 text-emerald-950"
                              : "bg-white border-slate-200 text-slate-700"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                              isCorrect ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {alt.letra}
                          </span>
                          <div className="flex-1 text-xs sm:text-sm prose prose-sm max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              components={{
                                p: ({ node, ...props }) => <span {...props} />,
                                img: ({ node, ...props }) => (
                                  <img
                                    className="max-h-48 w-auto rounded-lg my-1 border border-slate-200 bg-white p-1"
                                    {...props}
                                  />
                                ),
                              }}
                            >
                              {alt.texto}
                            </ReactMarkdown>
                          </div>
                          {isCorrect && (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                              Correta
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé do Modal com Botões de Ação */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={() => setEditingQuestion(null)}
                disabled={isSaving}
                className="text-xs font-bold text-slate-600"
              >
                Cancelar
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSaveQuestion}
                  disabled={isSaving}
                  className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando no Banco...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
