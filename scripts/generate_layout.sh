mkdir -p src/components/layout

cat << 'SIDEBAR_EOF' > src/components/layout/Sidebar.tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Compass, GraduationCap, LayoutDashboard } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  
  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/explorador", label: "Explorador", icon: Compass },
    { href: "/workspace/start", label: "Workspace", icon: LayoutDashboard },
    { href: "/professor", label: "Área do Professor", icon: GraduationCap },
  ]

  return (
    <aside className="w-64 bg-[#002B49] text-white flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">MathAI<span className="text-blue-400">-CEFET</span></h1>
        <p className="text-xs text-slate-300 mt-1">PIBIC BCE 2026</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-slate-400">
          <p>Aluno: Illano Ayala</p>
          <p>Prof. Dr. Emerson Costa</p>
        </div>
      </div>
    </aside>
  )
}
SIDEBAR_EOF

cat << 'LAYOUT_EOF' > src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/layout/Sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MathAI-CEFET | PIBIC 2026",
  description: "Plataforma de ensino com IA Socrática baseada no Arco de Maguerez",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-50 text-slate-900 overflow-hidden`}>
        <div className="flex h-screen w-full">
          <Sidebar />
          <main className="flex-1 flex flex-col h-full overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
LAYOUT_EOF
