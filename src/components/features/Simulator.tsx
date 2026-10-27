import React, { useState } from 'react';
import { Send, Bot, GraduationCap, User, Loader2 } from 'lucide-react';

const examples = [
  "Calcule a equação da diretriz da parábola y² = -16x",
  "Dada a função de lucro L(x) = x⁴ - 5x², encontre a variação",
  "Resolva a equação 2x + 5 = 15"
];

export default function Simulator() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsLoading(true);
    setShowResults(false);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Simulador: IA Comercial vs IA Pedagógica</h2>
        <p className="text-slate-500 mt-2">Teste como a abordagem muda o foco do "resultado" para o "processo reflexivo".</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setInput(ex)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border border-slate-200"
            >
              {ex}
            </button>
          ))}
        </div>
        <form onSubmit={handleSimulate} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite um problema matemático..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            <span>Simular</span>
          </button>
        </form>
      </div>

      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          {/* Coluna Esquerda: Comercial */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center gap-2">
              <Bot className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-800">IA Comercial Típica</h3>
            </div>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto bg-slate-50">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-blue-700" />
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-700 shadow-sm">
                  {input}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm text-slate-700 shadow-sm space-y-3 w-full">
                  <p>Aqui está a resposta direta para o seu problema:</p>
                  <div className="bg-slate-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                    {`Resposta final processada e formatada...
Resultado: x = -4`}
                  </div>
                  <p className="text-xs text-red-500 font-medium italic mt-2">
                    *Risco: Incentiva o "copy-paste" sem esforço cognitivo do aluno.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Pedagógica */}
          <div className="bg-white rounded-xl shadow-sm border-blue-200 flex flex-col overflow-hidden ring-1 ring-blue-100">
            <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-700" />
              <h3 className="font-semibold text-blue-900">Protótipo IA Pedagógica (BCE)</h3>
            </div>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto bg-blue-50/30">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-blue-700" />
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-700 shadow-sm">
                  {input}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-100 text-sm text-slate-700 shadow-sm space-y-3 w-full relative">
                  <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-1 rounded-bl-lg font-bold uppercase tracking-wider">
                    Arco de Maguerez
                  </div>
                  <p className="pt-2">Parece que estamos trabalhando com uma equação interessante! Em vez de te dar a resposta de imediato, vamos pensar juntos.</p>
                  <p className="font-medium text-blue-800">1. O que você acha que significa o termo principal dessa equação no mundo real?</p>
                  <div className="bg-blue-50 p-3 rounded text-xs text-blue-900 border border-blue-100">
                    <span className="font-semibold block mb-1">Dica:</span> Pense nisso como uma ponte suspensa, onde a curva nos ajuda a distribuir o peso.
                  </div>
                  <p>Qual seria o seu primeiro passo lógico para isolar a variável?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
