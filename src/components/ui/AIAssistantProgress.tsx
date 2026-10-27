"use client"

import { useState, useEffect } from "react"
import { Bot, Loader2, CheckCircle2 } from "lucide-react"

export function AIAssistantProgress() {
  const [stats, setStats] = useState({ total: 0, revisadas: 0, pendentes: 0 })
  const [isStatsLoading, setIsStatsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/questions/stats')
        const data = await res.json()
        setStats(data)
        setIsStatsLoading(false)
      } catch (e) {
        console.error(e)
        setIsStatsLoading(false)
      }
    }
    
    fetchStats()

    const interval = setInterval(() => {
      if (stats.pendentes > 0 || isStatsLoading) {
        fetchStats()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [stats.pendentes, isStatsLoading])

  if (isStatsLoading || stats.total === 0 || stats.pendentes === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-8">
      <div className="bg-slate-900 p-3 flex items-center gap-2">
        <Bot className="w-5 h-5 text-blue-400" />
        <h4 className="text-sm font-bold text-white">Revisão por IA (Markdown)</h4>
      </div>
      <div className="p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600 font-medium">Questões Formatadas</span>
          <span className="font-bold text-slate-900">{stats.revisadas} / {stats.total}</span>
        </div>
        
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(stats.revisadas / Math.max(stats.total, 1)) * 100}%` }}
          ></div>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{stats.pendentes} questões aguardando formatação...</span>
        </div>
      </div>
    </div>
  )
}
