import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const { auth } = NextAuth(authConfig)

// Rotas que não precisam de login
const publicRoutes = ["/login", "/api/auth", "/api/tunnel", "/qrcode"]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // Se não está logado e tenta acessar rota privada -> manda pro login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // Se está logado e tenta acessar especificamente a página de login -> manda pro dashboard
  if (isLoggedIn && nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

// Define quais rotas o middleware vai "escutar"
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
