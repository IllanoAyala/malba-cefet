"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Input } from "@/components/ui/input"
import { 
  Send, 
  Bot, 
  AlertCircle, 
  CheckCircle2, 
  ChevronLeft, 
  Loader2, 
  ArrowRight, 
  Flag, 
  X, 
  PlayCircle, 
  Sparkles, 
  ExternalLink, 
  Landmark, 
  Award, 
  FileText,
  HelpCircle,
  Calculator
} from "lucide-react"
import { getModuleForTopic } from "@/data/studyMaterials"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

function normalizeMathContent(text?: string | null): string {
  if (!text) return ""
  return text
    .replace(/\\hexagon\b/g, "\\text{⬡}")
    .replace(/\\varhexagon\b/g, "\\text{⬢}")
    .replace(/\\pentagon\b/g, "\\text{⬠}")
    .replace(/\\\((.*?)\\\)/g, '$$$1$$')
    .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$')
}

export default function WorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string
  
  const [question, setQuestion] = useState<any>(null)
  const [allQuestions, setAllQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isChatLoading, setIsChatLoading] = useState(false)
  
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [reportText, setReportText] = useState('')
  const [isReporting, setIsReporting] = useState(false)
  const [reportSuccess, setReportSuccess] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [videoModalSource, setVideoModalSource] = useState<"gtmat" | "secondary">("gtmat")

  const { 
    chatHistory, 
    addChatMessage,
    updateLastMessage,
    currentSocraticStep,
    advanceSocraticStep,
    setCurrentQuestionId,
    solvedQuestionIds,
    markQuestionResult,
  } = useAppStore()

  const socraticStepLabels = [
    "1. Observação da Realidade",
    "2. Pontos-Chave",
    "3. Teorização",
    "4. Hipóteses de Solução",
    "5. Aplicação à Realidade"
  ]

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'none' | 'success' | 'error'>('none')
  const [inputValue, setInputValue] = useState("")
  const [mobileTab, setMobileTab] = useState<"question" | "chat">("question")
  const [showMathHelp, setShowMathHelp] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const insertSymbol = (symbol: string) => {
    const input = inputRef.current
    if (!input) {
      setInputValue(prev => prev + symbol)
      return
    }

    const start = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? input.value.length
    const textBefore = inputValue.substring(0, start)
    const textAfter = inputValue.substring(end)

    if (symbol === "( )") {
      const newText = `${textBefore}()${textAfter}`
      setInputValue(newText)
      setTimeout(() => {
        input.focus()
        input.setSelectionRange(start + 1, start + 1)
      }, 10)
    } else {
      const newText = `${textBefore}${symbol}${textAfter}`
      setInputValue(newText)
      setTimeout(() => {
        input.focus()
        const newPos = start + symbol.length
        input.setSelectionRange(newPos, newPos)
      }, 10)
    }
  }
  
  // Telemetry States
  const [startTime] = useState<number>(Date.now())
  const [hintsRequested, setHintsRequested] = useState(0)
  const [hasSentTelemetry, setHasSentTelemetry] = useState(false)
  const [hasSentFeedback, setHasSentFeedback] = useState(false)
  const [difficultyRating, setDifficultyRating] = useState<number | null>(null)
  const [sessionId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const existing = window.sessionStorage.getItem("malba_session_id")
      if (existing) return existing
      const generated = `sess_${Math.random().toString(36).substring(2, 10)}`
      window.sessionStorage.setItem("malba_session_id", generated)
      return generated
    }
    return "session_web"
  })

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        setAllQuestions(data)
        const found = data.find((q: any) => q.id === questionId)
        setQuestion(found)
        setIsLoading(false)
        
        if (found) {
          setCurrentQuestionId(found.id)
          // Rastreia início da resolução para o histórico docente
          fetch("/api/activity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "event",
              type: "question_open",
              target: found.id,
              meta: {
                topico_bncc: found.topico_bncc,
                ano_enem: found.ano_enem,
                ano_ensino_medio: found.ano_ensino_medio,
              },
            }),
          }).catch(() => {})

          // Avoid duplicate greetings on remounts if history is already populated
          if (chatHistory.length === 0) {
            addChatMessage({
              role: 'tutor',
              content: `Olá! Sou o Malba. Vamos resolver essa questão de ${found.topico_bncc} juntos? Leia o enunciado e tente escolher uma alternativa. Se precisar de ajuda, estou aqui!`
            })
          }
        }
      })
  }, [questionId])

  if (isLoading) return (
    <div className="flex-1 flex flex-col items-center justify-center p-20">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
      <p className="text-slate-500 font-medium">Carregando ambiente de resolução...</p>
    </div>
  )

  if (!question) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-auto space-y-4">
      <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Conteúdo Não Disponível</h2>
      <p className="text-xs text-slate-600 leading-relaxed">
        Esta questão não foi encontrada ou faz parte do currículo de uma série mais avançada que ainda não foi liberada para o seu perfil discente.
      </p>
      <Button
        variant="blue"
        onClick={() => router.push("/explorador")}
        className="rounded-xl text-xs font-bold"
      >
        Voltar ao Catálogo Liberado
      </Button>
    </div>
  )

  const sendTelemetry = async (isCorrect: boolean) => {
    if (hasSentTelemetry) return;
    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          sessionId,
          timeSpentMs: Date.now() - startTime,
          hintsRequested,
          isCorrect,
          aiModeUsed: 'socratic'
        })
      })

      fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'event',
          type: 'question_answer',
          target: questionId,
          meta: {
            isCorrect,
            timeSpentMs: Date.now() - startTime,
            hintsRequested,
            selectedOption,
            topico_bncc: question.topico_bncc,
          }
        })
      }).catch(() => {})

      setHasSentTelemetry(true)
    } catch (e) {
      console.error(e)
    }
  }

  const sendStudentFeedback = async (feeling: string, rating: number) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          sessionId,
          feeling,
          difficultyRating: rating
        })
      })
      setHasSentFeedback(true)
    } catch (e) {
      console.error(e)
    }
  }

  const callAI = async (messagesToSend: any[], optionOverride?: string | null) => {
    setIsChatLoading(true)
    setHintsRequested(prev => prev + 1)
    
    // Add empty message for streaming
    addChatMessage({ role: 'tutor', content: '' })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesToSend.filter(m => m.role !== 'system'),
          currentSocraticStep,
          questionContext: question.enunciado,
          sessionId,
          questionData: {
            enunciado: question.enunciado,
            topicoBncc: question.topico_bncc,
            habilidadeEnem: question.habilidade_enem,
            alternativas: question.alternativas,
            alternativaCorreta: question.alternativa_correta,
            dicasSocraticas: question.dicas_socraticas,
            selectedOption: optionOverride !== undefined ? optionOverride : selectedOption,
          }
        })
      })

      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        updateLastMessage(fullText)
      }

    } catch (e) {
      updateLastMessage("Desculpe, ocorreu um erro de conexão com a IA.")
    } finally {
      setIsChatLoading(false)
    }
  }

  const studyModule = getModuleForTopic(question?.topico_bncc)
  const isAlreadySolved = solvedQuestionIds.includes(String(question?.id))

  const handleConfirm = () => {
    if (!selectedOption) return
    
    if (selectedOption === question.alternativa_correta) {
      setFeedback('success')
      markQuestionResult(String(question.id), true)
      sendTelemetry(true)
    } else {
      setFeedback('error')
      markQuestionResult(String(question.id), false)
      sendTelemetry(false)
      setMobileTab('chat')
      
      addChatMessage({
        role: 'system',
        content: `Alternativa ${selectedOption} incorreta • Tutor Socrático acionado`
      })
      
      const chosenAlt = Array.isArray(question.alternativas)
        ? question.alternativas.find((a: any) => a.letra === selectedOption)
        : null
      const userPrompt = chosenAlt
        ? `Marquei a alternativa ${selectedOption} (${chosenAlt.texto}), mas estava incorreta. Pode me ajudar a entender por onde começar?`
        : `Marquei a alternativa ${selectedOption}, mas estava incorreta. Pode me dar a primeira dica?`

      addChatMessage({ role: 'user', content: userPrompt })
      const newMessages = [...chatHistory, { role: 'user', content: userPrompt }]
      callAI(newMessages, selectedOption)
      advanceSocraticStep()
    }
  }

  const sendUserText = async (textToSend: string) => {
    const trimmed = textToSend.trim()
    if (!trimmed || isChatLoading) return

    setInputValue("")
    addChatMessage({ role: 'user', content: trimmed })
    const newMessages = [...chatHistory, { role: 'user', content: trimmed }]

    await callAI(newMessages)
    advanceSocraticStep()
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    await sendUserText(inputValue)
  }

  const quickReplies = [
    "Quais são os dados principais?",
    "Qual conceito ou fórmula usar?",
    "Não entendi o enunciado, pode simplificar?"
  ]

  const handleQuickReply = (text: string) => {
    sendUserText(text)
  }

  const handleNextQuestion = () => {
    const currentIndex = allQuestions.findIndex(q => q.id === questionId)
    if (currentIndex !== -1 && currentIndex < allQuestions.length - 1) {
      const nextQ = allQuestions[currentIndex + 1]
      router.push(`/workspace/${nextQ.id}`)
    } else {
      router.push('/explorador') // Default se for a última
    }
  }

  const handleReport = async () => {
    if (!reportText.trim()) return
    setIsReporting(true)
    try {
      await fetch(`/api/questions/${questionId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: reportText })
      })
      setReportSuccess(true)
      setTimeout(() => {
        setIsReportOpen(false)
        setReportSuccess(false)
        setReportText('')
      }, 2000)
    } catch (e) {
      console.error(e)
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden">
      
      {/* SELETOR DE ABAS MOBILE (EXCLUSIVO TELAS MENORES QUE LG) */}
      <div className="lg:hidden flex items-center bg-white border-b border-slate-200 p-2 gap-1.5 shrink-0 z-20 shadow-xs">
        <button
          type="button"
          onClick={() => setMobileTab("question")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === "question"
              ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>Questão & Alternativas</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("chat")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 relative ${
            mobileTab === "chat"
              ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>Tutor Socrático</span>
          {chatHistory.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          )}
        </button>
      </div>

      {/* LEFT PANEL - QUESTION */}
      <div className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 border-r bg-white ${
        mobileTab !== "question" ? "hidden lg:block" : "block"
      }`}>
        <Button variant="ghost" className="mb-6 -ml-4 text-slate-500" onClick={() => router.push('/explorador')}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Voltar ao Explorador
        </Button>

        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">ENEM {question.ano_enem}</Badge>
            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200">{question.ano_ensino_medio}</Badge>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200">{question.topico_bncc}</Badge>
            {isAlreadySolved && (
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Dominada
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="text-blue-700 border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-xs font-bold"
              onClick={() => setIsVideoModalOpen(true)}
            >
              <PlayCircle className="w-3.5 h-3.5 mr-1 text-red-500" />
              <span>Videoaula &amp; Fórmulas</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0" onClick={() => setIsReportOpen(true)}>
              <Flag className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Reportar Erro</span>
            </Button>
          </div>
        </div>

        {isReportOpen && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-400 hover:bg-red-100 hover:text-red-600" onClick={() => setIsReportOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
            <h4 className="font-semibold text-red-800 flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" /> Relatar problema na questão
            </h4>
            <p className="text-sm text-red-600/80 mb-3">Encontrou algum erro de digitação, alternativa quebrada ou erro no gabarito?</p>
            {reportSuccess ? (
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium p-2 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-4 h-4" /> Obrigado! O erro foi reportado e será corrigido.
              </div>
            ) : (
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex: Alternativa A está ilegível" 
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  className="bg-white border-red-200 focus-visible:ring-red-500"
                />
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white" 
                  onClick={handleReport}
                  disabled={isReporting || !reportText.trim()}
                >
                  {isReporting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar'}
                </Button>
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-slate-500 mb-6 font-medium">{question.habilidade_enem}</p>
        
        <div className="prose max-w-none mb-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[[rehypeKatex, { strict: false }]]}
            components={{
              img: ({node, ...props}) => <img className="max-w-full rounded-xl my-6 shadow-sm border border-slate-200" {...props} />,
              p: ({node, ...props}) => <p className="text-lg leading-relaxed text-slate-800 mb-4" {...props} />,
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-6 not-prose">
                  <table className="min-w-full border-collapse border border-slate-200 rounded-xl overflow-hidden shadow-xs text-sm sm:text-base bg-white" {...props} />
                </div>
              ),
              thead: ({node, ...props}) => <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-800" {...props} />,
              th: ({node, ...props}) => <th className="px-4 py-2.5 text-center font-bold text-slate-700 border-r border-slate-200 last:border-r-0" {...props} />,
              td: ({node, ...props}) => <td className="px-4 py-2 text-center text-slate-700 border-b border-r border-slate-100 last:border-r-0" {...props} />
            }}
          >
            {normalizeMathContent(question.enunciado)}
          </ReactMarkdown>
        </div>

        <div className="space-y-3 mb-8">
          {question.alternativas.map((alt: any) => (
            <label 
              key={alt.letra}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${selectedOption === alt.letra ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}
                ${feedback === 'success' && alt.letra === question.alternativa_correta ? 'border-emerald-500 bg-emerald-50' : ''}
                ${feedback === 'error' && selectedOption === alt.letra ? 'border-red-500 bg-red-50' : ''}
              `}
            >
              <input 
                type="radio" 
                name="alternativa" 
                value={alt.letra}
                checked={selectedOption === alt.letra}
                onChange={() => {
                  setSelectedOption(alt.letra)
                  setFeedback('none')
                }}
                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                disabled={feedback === 'success'}
              />
              <div className="flex-1 flex gap-2">
                <span className="font-bold text-slate-700">{alt.letra})</span>
                <span className="text-slate-700 w-full prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[[rehypeKatex, { strict: false }]]}
                    components={{
                      p: ({node, ...props}) => <span {...props} />,
                      img: ({node, ...props}) => <img className="max-h-60 w-auto rounded-lg my-1 border border-slate-200 bg-white p-1.5 shadow-2xs" {...props} />
                    }}
                  >
                    {normalizeMathContent(alt.texto)}
                  </ReactMarkdown>
                </span>
              </div>
            </label>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button 
            variant="blue" 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={handleConfirm}
            disabled={!selectedOption || feedback === 'success'}
          >
            Confirmar Resposta
          </Button>

          {feedback === 'success' && hasSentFeedback && (
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto border-emerald-600 text-emerald-700 hover:bg-emerald-50 shrink-0" 
              onClick={handleNextQuestion}
            >
              Próxima Questão <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {feedback === 'success' && (
          <div className="mt-6 p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <p className="font-bold text-lg">Resposta Correta! Parabéns!</p>
                <p className="text-sm">Você conseguiu resolver com autonomia.</p>
              </div>
            </div>
            {hasSentFeedback && (
              <div className="pt-4 border-t border-emerald-200/50">
                <p className="text-sm text-emerald-700 font-medium">Obrigado pelo seu feedback! Seus dados ajudam na pesquisa do PIBIC.</p>
              </div>
            )}
          </div>
        )}
        
        {/* MODAL DE FEEDBACK CENTRALIZADO */}
        {feedback === 'success' && !hasSentFeedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">Parabéns pelo acerto!</h3>
              <p className="text-slate-500 text-center text-sm mb-8">
                Para nossa pesquisa (PIBIC), em uma escala de 0 a 5, o quanto o Tutor Socrático te ajudou a resolver essa questão?
              </p>
              
              <div className="flex justify-center gap-2 sm:gap-3 mb-2">
                {[0, 1, 2, 3, 4, 5].map(num => (
                  <button 
                    key={num}
                    onClick={() => setDifficultyRating(num)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-lg transition-all flex items-center justify-center
                      ${difficultyRating === num 
                        ? 'bg-blue-600 text-white ring-4 ring-blue-600/20 scale-110' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between text-xs font-medium text-slate-400 mb-8 px-2">
                <span>0 - Não ajudou</span>
                <span>5 - Ajudou muito</span>
              </div>
              
              <Button 
                variant="blue" 
                className="w-full" 
                size="lg"
                disabled={difficultyRating === null}
                onClick={() => sendStudentFeedback('avaliado_escala', difficultyRating!)}
              >
                Enviar Avaliação
              </Button>
            </div>
          </div>
        )}
        
        {feedback === 'error' && (
          <div className="mt-6 p-4 bg-red-50 text-red-800 border border-red-100 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-bold">Resposta Incorreta.</p>
              <p className="text-sm">O Tutor Socrático foi ativado para ajudar você a identificar o erro.</p>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL - TUTOR CHAT */}
      <div className={`w-full lg:w-[450px] shrink-0 flex flex-col bg-slate-50 border-l border-slate-200 h-full ${
        mobileTab !== "chat" ? "hidden lg:flex" : "flex flex-1"
      }`}>
        <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Tutor Malba</h2>
              <p className="text-[11px] text-blue-600 font-semibold">
                {socraticStepLabels[Math.min(currentSocraticStep, 4)]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1" title="Progresso no Arco de Maguerez">
            {[0, 1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === Math.min(currentSocraticStep, 4)
                    ? "w-4 bg-blue-600"
                    : step < currentSocraticStep
                    ? "w-2 bg-blue-300"
                    : "w-1.5 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* PONTE DIRETA PARA VIDEOAULA & FÓRMULAS (DESTAQUE NA ETAPA 3: TEORIZAÇÃO OU APÓS ERRO) */}
        <div
          className={`px-4 py-2.5 border-b flex items-center justify-between gap-2 transition-colors ${
            currentSocraticStep >= 2 || feedback === "error"
              ? "bg-indigo-50/90 border-indigo-200/80"
              : "bg-slate-100/80 border-slate-200/70"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <PlayCircle
              className={`w-4 h-4 shrink-0 ${
                currentSocraticStep >= 2 || feedback === "error" ? "text-red-600 animate-pulse" : "text-red-500"
              }`}
            />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-800 truncate">
                {currentSocraticStep >= 2
                  ? `Etapa de Teorização: ${studyModule.title}`
                  : `Base Teórica: ${studyModule.title}`}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {studyModule.channelName} &bull; {studyModule.duration} + Cola de Fórmulas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsVideoModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold shrink-0 shadow-2xs transition-colors cursor-pointer"
          >
            Ver Aula &amp; Fórmulas
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${msg.role === 'system' ? 'justify-center' : ''}`}
            >
              {msg.role === 'system' ? (
                <div className="bg-slate-200 text-slate-600 text-xs py-1 px-3 rounded-full my-2">
                  {msg.content}
                </div>
              ) : (
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm prose prose-sm max-w-none
                    ${msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none prose-p:text-white prose-strong:text-white prose-a:text-white' 
                      : 'bg-white border text-slate-800 shadow-sm rounded-bl-none prose-p:text-slate-800 prose-strong:text-slate-800'
                    }
                  `}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[[rehypeKatex, { strict: false }]]}
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />
                    }}
                  >
                    {normalizeMathContent(msg.content)}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}
          {isChatLoading && (
            <div className="flex justify-start">
               <div className="bg-white border text-slate-800 shadow-sm rounded-2xl rounded-bl-none px-4 py-3 text-sm flex gap-1 items-center">
                 <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                 <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
               </div>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 bg-white border-t space-y-2.5">
          {/* Dicas Rápidas de Resposta */}
          <div className="flex flex-wrap gap-1.5">
            {quickReplies.map((qr) => (
              <button
                key={qr}
                onClick={() => handleQuickReply(qr)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full transition-colors whitespace-nowrap"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Barra de Símbolos Matemáticos & Guia de Digitação */}
          <div className="flex items-center justify-between gap-1 pt-0.5 border-t border-slate-100">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                <Calculator className="w-3 h-3 text-blue-600" /> Símbolos:
              </span>
              {[
                { label: '√', val: '√' },
                { label: 'x²', val: '²' },
                { label: 'x³', val: '³' },
                { label: '^', val: '^' },
                { label: 'π', val: 'π' },
                { label: '·', val: '·' },
                { label: '/', val: '/' },
                { label: '≤', val: '≤' },
                { label: '≥', val: '≥' },
                { label: '( )', val: '( )' },
              ].map((sym) => (
                <button
                  key={sym.label}
                  type="button"
                  onClick={() => insertSymbol(sym.val)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 text-xs font-mono font-bold transition-colors cursor-pointer shrink-0"
                  title={`Inserir ${sym.label}`}
                >
                  {sym.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowMathHelp(prev => !prev)}
              className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
              title="Ajuda sobre como digitar fórmulas"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Como digitar?</span>
            </button>
          </div>

          {/* Dica Expansível de Notação Matemática */}
          {showMathHelp && (
            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-slate-700 space-y-1 animate-in fade-in duration-150">
              <div className="flex items-center justify-between font-bold text-blue-900">
                <span>💡 Como digitar expressões para o Malba:</span>
                <button 
                  onClick={() => setShowMathHelp(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-0.5 text-slate-600 pt-0.5">
                <li>&bull; <strong>Raiz:</strong> use <code className="bg-white px-1 rounded text-blue-800">√3</code> ou <code className="bg-white px-1 rounded text-blue-800">sqrt(3)</code></li>
                <li>&bull; <strong>Potência:</strong> use <code className="bg-white px-1 rounded text-blue-800">k²</code> ou <code className="bg-white px-1 rounded text-blue-800">k^2</code></li>
                <li>&bull; <strong>Fração:</strong> use parênteses, ex.: <code className="bg-white px-1 rounded text-blue-800">(√3·k²)/4</code></li>
                <li>&bull; <strong>Multiplicação:</strong> use <code className="bg-white px-1 rounded text-blue-800">·</code> ou <code className="bg-white px-1 rounded text-blue-800">*</code></li>
              </ul>
              <p className="text-[10px] text-slate-500 italic pt-0.5">
                O tutor compreende qualquer uma dessas notações normais e orientará caso haja alguma ambiguidade!
              </p>
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input 
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua resposta ou sua dúvida..."
              className="flex-1"
              disabled={isChatLoading}
            />
            <Button type="submit" size="icon" variant="blue" disabled={!inputValue.trim() || isChatLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* MODAL INLINE DE TEORIZAÇÃO (VIDEOAULA YOUTUBE + COLA DE FÓRMULAS) */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <PlayCircle className="w-5 h-5 text-red-600" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                    Etapa 3 do Arco de Maguerez &bull; Apoio de Teorização
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {studyModule.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Seletor Mídia Principal (GTMAT CEFET-MG) vs Mídia Secundária */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                <div className="inline-flex rounded-lg bg-slate-200/70 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setVideoModalSource("gtmat")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      videoModalSource === "gtmat"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5" />
                    <span>Mídia Principal: GTMAT CEFET-MG</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoModalSource("secondary")}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      videoModalSource === "secondary"
                        ? "bg-slate-800 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Mídia Secundária: Revisão Rápida</span>
                  </button>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 px-2">
                  {videoModalSource === "gtmat"
                    ? `${studyModule.channelName} • ${studyModule.duration}`
                    : `${studyModule.secondaryChannelName} • ${studyModule.secondaryDuration}`}
                </span>
              </div>

              {/* Player YouTube */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-sm">
                <iframe
                  key={videoModalSource === "gtmat" ? studyModule.videoId : studyModule.secondaryVideoId}
                  src={`https://www.youtube.com/embed/${
                    videoModalSource === "gtmat" ? studyModule.videoId : studyModule.secondaryVideoId
                  }?rel=0`}
                  title={
                    videoModalSource === "gtmat" ? studyModule.videoTitle : studyModule.secondaryVideoTitle
                  }
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Links Diretos GTMAT CEFET-MG & Apostila OBMEP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={studyModule.gtmatUnitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 flex items-center justify-between gap-2 transition-colors group"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                      <Landmark className="w-3 h-3" /> GTMAT CEFET-MG
                    </span>
                    <p className="text-xs font-bold text-slate-800 truncate mt-0.5">
                      {studyModule.gtmatUnitTitle}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Texto [CONT] &bull; Exercícios [EXE] &bull; Resoluções [EXRES]
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href={studyModule.obmepApostila.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 flex items-center justify-between gap-2 transition-colors group"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                      <Award className="w-3 h-3" /> {studyModule.obmepApostila.number} (PDF)
                    </span>
                    <p className="text-xs font-bold text-slate-800 truncate mt-0.5">
                      {studyModule.obmepApostila.title}
                    </p>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {studyModule.obmepApostila.focus}
                    </span>
                  </div>
                  <FileText className="w-4 h-4 text-amber-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Cola de Fórmulas do Tópico */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Cola de Bolso &bull; Fórmulas deste Tema</span>
                  </span>
                  <a
                    href={studyModule.playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Mais vídeos no YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {studyModule.formulas.map((f, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-blue-700 uppercase block">
                        {f.label}
                      </span>
                      <div className="p-2 bg-white rounded-lg border border-slate-200/60 text-center text-xs font-semibold text-slate-900 overflow-x-auto">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[[rehypeKatex, { strict: false }]]}
                          components={{ p: ({ node, ...props }) => <span {...props} /> }}
                        >
                          {normalizeMathContent(f.formula)}
                        </ReactMarkdown>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[[rehypeKatex, { strict: false }]]}
                          components={{ p: ({ node, ...props }) => <span {...props} /> }}
                        >
                          {normalizeMathContent(f.tip)}
                        </ReactMarkdown>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/materias?module=${studyModule.id}`)}
                  className="text-xs font-bold text-slate-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Abrir módulo completo na aba Matérias</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <Button
                  variant="blue"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="text-xs font-bold h-9 px-5 rounded-xl"
                >
                  Voltar para a Questão
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
