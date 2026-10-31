"use client"

import React, { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  Lock,
  Sparkles,
  Maximize2,
  Minimize2,
  RefreshCw,
  Globe,
  CheckCircle2,
  Wifi
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/Logo"
import { TabGuard } from "@/components/layout/TabGuard"

export default function QrCodePage() {
  const [currentUrl, setCurrentUrl] = useState(
    typeof window !== "undefined" ? window.location.origin : "https://malba-cefet.vercel.app"
  )
  const [copied, setCopied] = useState(false)
  const [presentationMode, setPresentationMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Carrega a URL pública ativa (domínio web ou túnel Cloudflare via API)
  const fetchTunnelUrl = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/tunnel")
      if (res.ok) {
        const data = await res.json()
        if (data?.url) {
          setCurrentUrl(data.url)
          return
        }
      }
      if (typeof window !== "undefined") {
        setCurrentUrl(window.location.origin)
      }
    } catch {
      if (typeof window !== "undefined") {
        setCurrentUrl(window.location.origin)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTunnelUrl()
  }, [])

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isHttps = currentUrl.startsWith("https://")

  const setTunnelHttps = () => {
    fetchTunnelUrl()
  }

  const setLocalhost = () => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.origin)
    } else {
      setCurrentUrl("http://localhost:3000")
    }
  }

  return (
    <TabGuard tabId="qrcode">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6 font-sans pb-24 md:pb-8">
      
      {/* ================= CABEÇALHO DA PÁGINA ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Acesso Móvel para Avaliadores
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-xs text-slate-500 font-medium">PIBIC CEFET-MG 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            QR Code de Acesso no Celular
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-light">
            Permita que a banca avaliadora acesse a plataforma em tempo real pelo smartphone, com certificado HTTPS emitido e validado.
          </p>
        </div>

        <Button
          onClick={() => setPresentationMode(!presentationMode)}
          variant="outline"
          className="text-xs font-bold h-10 px-4 rounded-xl border-slate-200 self-start md:self-auto flex items-center gap-2"
        >
          {presentationMode ? (
            <>
              <Minimize2 className="w-4 h-4 text-slate-500" />
              <span>Sair do Modo Apresentação</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 text-blue-600" />
              <span>Modo Totem / Apresentação</span>
            </>
          )}
        </Button>
      </div>

      {/* ================= CARTÃO DO QR CODE (NORMAL OU MODO APRESENTAÇÃO) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Lado Esquerdo: Display Central do QR Code */}
        <div className={`space-y-4 ${presentationMode ? "lg:col-span-12" : "lg:col-span-6"}`}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col items-center text-center relative overflow-hidden">
            
            {/* Logo do Malba no topo do card */}
            <div className="mb-3">
              <Logo size="md" showBadge={false} />
            </div>

            {/* Selo de Segurança HTTPS */}
            <div className="mb-4">
              {isHttps ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Conexão Segura HTTPS Ativa</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                  <Wifi className="w-3.5 h-3.5 text-amber-600" />
                  <span>Rede Local (HTTP)</span>
                </div>
              )}
            </div>

            {/* Container do QR Code */}
            <div className="p-4 bg-white rounded-3xl border-2 border-slate-200/80 shadow-inner my-1 inline-block">
              <QRCodeSVG 
                value={currentUrl} 
                size={presentationMode ? 320 : 220}
                level="M"
                includeMargin={true}
                fgColor="#0F172A"
              />
            </div>

            {/* Instrução visual */}
            <div className="mt-4 space-y-1">
              <span className="text-xs font-bold text-slate-900 block flex items-center justify-center gap-1.5">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Aponte a câmera do celular para abrir</span>
              </span>
              <p className="text-[11px] text-slate-500 max-w-sm">
                Compatível com iPhone e Android. Abre direto no navegador sem avisos de segurança ou instalação de apps.
              </p>
            </div>

            {/* URL Atual e Botões de Ação */}
            <div className="mt-5 w-full max-w-md space-y-2">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-2xl">
                <Globe className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                <input
                  type="text"
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  placeholder="URL do túnel (ex: https://...)"
                  className="w-full bg-transparent text-xs text-slate-800 font-semibold focus:outline-none truncate"
                />
                <Button
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-3 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shrink-0 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copiado!" : "Copiar"}</span>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Testar no Navegador</span>
                </a>

                <button
                  type="button"
                  onClick={fetchTunnelUrl}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors font-medium"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span>Atualizar</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Lado Direito: Instruções do Túnel HTTPS & Vantagens */}
        {!presentationMode && (
          <div className="lg:col-span-6 space-y-5">
            
            {/* Como Funciona o Túnel HTTPS */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Túnel HTTPS Seguro Ativo
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Certificado SSL emitido pela Cloudflare Inc CA
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-light">
                <p>
                  Diferente de soluções locais que geram alerta de <strong className="font-semibold text-slate-800">"Site não seguro"</strong> ou pedem confirmação de senha, o túnel Cloudflare fornece um certificado TLS/SSL oficial com cadeado verde.
                </p>

                {/* Vantagens Práticas */}
                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Por que esta solução não é bloqueada:</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700 pl-6 list-disc text-[11px]">
                    <li><strong>Sem tela intermediária:</strong> A câmera do smartphone abre o site imediatamente.</li>
                    <li><strong>Sem certificado autoassinado:</strong> Reconhecido nativamente no iOS Safari e Google Chrome.</li>
                    <li><strong>Acesso 4G/5G:</strong> O avaliador não precisa estar conectado na mesma rede Wi-Fi que o seu computador.</li>
                  </ul>
                </div>

                {/* Bloco de Comando no Terminal */}
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-[11px] space-y-2 border border-slate-800 shadow-inner">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Comando para reiniciar o túnel (se necessário)</span>
                    </span>
                  </div>
                  <div className="text-emerald-400 select-all font-semibold">
                    npm run tunnel
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">
                    O script inicia o <code>cloudflared</code> e direciona o tráfego da porta 3000 com criptografia ponta a ponta.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={setTunnelHttps}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-colors"
                  >
                    Usar URL Cloudflare HTTPS
                  </button>
                  <button
                    onClick={setLocalhost}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                  >
                    Usar Localhost (IP local)
                  </button>
                </div>
              </div>
            </div>

            {/* Checklist de Validação Mobile */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>O que os avaliadores poderão testar no smartphone:</span>
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 font-light">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span><strong>Login SIGAA:</strong> Pré-preenchido com perfil de teste para acesso com 1 toque.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span><strong>Menu Lateral Deslizante:</strong> Barra de topo com botão hambúrguer adaptado para toque.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span><strong>Workspace com Abas Mobile:</strong> Alternância rápida entre Enunciado e Tutor Socrático sem rolagem infinita.</span>
                </li>
              </ul>
            </div>

          </div>
        )}

      </div>

    </div>
    </TabGuard>
  )
}
