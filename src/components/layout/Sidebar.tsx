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
  PlayCircle,
  Users
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
  Users,
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

  // Ocultar a barra lateral em páginas de tela cheia ou de onboarding/perfil
  const isCleanPage = 
    pathname === "/perfil/completar" || 
    pathname === "/login" || 
    pathname === "/cadastro"

  if (status === "loading" || !session || isCleanPage) return null

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

  // Identifica exatamente qual item do menu deve estar ativo (evita ativação múltipla de rotas com prefixo comum como /professor e /professor/turmas)
  const allVisibleItems = visibleGroups.flatMap(group => group.items.filter(item => item.roles.includes(role)))
  const exactMatch = allVisibleItems.find(item => item.href === pathname)
  const activeHref = exactMatch 
    ? exactMatch.href 
    : allVisibleItems
        .filter(item => item.href !== "/" && (pathname.startsWith(`${item.href}/`) || pathname === item.href))
        .sort((a, b) => b.href.length - a.href.length)[0]?.href

  // Conteúdo compartilhado da navegação (usado tanto no desktop quanto no drawer mobile e tablet rail)
  const renderNavContent = (isMobile = false, isRail = false) => (
    <>
      <nav className="flex-1 p-3 lg:p-4 space-y-6 overflow-y-auto custom-scrollbar">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <h3
              className={cn(
                "px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2",
                isRail && "hidden lg:block text-center lg:text-left"
              )}
            >
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.filter(item => item.roles.includes(role)).map((item) => {
                const isActive = item.href === activeHref
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    onClick={() => {
                      if (isMobile) setIsMobileMenuOpen(false)
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium border border-transparent min-h-[44px]",
                      isRail ? "justify-center lg:justify-start" : "justify-start",
                      isActive 
                        ? "bg-blue-600/10 text-blue-700 font-bold border-blue-500/20 shadow-xs" 
                        : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-blue-600" : "text-slate-400")} />
                    <span className={cn("truncate", isRail ? "hidden lg:inline" : "inline")}>{item.label}</span>
                    {role === "admin" && item.href !== "/admin" && !item.enabled && (
                      <span className={cn(
                        "ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 shrink-0",
                        isRail && "hidden lg:inline"
                      )}>
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
      <div className="px-3 lg:px-4 py-2 border-t border-slate-200/60">
        <button
          onClick={() => {
            setIsAboutOpen(true)
            if (isMobile) setIsMobileMenuOpen(false)
          }}
          title="Sobre o Malba"
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer min-h-[40px]",
            isRail ? "justify-center lg:justify-start" : "justify-start"
          )}
        >
          <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
          <span className={cn(isRail ? "hidden lg:inline" : "inline")}>Sobre o Malba</span>
        </button>
      </div>

      {/* Rodapé com Informações do Usuário */}
      <div className="p-3 lg:p-4 border-t border-slate-200/70 bg-slate-100/50">
        <div className={cn("flex items-center", isRail ? "justify-center lg:justify-between flex-col lg:flex-row gap-2" : "justify-between")}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-xs text-xs font-bold text-white shrink-0">
              {getInitials(name)}
            </div>
            <div className={cn(isRail ? "hidden lg:block" : "block")}>
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
            className="p-2 bg-transparent text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Sair da Plataforma"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )

  // Itens para a Bottom Navigation Bar móvel (exclusiva para smartphones)
  const isWorkspace = pathname.startsWith("/workspace/")

  const getBottomNavItems = () => {
    if (role === "admin") {
      return [
        { href: "/admin", label: "Admin", icon: ShieldCheck },
        { href: "/", label: "Início", icon: Compass },
        { href: "/explorador", label: "Catálogo", icon: BookOpen },
        { href: "/materias", label: "Matérias", icon: PlayCircle },
      ]
    }
    if (role === "professor") {
      return [
        { href: "/", label: "Início", icon: Compass },
        { href: "/professor/turmas", label: "Turmas", icon: Users },
        { href: "/professor", label: "Portal", icon: GraduationCap },
        { href: "/materias", label: "Matérias", icon: PlayCircle },
      ]
    }
    return [
      { href: "/", label: "Início", icon: Compass },
      { href: "/explorador", label: "Catálogo", icon: BookOpen },
      { href: "/materias", label: "Matérias", icon: PlayCircle },
      { href: "/aluno/caderno", label: "Caderno", icon: BookMarked },
    ]
  }

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
            {renderNavContent(true, false)}
          </aside>
        </div>
      )}

      {/* ================= 3. SIDEBAR RESPONSIVA (TABLET RAIL MD:W-20 + DESKTOP LG:W-64) ================= */}
      <aside className="hidden md:flex md:w-20 lg:w-64 bg-[#F8FAFC] text-slate-800 flex-col h-full shrink-0 shadow-xs z-20 relative border-r border-slate-200/80 font-sans transition-all duration-300">
        {/* Área da Logo Wordmark: Ícone compacto no tablet e Completo no desktop */}
        <div className="p-4 lg:p-6 border-b border-slate-200/70 flex justify-center lg:justify-start">
          <div className="hidden lg:block">
            <Logo size="sm" variant="light" showBadge={false} />
          </div>
          <div className="lg:hidden flex items-center justify-center">
            <Logo size="sm" variant="light" showText={false} />
          </div>
        </div>
        
        {/* Navegação Tablet Rail + Desktop */}
        {renderNavContent(false, true)}
      </aside>

      {/* ================= 4. BARRA INFERIOR MOBILE (BOTTOM NAVIGATION BAR) ================= */}
      {!isWorkspace && (
        <nav
          className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 flex items-center justify-around px-1.5 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
          aria-label="Navegação Rápida Inferior"
        >
          {getBottomNavItems().map((item) => {
            const isItemActive = item.href === activeHref
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all min-h-[44px]",
                  isItemActive
                    ? "text-blue-600 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                <div
                  className={cn(
                    "p-1 rounded-xl transition-all",
                    isItemActive ? "bg-blue-50 text-blue-600 scale-105" : "text-slate-400"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight leading-tight mt-0.5 truncate max-w-[64px]">
                  {item.label}
                </span>
              </Link>
            )
          })}

          {/* Botão Mais / Menu para abrir o Drawer */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-500 hover:text-slate-800 transition-all min-h-[44px] cursor-pointer"
            aria-label="Mais opções e configurações"
          >
            <div className="p-1 rounded-xl text-slate-400">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight leading-tight mt-0.5 font-medium">
              Mais
            </span>
          </button>
        </nav>
      )}

      {/* Modal Institucional "Sobre o Malba" */}
      <AboutMalbaModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  )
}
