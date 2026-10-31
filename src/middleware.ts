import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const { auth } = NextAuth(authConfig)

// Rotas que não precisam de login
const publicRoutes = ["/login", "/cadastro", "/api/auth", "/api/register", "/api/tunnel", "/qrcode"]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const user = req.auth?.user as any

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // Se não está logado e tenta acessar rota privada -> manda pro login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // Se está logado e tenta acessar especificamente login ou cadastro -> manda pro dashboard
  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/cadastro")) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  // Se é aluno logado sem série definida (contas migradas/antigas), força a completar o perfil
  const hasCompletedCookie = req.cookies.get("malba_serie_completed")?.value === "true"

  if (
    isLoggedIn &&
    user?.role === "aluno" &&
    !user?.serie &&
    !hasCompletedCookie &&
    !nextUrl.pathname.startsWith("/api") &&
    nextUrl.pathname !== "/perfil/completar"
  ) {
    return NextResponse.redirect(new URL("/perfil/completar", nextUrl))
  }

  // Proteção da rota /admin apenas para role === 'admin'
  if (isLoggedIn && nextUrl.pathname.startsWith("/admin")) {
    const role = user?.role
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  // Proteção de rotas docentes /professor apenas para professor ou admin
  if (isLoggedIn && nextUrl.pathname.startsWith("/professor")) {
    const role = user?.role
    if (role !== "professor" && role !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  return NextResponse.next()
})

// Define quais rotas o middleware vai "escutar"
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
