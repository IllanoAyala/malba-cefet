"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useAppStore } from "@/store/useAppStore"

/**
 * Sincroniza o usuário autenticado com o estado global da aplicação.
 * Garante que cada discente tenha um sessionStorage isolado e que
 * o progresso de questões e resoluções pertença unicamente à sua matrícula.
 */
export function SessionSync() {
  const { data: session, status } = useSession()
  const matricula = (session?.user as any)?.matricula || null

  useEffect(() => {
    if (status === "authenticated" && matricula) {
      useAppStore.getState().setActiveUser(matricula)

      if (typeof window !== "undefined") {
        const currentSess = window.sessionStorage.getItem("malba_session_id")
        if (!currentSess || !currentSess.startsWith(`sess_${matricula}_`)) {
          const newSess = `sess_${matricula}_${Math.random().toString(36).substring(2, 9)}`
          window.sessionStorage.setItem("malba_session_id", newSess)
        }
      }
    } else if (status === "unauthenticated") {
      useAppStore.getState().resetUserProgress()
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("malba_session_id")
      }
    }
  }, [matricula, status])

  return null
}
