import type { Metadata } from "next"
import "./globals.css"
import "katex/dist/katex.min.css"
import { Plus_Jakarta_Sans, Lora, Outfit, Inter } from "next/font/google"
import { Sidebar } from "@/components/layout/Sidebar"
import { SessionSync } from "@/components/layout/SessionSync"
import { ActivityTracker } from "@/components/layout/ActivityTracker"
import { SessionProvider } from "next-auth/react"
import { getNavigationSettings } from "@/lib/navigationSettings"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Malba | Tutor de Matemática CEFET-MG",
  description: "Plataforma de ensino com IA Socrática baseada no Arco de Maguerez",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialNavTabs = await getNavigationSettings()

  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${lora.variable} ${outfit.variable} ${inter.variable}`}>
      <body className="font-sans bg-slate-50 text-slate-900 overflow-hidden">
        <SessionProvider>
          <SessionSync />
          <ActivityTracker />
          <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
            <Sidebar initialTabs={initialNavTabs} />
            <main className="flex-1 flex flex-col h-full overflow-y-auto">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
