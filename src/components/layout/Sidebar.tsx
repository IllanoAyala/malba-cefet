"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Compass, 
  GraduationCap, 
  BookOpen, 
  LogOut, 
  BarChart2, 
  BookMarked,
  ShieldCheck,
  HelpCircle,
  Menu,
  X,
  QrCode,
  PlayCircle
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useAppStore } from "@/store/useAppStore"
import { Logo } from "@/components/ui/Logo"
import { AboutMalbaModal } from "@/components/features/AboutMalbaModal"
import { DEFAULT_NAV_TABS, NavTabItem } from "@/data/navigationConfig"

const ICON_MAP: Record<string, React.ElementType> = {
  Compass,
  PlayCircle,
  BookOpen,
  BarChart2,
  BookMarked,
  GraduationCap,
  ShieldCheck,
  QrCode,
}

interface SidebarProps {
  initialTabs?: NavTabItem[]
}

export function Sidebar({ initialTabs }: SidebarProps) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const storeNavTabs = useAppStore((state) => state.navigationTabs)
  const setNavigationTabs = useAppStore((state) => state.setNavigationTabs)

  // Prioriza initialTabs vindo diretamente do servidor na primeira renderização (evita flash)
  const navigationTabs =
    initialTabs && initialTabs.length > 0
      ? initialTabs
      : storeNavTabs && storeNavTabs.length > 0
      ? storeNavTabs
      : DEFAULT_NAV_TABS

  // Sincroniza configurações de abas com o servidor e canais de atualização
  React.useEffect(() => {
    if (initialTabs && initialTabs.length > 0) {
      setNavigationTabs(initialTabs)
    }

    fetch("/api/navigation-settings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.tabs) && data.tabs.length > 0) {
          setNavigationTabs(data.tabs)
        }
      })
      .catch((err) => console.error("Erro ao sincronizar abas da barra lateral:", err))

    const handleNavigationUpdated = (e: any) => {
      if (Array.isArray(e.detail)) {
        setNavigationTabs(e.detail)
      }
    }
    window.addEventListener("navigation-updated", handleNavigationUpdated)

    // BroadcastChannel para sincronizar abas abertas simultaneamente
    let bc: BroadcastChannel | null = null
    try {
      bc = new BroadcastChannel("malba-navigation-channel")
      bc.onmessage = (event) => {
        if (event.data?.tabs && Array.isArray(event.data.tabs)) {
          setNavigationTabs(event.data.tabs)
        }
      }
    } catch {}

    return () => {
      window.removeEventListener("navigation-updated", handleNavigationUpdated)
      if (bc) bc.close()
    }
  }, [initialTabs, setNavigationTabs])

  if (status === "loading" || !session) return null

  const role = (session.user as any)?.role || 'aluno'
  const name = session.user?.name || 'Usuário'
  const matricula = (session.user as any)?.matricula || ''
  
  // Função para pegar iniciais do nome para o Avatar
  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return fullName.substring(0, 2).toUpperCase()
  }

  // Lista dinâmica de abas
  const activeTabsList = navigationTabs && navigationTabs.length > 0 ? navigationTabs : DEFAULT_NAV_TABS

  const dynamicNavItems = activeTabsList
    .filter((tab) => {
      // Se for admin, sempre exibe todas as abas
      if (role === "admin") return true
      // Para usuários normais (aluno/professor): deve estar ativada E o papel estar na lista de permissões
      return tab.enabled && tab.allowedRoles.includes(role as "aluno" | "professor")
    })
    .map((tab) => ({
      href: tab.href,
      label: tab.label,
      icon: ICON_MAP[tab.iconName] || Compass,
      roles: ["admin", ...tab.allowedRoles],
      enabled: tab.enabled,
    }))
  
  const navGroups = [
    ...(role === "admin"
      ? [
          {
            label: "ADMINISTRAÇÃO",
            roles: ["admin"],
            items: [
              { href: "/admin", label: "Painel Admin & Contas", icon: ShieldCheck, roles: ["admin"], enabled: true },
            ],
          },
        ]
      : []),
    {
      label: "NAVEGAÇÃO",
      roles: ["admin", "professor", "aluno"],
      items: dynamicNavItems,
    },
  ]

  // Filtra os grupos para mostrar apenas os que a role atual tem acesso
  const visibleGroups = navGroups.filter(group => group.roles.includes(role))

  // Conteúdo compartilhado da navegação (usado tanto no desktop quanto no drawer mobile)
  const renderNavContent = (isMobile = false) => (
    <>
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.filter(item => item.roles.includes(role)).map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (isMobile) setIsMobileMenuOpen(false)
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium border border-transparent",
                      isActive 
                        ? "bg-blue-600/10 text-blue-700 font-bold border-blue-500/20 shadow-xs" 
                        : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
                    <span className="truncate">{item.label}</span>
                    {role === "admin" && item.href !== "/admin" && !item.enabled && (
                      <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                        Oculta
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      
      {/* Botão Sobre o Malba */}
      <div className="px-4 py-2 border-t border-slate-200/60">
        <button
          onClick={() => {
            setIsAboutOpen(true)
            if (isMobile) setIsMobileMenuOpen(false)
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Sobre o Malba</span>
        </button>
      </div>

      {/* Rodapé com Informações do Usuário */}
      <div className="p-4 border-t border-slate-200/70 bg-slate-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-xs text-xs font-bold text-white">
              {getInitials(name)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{name}</p>
              <p className="text-[10px] text-slate-500 font-medium">
                {role === 'admin' ? 'Admin' : role === 'professor' ? 'Docente' : 'Discente'} &bull; {matricula}
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (typeof window !== "undefined") {
                window.sessionStorage.removeItem("malba_session_id")
              }
              useAppStore.getState().resetUserProgress()
              signOut({ callbackUrl: "/login" })
            }}
            className="p-2 bg-transparent text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            title="Sair da Plataforma"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* ================= 1. BARRA SUPERIOR MOBILE (EXCLUSIVA PARA SMARTPHONES) ================= */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border-b border-slate-200/80 w-full shrink-0 z-30 shadow-xs">
        <Logo size="sm" variant="light" showBadge={false} />
        
        <div className="flex items-center gap-2">
          <Link
            href="/qrcode"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
            title="Acesso Mobile QR"
          >
            <QrCode className="w-4 h-4 text-blue-600" />
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
            aria-label="Abrir Menu de Navegação"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ================= 2. GAVETA DESLIZANTE MOBILE (DRAWER) ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop escurecido */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Painel da Gaveta */}
          <aside className="relative w-72 max-w-[85vw] bg-[#F8FAFC] text-slate-800 flex flex-col h-full shadow-2xl z-50 border-r border-slate-200/80 animate-in slide-in-from-left duration-300 font-sans">
            {/* Header da Gaveta */}
            <div className="p-5 border-b border-slate-200/70 flex items-center justify-between">
              <Logo size="sm" variant="light" showBadge={false} />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                title="Fechar Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Itens de Navegação Mobile */}
            {renderNavContent(true)}
          </aside>
        </div>
      )}

      {/* ================= 3. SIDEBAR FIXA TRADICIONAL (DESKTOP) ================= */}
      <aside className="hidden md:flex w-64 bg-[#F8FAFC] text-slate-800 flex-col h-full shrink-0 shadow-xs z-20 relative border-r border-slate-200/80 font-sans transition-colors duration-300">
        {/* Área da Logo Wordmark Integrada */}
        <div className="p-6 border-b border-slate-200/70">
          <Logo size="sm" variant="light" showBadge={false} />
        </div>
        
        {/* Navegação Desktop */}
        {renderNavContent(false)}
      </aside>

      {/* Modal Institucional "Sobre o Malba" */}
      <AboutMalbaModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  )
}
