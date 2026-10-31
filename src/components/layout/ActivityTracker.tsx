"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

/**
 * ActivityTracker rastreia em background:
 * 1. Tempo real em que o usuário permanece ativo e logado na plataforma (via heartbeats de 60s).
 * 2. Visualizações de páginas e módulos para relatório pedagógico do docente.
 */
export function ActivityTracker() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const lastPathRef = useRef<string>("")

  // Envio de Heartbeat periódico a cada 60 segundos
  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return

    const sendHeartbeat = () => {
      // Envia heartbeat apenas se a aba estiver em foco / visível
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return
      }

      fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "heartbeat" }),
        keepalive: true,
      }).catch(() => {})
    }

    // Heartbeat inicial ao montar ou logar
    sendHeartbeat()

    const interval = setInterval(sendHeartbeat, 60 * 1000)

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        sendHeartbeat()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [status, session])

  // Envio de Evento de Troca de Página (page_view)
  useEffect(() => {
    if (status !== "authenticated" || !session?.user || !pathname) return

    // Evita duplicatas se o pathname não mudou
    if (lastPathRef.current === pathname) return
    lastPathRef.current = pathname

    // Não rastreia rotas internas de autenticação ou admin
    if (pathname.startsWith("/api") || pathname === "/login" || pathname === "/cadastro") {
      return
    }

    fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "event",
        type: "page_view",
        target: pathname,
      }),
      keepalive: true,
    }).catch(() => {})
  }, [pathname, status, session])

  return null
}
