mkdir -p src/app/workspace/[id]

cat << 'PAGE_C_EOF' > src/app/workspace/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { enemQuestions } from "@/data/enem-questions"
import { useAppStore } from "@/store/useAppStore"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Input } from "@/components/ui/input"
import { Send, Bot, AlertCircle, CheckCircle2, ChevronLeft } from "lucide-react"

export default function WorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string
  
  const question = enemQuestions.find(q => q.id === questionId)
  
  const { 
    isSocraticMode, 
    setSocraticMode, 
    chatHistory, 
    addChatMessage, 
    currentSocraticStep,
    advanceSocraticStep,
    setCurrentQuestionId 
  } = useAppStore()

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'none' | 'success' | 'error'>('none')
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (question) {
      setCurrentQuestionId(question.id)
      // Initial greeting
      addChatMessage({
        role: 'tutor',
        content: \`Olá! Sou o MathAI. Vamos resolver essa questão de \${question.topico_bncc} juntos? Leia o enunciado e tente escolher uma alternativa. Se precisar de ajuda, estou aqui!\`
      })
    }
  }, [questionId])

  if (!question) return <div className="p-8">Questão não encontrada.</div>

  const handleConfirm = () => {
    if (!selectedOption) return
    
    if (selectedOption === question.alternativa_correta) {
      setFeedback('success')
    } else {
      setFeedback('error')
      
      // Trigger tutor intervention on error
      if (isSocraticMode) {
        addChatMessage({
          role: 'system',
          content: 'O aluno errou a alternativa. Iniciando intervenção socrática (Arco de Maguerez).'
        })
        setTimeout(() => {
          addChatMessage({
            role: 'tutor',
            content: question.dicas_socraticas_arco[currentSocraticStep]
          })
          advanceSocraticStep()
        }, 1000)
      }
    }
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputValue.trim()) return
    
    addChatMessage({ role: 'user', content: inputValue })
    setInputValue("")
    
    setTimeout(() => {
      if (!isSocraticMode) {
        // Comercial AI Behavior
        addChatMessage({
          role: 'tutor',
          content: \`Aqui está a resposta completa: A alternativa correta é a \${question.alternativa_correta}. Para resolver, você deve calcular os valores e aplicar a fórmula direta. [Cálculos completos simulados].\`
        })
      } else {
        // Socratic Tutor Behavior
        addChatMessage({
          role: 'tutor',
          content: question.dicas_socraticas_arco[currentSocraticStep] || "Muito bem, continue raciocinando por esse caminho. O que mais você pode deduzir?"
        })
        advanceSocraticStep()
      }
    }, 800)
  }

  const quickReplies = [
    "Dica sobre os dados",
    "Qual fórmula usar?",
    "Não entendi o enunciado"
  ]

  const handleQuickReply = (text: string) => {
    setInputValue(text)
    setTimeout(() => handleSendMessage(), 100)
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden">
      
      {/* LEFT PANEL - QUESTION */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 border-r bg-white">
        <Button variant="ghost" className="mb-6 -ml-4 text-slate-500" onClick={() => router.push('/explorador')}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Voltar ao Explorador
        </Button>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">ENEM {question.ano_enem}</Badge>
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200">{question.ano_ensino_medio}</Badge>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">{question.topico_bncc}</Badge>
        </div>

        <p className="text-sm text-slate-500 mb-6 font-medium">{question.habilidade_enem}</p>
        
        <div className="prose max-w-none mb-8">
          <p className="text-lg leading-relaxed text-slate-800">{question.enunciado}</p>
        </div>

        <div className="space-y-3 mb-8">
          {question.alternativas.map((alt) => (
            <label 
              key={alt.letra}
              className={\`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                \${selectedOption === alt.letra ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}
                \${feedback === 'success' && alt.letra === question.alternativa_correta ? 'border-emerald-500 bg-emerald-50' : ''}
                \${feedback === 'error' && selectedOption === alt.letra ? 'border-red-500 bg-red-50' : ''}
              \`}
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
              <div className="flex-1">
                <span className="font-bold mr-2 text-slate-700">{alt.letra})</span>
                <span className="text-slate-700">{alt.texto}</span>
              </div>
            </label>
          ))}
        </div>

        <Button 
          variant="blue" 
          size="lg" 
          className="w-full md:w-auto"
          onClick={handleConfirm}
          disabled={!selectedOption || feedback === 'success'}
        >
          Confirmar Resposta
        </Button>

        {feedback === 'success' && (
          <div className="mt-6 p-4 bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <div>
              <p className="font-bold">Resposta Correta! Parabéns!</p>
              <p className="text-sm">Você conseguiu resolver com autonomia.</p>
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
      <div className="w-full lg:w-[450px] shrink-0 flex flex-col bg-slate-50 border-l border-slate-200">
        <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-2">
            <Bot className={\`w-6 h-6 \${isSocraticMode ? 'text-blue-600' : 'text-slate-400'}\`} />
            <div>
              <h2 className="font-bold text-slate-800">Tutor MathAI</h2>
              <p className="text-xs text-slate-500">{isSocraticMode ? 'Modo Socrático' : 'Modo IA Comercial'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">IA Comercial</span>
            <Toggle checked={isSocraticMode} onCheckedChange={setSocraticMode} />
            <span className="text-xs font-medium text-blue-700">Tutor</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, idx) => (
            <div 
              key={idx} 
              className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'} \${msg.role === 'system' ? 'justify-center' : ''}\`}
            >
              {msg.role === 'system' ? (
                <div className="bg-slate-200 text-slate-600 text-xs py-1 px-3 rounded-full my-2">
                  {msg.content}
                </div>
              ) : (
                <div 
                  className={\`max-w-[85%] rounded-2xl px-4 py-3 text-sm
                    \${msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white border text-slate-800 shadow-sm rounded-bl-none'
                    }
                  \`}
                >
                  {msg.content}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t">
          {isSocraticMode && (
            <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar">
              {quickReplies.map((qr) => (
                <button
                  key={qr}
                  onClick={() => handleQuickReply(qr)}
                  className="whitespace-nowrap px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="blue" disabled={!inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

    </div>
  )
}
PAGE_C_EOF
