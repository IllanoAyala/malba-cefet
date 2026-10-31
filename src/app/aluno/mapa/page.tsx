import { Map } from "lucide-react"

export default function MapaPage() {
  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center pb-24 md:pb-8">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
        <Map className="w-10 h-10 text-emerald-600" />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Mapa de Habilidades</h1>
      <p className="text-slate-500 max-w-md">
        Em breve! Navegue pela sua árvore de conhecimento (Competências e Habilidades do ENEM e da BNCC).
      </p>
    </div>
  )
}
