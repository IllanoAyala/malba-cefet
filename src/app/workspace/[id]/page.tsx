"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Input } from "@/components/ui/input"
import { Send, Bot, AlertCircle, CheckCircle2, ChevronLeft, Loader2, ArrowRight, Flag, X } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

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

  const { 
    chatHistory, 
    addChatMessage,
    updateLastMessage,
    currentSocraticStep,
    advanceSocraticStep,
    setCurrentQuestionId,
    tokenUsage,
    addTokenUsage
  } = useAppStore()

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'none' | 'success' | 'error'>('none')
  const [inputValue, setInputValue] = useState("")
  const [mobileTab, setMobileTab] = useState<"question" | "chat">("question")
  
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

  if (!question) return <div className="p-8">Questão não encontrada.</div>

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

  const callAI = async (messagesToSend: any[]) => {
    setIsChatLoading(true)
    setHintsRequested(prev => prev + 1)
    
    // Add empty message for streaming
    addChatMessage({ role: 'tutor', content: '' })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesToSend.filter(m => m.role !== 'system'), // Omit system messages
          currentSocraticStep,
          questionContext: question.enunciado
        })
      })

      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ""
      let detectedUsage = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        
        // Verifica se a tag oculta de uso de tokens chegou no final do stream
        if (fullText.includes('__TOKENS:')) {
          const match = fullText.match(/__TOKENS:(\d+)__/);
          if (match) {
            detectedUsage = parseInt(match[1], 10);
            fullText = fullText.replace(match[0], ""); // Remove a tag do texto visível
          }
        }

        updateLastMessage(fullText)
      }

      // Adicionar o uso exato cobrado pela API
      if (detectedUsage > 0) {
        addTokenUsage(detectedUsage);
      }

    } catch (e) {
      updateLastMessage("Desculpe, ocorreu um erro de conexão com a IA.")
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleConfirm = () => {
    if (!selectedOption) return
    
    if (selectedOption === question.alternativa_correta) {
      setFeedback('success')
      sendTelemetry(true)
    } else {
      setFeedback('error')
      sendTelemetry(false)
      setMobileTab('chat')
      
      addChatMessage({
        role: 'system',
        content: 'O aluno errou a alternativa. O Tutor Socrático foi acionado.'
      })
      
      const newMessages = [...chatHistory, { role: 'user', content: 'Errei a alternativa. Não entendi bem, pode me dar a primeira dica?' }]
      callAI(newMessages)
      advanceSocraticStep()
    }
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputValue.trim() || isChatLoading) return
    
    const userMsg = inputValue
    setInputValue("")
    
    addChatMessage({ role: 'user', content: userMsg })
    const newMessages = [...chatHistory, { role: 'user', content: userMsg }]
    
    await callAI(newMessages)
    advanceSocraticStep()
  }

  const quickReplies = [
    "Dica sobre os dados",
    "Qual fórmula usar?",
    "Não entendi o enunciado"
  ]

  const handleQuickReply = (text: string) => {
    setInputValue(text)
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent
      handleSendMessage(fakeEvent)
    }, 50)
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
          </div>
          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0" onClick={() => setIsReportOpen(true)}>
            <Flag className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Reportar Erro</span>
          </Button>
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
            rehypePlugins={[rehypeKatex]}
            components={{
              img: ({node, ...props}) => <img className="max-w-full rounded-xl my-6 shadow-sm border border-slate-200" {...props} />,
              p: ({node, ...props}) => <p className="text-lg leading-relaxed text-slate-800 mb-4" {...props} />
            }}
          >
            {question.enunciado}
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
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p: ({node, ...props}) => <span {...props} />
                    }}
                  >
                    {alt.texto}
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
        
        {/* BARRA DE TOKENS PROVISÓRIA */}
        <div className="px-4 py-2 bg-slate-100 border-b flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Uso de Tokens (Groq Free)</span>
            <span>{tokenUsage.toLocaleString('pt-BR')} / 100.000 TPD</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((tokenUsage / 100000) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="font-bold text-slate-800">Tutor Malba</h2>
              <p className="text-xs text-slate-500">Modo Socrático</p>
            </div>
          </div>
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
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                    }}
                  >
                    {msg.content}
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

        <div className="p-4 bg-white border-t">
          <div className="flex flex-wrap gap-2 pb-3">
            {quickReplies.map((qr) => (
              <button
                key={qr}
                onClick={() => handleQuickReply(qr)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full transition-colors whitespace-nowrap"
              >
                {qr}
              </button>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1"
              disabled={isChatLoading}
            />
            <Button type="submit" size="icon" variant="blue" disabled={!inputValue.trim() || isChatLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
