import nodemailer from 'nodemailer'
import { env } from './env'

export interface ContactEmailPayload {
  name: string
  phone: string
  email?: string
  company?: string
  message: string
  equipment?: string
}

function ensureSmtpConfigured() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    throw new Error('SMTP не сконфигурирован (нужны SMTP_HOST, SMTP_USER, SMTP_PASS)')
  }
}

export function createSmtpTransport() {
  ensureSmtpConfigured()
  const port = env.SMTP_PORT ?? 465
  const secure = env.SMTP_SECURE ?? port === 465

  return nodemailer.createTransport({
    host: env.SMTP_HOST as string,
    port,
    secure,
    auth: {
      user: env.SMTP_USER as string,
      pass: env.SMTP_PASS as string,
    },
  })
}

export async function sendContactEmail(data: ContactEmailPayload) {
  const transporter = createSmtpTransport()

  const subject = `Заявка с сайта: ${data.name} (${data.phone})`

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#111">
      <h2 style="margin:0 0 12px">Новая заявка с сайта STP-Service</h2>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <tr>
          <td style="color:#555">Имя</td>
          <td><strong>${escapeHtml(data.name)}</strong></td>
        </tr>
        <tr>
          <td style="color:#555">Телефон</td>
          <td><strong>${escapeHtml(data.phone)}</strong></td>
        </tr>
        ${data.email ? `<tr><td style="color:#555">Email</td><td>${escapeHtml(data.email)}</td></tr>` : ''}
        ${data.company ? `<tr><td style="color:#555">Компания</td><td>${escapeHtml(data.company)}</td></tr>` : ''}
        ${data.equipment ? `<tr><td style="color:#555">Оборудование</td><td>${escapeHtml(data.equipment)}</td></tr>` : ''}
      </table>

      <div style="margin-top:16px">
        <div style="color:#555;margin-bottom:6px">Сообщение:</div>
        <div style="white-space:pre-wrap;border:1px solid #e5e7eb;border-radius:6px;padding:12px;background:#fafafa">
          ${escapeHtml(data.message)}
        </div>
      </div>
    </div>
  `

  const text = [
    'Новая заявка с сайта STP-Service',
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
    data.email ? `Email: ${data.email}` : undefined,
    data.company ? `Компания: ${data.company}` : undefined,
    data.equipment ? `Оборудование: ${data.equipment}` : undefined,
    '',
    'Сообщение:',
    data.message,
  ]
    .filter(Boolean)
    .join('\n')

  const from = env.SMTP_FROM
  const to = env.CONTACT_TO

  const info = await transporter.sendMail({
    from: `"STP-Service" <${from}>`,
    to,
    subject,
    text,
    html,
    replyTo: data.email ? `${data.name} <${data.email}>` : undefined,
  })

  return info
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}


