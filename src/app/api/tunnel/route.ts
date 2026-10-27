import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return NextResponse.json({ url: process.env.NEXT_PUBLIC_SITE_URL })
    }

    // Se estiver rodando na web (ex: Vercel), usa a própria origem HTTPS da requisição
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
    const proto = req.headers.get('x-forwarded-proto') || 'https'
    if (host && !host.includes('localhost') && !host.startsWith('127.0.0.1')) {
      return NextResponse.json({ url: `${proto}://${host}` })
    }

    // Tenta ler o arquivo de log do túnel local se existir
    const tunnelFile = path.join(process.cwd(), '.tunnel-url')
    if (fs.existsSync(tunnelFile)) {
      const url = fs.readFileSync(tunnelFile, 'utf-8').trim()
      if (url.startsWith('https://')) {
        return NextResponse.json({ url })
      }
    }

    return NextResponse.json({ 
      url: host ? `http://${host}` : "http://localhost:3000" 
    })
  } catch (error) {
    return NextResponse.json({ 
      url: "http://localhost:3000" 
    })
  }
}
