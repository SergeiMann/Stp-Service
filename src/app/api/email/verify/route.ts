import { NextRequest, NextResponse } from 'next/server'
import { createSmtpTransport } from '@/lib/mailer'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const adminKey = process.env.ADMIN_API_KEY
    const headerKey = request.headers.get('x-admin-key')
    if (!adminKey || headerKey !== adminKey) {
      return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 })
    }

    const url = new URL(request.url)
    const shouldSend = url.searchParams.get('send') === '1'

    const config = {
      host: !!env.SMTP_HOST,
      port: env.SMTP_PORT ?? null,
      secure: env.SMTP_SECURE ?? null,
      user: !!env.SMTP_USER,
      from: env.SMTP_FROM,
      to: env.CONTACT_TO,
    }

    const transporter = createSmtpTransport()

    // Проверяем соединение
    await transporter.verify()

    let sent: any = null
    if (shouldSend) {
      sent = await transporter.sendMail({
        from: `"STP-Service" <${env.SMTP_FROM}>`,
        to: env.CONTACT_TO,
        subject: 'Тест SMTP: STP-Service',
        text: 'Это тестовое письмо для проверки SMTP-конфигурации.',
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        config,
        verify: 'ok',
        sent: sent ? { messageId: sent.messageId, accepted: sent.accepted, rejected: sent.rejected } : null,
      },
    })
  } catch (e: any) {
    // Возвращаем подробности для диагностики (только под админ-ключом)
    return NextResponse.json(
      {
        success: false,
        error: 'smtp_error',
        details: {
          message: e?.message,
          code: e?.code,
          command: e?.command,
          response: e?.response,
        },
      },
      { status: 500 }
    )
  }
}


