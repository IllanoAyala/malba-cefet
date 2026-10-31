import { Resend } from "resend"

/**
 * Envia o código de 6 dígitos para o e-mail informado.
 * Se a chave RESEND_API_KEY não estiver configurada no .env (ex: ambiente local ou dev),
 * faz um log destacado no terminal e retorna sucesso para permitir testes sem interrupções.
 */
export async function sendVerificationCodeEmail({
  toEmail,
  code,
  name,
  purpose = "registration",
}: {
  toEmail: string
  code: string
  name?: string
  purpose?: "registration" | "password_reset"
}) {
  const resendApiKey = process.env.RESEND_API_KEY
  const resend = resendApiKey ? new Resend(resendApiKey) : null
  const fromEmail = process.env.EMAIL_FROM || "Malba <onboarding@resend.dev>"

  const isReset = purpose === "password_reset"
  const title = isReset
    ? "Recuperação de Senha • Malba"
    : "Confirmação de Cadastro • Malba"

  const introText = isReset
    ? "Recebemos uma solicitação para redefinir a senha da sua conta no Malba."
    : "Para concluir seu cadastro e ativar seu acesso à plataforma Malba, utilize o código de verificação abaixo:"

  const subject = isReset
    ? `Código de redefinição de senha: ${code}`
    : `Seu código de confirmação no Malba: ${code}`

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0F172A; }
        .card { max-width: 480px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: #2563EB; padding: 28px 24px; text-align: center; color: #FFFFFF; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0 0; font-size: 12px; color: #DBEAFE; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
        .content { padding: 32px 28px; }
        .greeting { font-size: 16px; font-weight: 700; color: #1E293B; margin-bottom: 8px; }
        .message { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0; }
        .code-box { background: #EFF6FF; border: 2px dashed #93C5FD; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
        .code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #1D4ED8; margin: 0; }
        .expiry { font-size: 12px; color: #64748B; margin-top: 8px; font-weight: 500; }
        .security-notice { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 12px 16px; font-size: 12px; color: #92400E; line-height: 1.5; margin-top: 24px; }
        .footer { background: #F8FAFC; border-top: 1px solid #F1F5F9; padding: 16px; text-align: center; font-size: 11px; color: #94A3B8; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Malba.</h1>
          <p>Tutor Socrático de Matemática &bull; CEFET-MG</p>
        </div>
        <div class="content">
          <div class="greeting">Olá${name ? `, ${name.split(" ")[0]}` : ""}!</div>
          <p class="message">${introText}</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
            <div class="expiry">Válido por 15 minutos</div>
          </div>

          <div class="security-notice">
            <strong>Dica de Segurança:</strong> Nunca compartilhe este código com outras pessoas. A equipe do Malba ou do CEFET-MG nunca solicitará este código.
          </div>
        </div>
        <div class="footer">
          Centro Federal de Educação Tecnológica de Minas Gerais &bull; CEFET-MG<br>
          Iniciação Científica PIBIC &bull; Campus Divinópolis
        </div>
      </div>
    </body>
    </html>
  `

  if (!resend) {
    console.log("\n=======================================================")
    console.log(`[MALBA DEV EMAIL] Simulação de Envio de E-mail:`)
    console.log(`Para: ${toEmail}`)
    console.log(`Finalidade: ${purpose}`)
    console.log(`CÓDIGO OTP: ${code}`)
    console.log(`Validade: 15 minutos`)
    console.log("=======================================================\n")
    return { success: true, devMode: true }
  }

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      html,
    })

    if (result.error) {
      console.error("Resend API Error:", result.error)
      const errorMsg = result.error.message || ""
      const isSandboxRestriction = errorMsg.includes("You can only send testing emails to your own email address")

      if (isSandboxRestriction) {
        console.warn(
          `[Resend Sandbox] O e-mail ${toEmail} é diferente da conta titular do Resend. Ativando fallback de desenvolvimento para testes.`
        )
        return { success: true, devMode: true, sandboxRestricted: true }
      }

      throw new Error(errorMsg || "Erro retornado pelo serviço de e-mail (Resend).")
    }

    return { success: true, data: result }
  } catch (error: any) {
    console.error("Erro ao enviar e-mail via Resend:", error)
    throw new Error(error.message || "Falha ao enviar e-mail com código de confirmação.")
  }
}
