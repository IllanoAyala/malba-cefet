import { BookMarked } from "lucide-react"

export default function CadernoPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center h-full text-center">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
        <BookMarked className="w-10 h-10 text-amber-600" />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Caderno de Revisão</h1>
      <p className="text-slate-500 max-w-md">
        Em breve! Você terá acesso ao seu histórico de erros e conversas com o Tutor Socrático para revisar os conceitos que teve mais dificuldade.
      </p>
    </div>
  )
}
