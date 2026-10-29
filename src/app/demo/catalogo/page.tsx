"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Search, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  Target, 
  Clock, 
  Filter, 
  LayoutGrid, 
  List, 
  ArrowLeft,
  ChevronDown,
  X,
  SlidersHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MathSnippet } from "@/components/ui/MathSnippet"

export default function DemoCatalogoPage() {
  const router = useRouter()
  const [selectedProposal, setSelectedProposal] = useState<"a" | "b" | "c">("a")
  const [enemQuestions, setEnemQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filtros
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("Todos")
  const [selectedTopic, setSelectedTopic] = useState("Todos")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEnemQuestions(data)
        }
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const years = ["Todos", "1º Ano", "2º Ano", "3º Ano"]
  const rawTopics = Array.from(new Set(enemQuestions.map(q => q.topico_bncc))).sort((a, b) => a.localeCompare(b))
  const topics = ["Todos", ...rawTopics]

  // Contagem por ano
  const count1 = enemQuestions.filter(q => q.ano_ensino_medio === "1º Ano").length || 30
  const count2 = enemQuestions.filter(q => q.ano_ensino_medio === "2º Ano").length || 30
  const count3 = enemQuestions.filter(q => q.ano_ensino_medio === "3º Ano").length || 30

  // Filtragem
  const filteredQuestions = enemQuestions.filter(q => {
    const matchesYear = selectedYear === "Todos" || q.ano_ensino_medio === selectedYear
    const matchesTopic = selectedTopic === "Todos" || q.topico_bncc === selectedTopic
    const query = searchQuery.toLowerCase()
    const matchesSearch = 
      q.enunciado.toLowerCase().includes(query) || 
      q.topico_bncc.toLowerCase().includes(query) ||
      q.habilidade_enem.toLowerCase().includes(query)
    return matchesYear && matchesTopic && matchesSearch
  })

  const yearColors: Record<string, { bg: string; text: string; border: string }> = {
    "1º Ano": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200/80" },
    "2º Ano": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200/80" },
    "3º Ano": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/80" },
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16">
      
      {/* ================= BARRA SUPERIOR DO SHOWROOM ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
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
                Showroom &bull; Redesign do Catálogo BNCC
              </span>
              <span className="text-[11px] text-slate-500">
                Alterne entre as 3 propostas e teste filtros e visualizações
              </span>
            </div>
          </div>

          {/* Seletor de Proposta */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedProposal("a")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedProposal === "a"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ✨ Proposta A: Studio Explorer
            </button>

            <button
              onClick={() => setSelectedProposal("b")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedProposal === "b"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📐 Proposta B: Split com Barra Lateral
            </button>

            <button
              onClick={() => setSelectedProposal("c")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedProposal === "c"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📚 Proposta C: Módulos por Série
            </button>
          </div>

        </div>
      </header>

      {/* ================= CONTEÚDO PRINCIPAL ================= */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">

        {/* ========================================================================= */}
        {/* PROPOSTA A: STUDIO EXPLORER (BARRA SUPERIOR LIMPA, SEM BLOCO ESCURO) */}
        {/* ========================================================================= */}
        {selectedProposal === "a" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Header Clean Integrado */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Banco Curricular ENEM</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs text-slate-500 font-medium">180 Problemas Mapeados na BNCC</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Catálogo de Questões
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-light">
                    Explore problemas contextualizados e desenvolva o raciocínio matemático com o Tutor Socrático.
                  </p>
                </div>

                {/* Alternador de Visualização (Grid vs Lista) */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "grid" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                      title="Visualização em Grade"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "list" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                      title="Visualização em Lista"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Barra de Busca + Controles em Linha (Sem tag soup) */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                
                {/* Campo de Busca */}
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquise por tópico, enunciado ou código (ex: H19)..."
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Abas por Série */}
                <div className="sm:col-span-6 flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {years.map(yr => (
                    <button
                      key={yr}
                      onClick={() => setSelectedYear(yr)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        selectedYear === yr
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{yr}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedYear === yr ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                      }`}>
                        {yr === "Todos" ? enemQuestions.length || 180 : yr === "1º Ano" ? count1 : yr === "2º Ano" ? count2 : count3}
                      </span>
                    </button>
                  ))}
                </div>

              </div>

              {/* Seletor Elegante de Tópicos (Dropdown) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">Tópico BNCC:</span>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold focus:outline-none focus:border-blue-500"
                  >
                    {topics.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 text-slate-500">
                  <span>Exibindo <strong>{filteredQuestions.length}</strong> de {enemQuestions.length || 180}</span>
                  {(searchQuery || selectedYear !== "Todos" || selectedTopic !== "Todos") && (
                    <button
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedYear("Todos")
                        setSelectedTopic("Todos")
                      }}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Listagem / Grade de Questões */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredQuestions.slice(0, 18).map(q => {
                  const colors = yearColors[q.ano_ensino_medio] || yearColors["1º Ano"]
                  return (
                    <div 
                      key={q.id}
                      onClick={() => router.push(`/workspace/${q.id}`)}
                      className="group bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between cursor-pointer hover:border-blue-400 hover:shadow-md transition-all space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                            {q.ano_ensino_medio}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            ENEM {q.ano_enem}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-700 transition-colors">
                          {q.topico_bncc}
                        </h3>

                        <span className="text-[11px] font-semibold text-blue-600 block truncate">
                          {q.habilidade_enem.split("-")[0].trim()}
                        </span>

                        <MathSnippet
                          content={q.enunciado}
                          className="text-xs text-slate-600 line-clamp-3 leading-relaxed"
                        />
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-bold">
                        <span>Resolver com Malba</span>
                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* MODO LISTA */
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs divide-y divide-slate-100">
                {filteredQuestions.slice(0, 18).map(q => {
                  const colors = yearColors[q.ano_ensino_medio] || yearColors["1º Ano"]
                  return (
                    <div 
                      key={q.id}
                      onClick={() => router.push(`/workspace/${q.id}`)}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <div className="space-y-1 max-w-3xl">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                            {q.ano_ensino_medio}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">ENEM {q.ano_enem}</span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="text-[11px] font-semibold text-blue-600">{q.habilidade_enem.split("-")[0].trim()}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                          {q.topico_bncc}
                        </h4>
                        <MathSnippet
                          content={q.enunciado}
                          className="text-xs text-slate-500 line-clamp-1"
                        />
                      </div>

                      <Button variant="outline" className="text-xs font-bold h-9 px-4 rounded-xl border-slate-200 shrink-0 group-hover:border-blue-400 group-hover:text-blue-700">
                        Resolver &rarr;
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* PROPOSTA B: SPLIT COM BARRA LATERAL DE FILTROS (PROFISSIONAL / DOCENTE) */}
        {/* ========================================================================= */}
        {selectedProposal === "b" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
            
            {/* Coluna da Esquerda (4 Colunas): Painel de Filtros */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6 sticky top-20">
              
              <div>
                <h3 className="font-bold text-slate-900 text-base">Filtros da BNCC</h3>
                <p className="text-xs text-slate-500">Refine a busca por critérios curriculares</p>
              </div>

              {/* Busca */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Palavra-chave</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Função, Geometria..."
                    className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Série */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Série do Ensino Médio</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {years.map(yr => (
                    <button
                      key={yr}
                      onClick={() => setSelectedYear(yr)}
                      className={`p-2 rounded-xl text-xs font-bold text-left transition-all ${
                        selectedYear === yr
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tópico */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Área Temática</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  {topics.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400">Total: {filteredQuestions.length} questões</span>
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedYear("Todos")
                    setSelectedTopic("Todos")
                  }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Resetar
                </button>
              </div>

            </div>

            {/* Coluna da Direita (8 Colunas): Grade de Resultados */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Resultados da busca ({filteredQuestions.length})</span>
                <span>Mapeamento Oficial PIBIC</span>
              </div>

              <div className="space-y-3">
                {filteredQuestions.slice(0, 12).map(q => (
                  <div
                    key={q.id}
                    onClick={() => router.push(`/workspace/${q.id}`)}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {q.ano_ensino_medio}
                        </span>
                        <span className="text-xs font-bold text-slate-400">ENEM {q.ano_enem}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                        {q.topico_bncc}
                      </h4>
                      <MathSnippet
                        content={q.enunciado}
                        className="text-xs text-slate-500 line-clamp-2"
                      />
                    </div>

                    <Button variant="outline" className="text-xs font-semibold h-9 rounded-xl border-slate-200 shrink-0">
                      Abrir Tutor &rarr;
                    </Button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* PROPOSTA C: MÓDULOS POR SÉRIE (ESTRUTURA CURRICULAR POR ANO) */}
        {/* ========================================================================= */}
        {selectedProposal === "c" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header com Busca Simples */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Trilha Estruturada</span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Módulos Curriculares do ENEM</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-light">
                Navegue pelas 180 questões organizadas por ano escolar e nível de complexidade da BNCC.
              </p>

              <div className="relative pt-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar em todos os anos escolares..."
                  className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm shadow-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Módulos em Sanfona / Seções Claras */}
            {(["1º Ano", "2º Ano", "3º Ano"] as const).map(yr => {
              const yearQuestions = filteredQuestions.filter(q => q.ano_ensino_medio === yr)
              const colors = yearColors[yr]
              return (
                <div key={yr} className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl ${colors.bg} ${colors.text} font-black text-sm flex items-center justify-center`}>
                        {yr[0]}º
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{yr}</h3>
                        <p className="text-xs text-slate-400">
                          {yr === "1º Ano" ? "Funções, Álgebra e Proporcionalidade" : yr === "2º Ano" ? "Geometria Espacial e Trigonometria" : "Estatística e Análise de Dados"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {yearQuestions.length} questões disponíveis
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {yearQuestions.slice(0, 6).map(q => (
                      <div
                        key={q.id}
                        onClick={() => router.push(`/workspace/${q.id}`)}
                        className="p-4 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer group space-y-2"
                      >
                        <span className="text-[10px] font-bold text-slate-400 uppercase">ENEM {q.ano_enem}</span>
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors line-clamp-1">
                          {q.topico_bncc}
                        </h4>
                        <MathSnippet
                          content={q.enunciado}
                          className="text-xs text-slate-500 line-clamp-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

          </div>
        )}

      </main>

    </div>
  )
}
