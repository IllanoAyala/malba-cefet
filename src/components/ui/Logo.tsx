import React from 'react'
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  showBadge?: boolean
  badgeText?: string
  subtitle?: string
  styleVariant?: any
  variant?: 'light' | 'dark'
}

export function Logo({ 
  className, 
  size = 'md', 
  showText = true,
  showBadge = false,
  badgeText = "TUTOR",
  subtitle,
  variant = 'light' 
}: LogoProps) {
  // Tamanhos da tipografia Outfit para o Wordmark
  const sizeClasses = {
    sm: { 
      text: "text-xl", 
      icon: "w-7 h-7 text-sm",
      badge: "text-[9px] px-1.5 py-0.5",
      subtitle: "text-[10px]"
    },
    md: { 
      text: "text-2xl", 
      icon: "w-9 h-9 text-base",
      badge: "text-[10px] px-2 py-0.5",
      subtitle: "text-[11px]"
    },
    lg: { 
      text: "text-3xl", 
      icon: "w-11 h-11 text-xl",
      badge: "text-xs px-2.5 py-0.5",
      subtitle: "text-xs"
    },
    xl: { 
      text: "text-4xl", 
      icon: "w-14 h-14 text-2xl",
      badge: "text-xs px-3 py-1",
      subtitle: "text-sm"
    },
  }

  const currentSize = sizeClasses[size] || sizeClasses.md
  const isDark = variant === 'dark'

  // Quando showText === false (apenas ícone decorativo)
  if (!showText) {
    return (
      <div className={cn(
        "rounded-xl bg-blue-600 text-white font-black font-sans flex items-center justify-center shadow-sm select-none",
        currentSize.icon,
        className
      )}>
        M
      </div>
    )
  }

  return (
    <div className={cn("inline-flex flex-col justify-center select-none font-sans", className)}>
      <div className="flex items-center gap-2 leading-none">
        {/* Wordmark Tipográfico Principal */}
        <span className={cn(
          "font-black tracking-tight flex items-baseline leading-none",
          currentSize.text,
          isDark ? "text-white" : "text-slate-900"
        )}>
          Malba
          <span className="text-blue-600 font-black">.</span>
        </span>
        
        {/* Badge Sutil e Limpo */}
        {showBadge && (
          <span className={cn(
            "font-bold uppercase tracking-wider rounded-full border shrink-0 transition-colors",
            currentSize.badge,
            isDark 
              ? "bg-blue-500/20 text-blue-300 border-blue-400/30" 
              : "bg-blue-50 text-blue-700 border-blue-200/80"
          )}>
            {badgeText}
          </span>
        )}
      </div>

      {/* Subtítulo Institucional */}
      {subtitle && (
        <p className={cn(
          "font-semibold uppercase tracking-widest mt-1.5 leading-none",
          currentSize.subtitle,
          isDark ? "text-slate-400" : "text-slate-400"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
