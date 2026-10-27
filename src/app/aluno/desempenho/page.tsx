import { BarChart2 } from "lucide-react"

export default function DesempenhoPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center h-full text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <BarChart2 className="w-10 h-10 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Meu Desempenho</h1>
      <p className="text-slate-500 max-w-md">
        Em breve! Aqui você poderá ver suas métricas de autonomia, tempo médio de resolução e quantidade de tópicos dominados.
      </p>
    </div>
  )
}
