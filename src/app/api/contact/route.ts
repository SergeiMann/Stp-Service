import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import { sendContactEmail } from '@/lib/mailer'

export const dynamic = 'force-dynamic'

const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Имя: минимум 2 символа')
    .max(100, 'Имя: максимум 100 символов'),
  // Требуем ровно 11 цифр, первая — 7 (формат +7 (xxx) xxx-xx-xx)
  phone: z
    .string()
    .refine((v) => {
      const d = v.replace(/\D/g, '')
      return d.length === 11 && d.startsWith('7')
    }, 'Телефон: введите в формате +7 (xxx) xxx-xx-xx'),
  email: z.string().email('Некорректный email'),
  company: z.string().max(100).optional(),
  message: z
    .string()
    .min(5, 'Сообщение: минимум 5 символов')
    .max(2000, 'Сообщение слишком длинное'),
  equipment: z
    .string()
    .min(1, 'Выберите тип оборудования')
    .max(100, 'Тип оборудования слишком длинный'),
})

const limiter = rateLimit({ intervalMs: 60_000, uniqueTokenPerInterval: 1000 })

interface ContactFormData {
  name: string
  phone: string
  email: string
  company?: string
  message: string
  equipment: string
}

async function createBitrixLead(data: ContactFormData) {
  const webhookBase = process.env.BITRIX24_WEBHOOK_URL
  if (!webhookBase) {
    // Интеграция выключена, если не задан webhook
    return { skipped: true }
  }

  const fields: Record<string, any> = {
    TITLE: 'Заявка с сайта',
    NAME: data.name,
    PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
    COMMENTS:
      data.message + (data.equipment ? `\nОборудование: ${data.equipment}` : ''),
    SOURCE_ID: 'WEB',
  }

  if (data.email) {
    fields.EMAIL = [{ VALUE: data.email, VALUE_TYPE: 'WORK' }]
  }

  const responsibleId = process.env.BITRIX24_RESPONSIBLE_ID
  if (responsibleId) {
    fields.ASSIGNED_BY_ID = Number(responsibleId)
  }

  const payload = {
    fields,
    params: { REGISTER_SONET_EVENT: 'Y' },
  }

  try {
    const res = await fetch(`${webhookBase}/crm.lead.add.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // Не тянем куки, чтобы не было проблем на сервере
      cache: 'no-store',
    })

    const text = await res.text()
    try {
      const json = JSON.parse(text)
      if (!res.ok || (json && json.error)) {
        console.error('Bitrix24 lead error:', json || text)
        return { error: json || text }
      }
      return { result: json }
    } catch {
      if (!res.ok) {
        console.error('Bitrix24 lead error (non-JSON):', text)
        return { error: text }
      }
      return { result: text }
    }
  } catch (e) {
    console.error('Bitrix24 fetch failed:', e)
    return { error: String(e) }
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    try {
      await limiter.check(ip, 10)
    } catch {
      return NextResponse.json({ success: false, error: 'Слишком много запросов' }, { status: 429 })
    }

    const json = await request.json()
    const parsed = contactSchema.safeParse(json)
    if (!parsed.success) {
      const details = parsed.error.flatten()
      return NextResponse.json(
        { success: false, error: 'Некорректные данные', details },
        { status: 400 }
      )
    }
    const body = parsed.data
    
    // Сохранение заявки в базу данных
    const contactRequest = await prisma.contactRequest.create({
      data: {
        name: body.name.trim(),
        phone: body.phone.trim(),
        email: body.email?.trim() || null,
        company: body.company?.trim() || null,
        message: body.message.trim(),
        equipment: body.equipment?.trim() || null,
        status: 'NEW'
      }
    })
    
    // Отправка email уведомления
    try {
      await sendContactEmail({
        name: body.name.trim(),
        phone: body.phone.trim(),
        email: body.email?.trim(),
        company: body.company?.trim(),
        message: body.message.trim(),
        equipment: body.equipment?.trim(),
      })
    } catch (e) {
      // Если email не ушел — считаем это ошибкой, чтобы не терять заявки
      console.error('Email send failed:', e)
      return NextResponse.json(
        { success: false, error: 'Не удалось отправить письмо. Попробуйте позже.' },
        { status: 502 }
      )
    }
    
    // Логирование для отладки
    console.log('Новая заявка сохранена:', {
      id: contactRequest.id,
      name: contactRequest.name,
      phone: contactRequest.phone,
      timestamp: contactRequest.createdAt
    })
    
    // Параллельно отправляем лид в Bitrix24 (не блокируем ответ клиенту)
    createBitrixLead(body).then((res) => {
      if ((res as any).error) {
        console.error('Bitrix24 integration failed:', (res as any).error)
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
      data: {
        id: contactRequest.id,
        status: 'received'
      }
    })
    
  } catch (error) {
    console.error('Contact API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при отправке заявки. Попробуйте еще раз.' 
      },
      { status: 500 }
    )
  }
}

// Получение заявок (для админ панели)
export async function GET(request: NextRequest) {
  try {
    const adminKey = process.env.ADMIN_API_KEY
    const headerKey = request.headers.get('x-admin-key')
    if (!adminKey || headerKey !== adminKey) {
      return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 })
    }

    const requests = await prisma.contactRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const formattedRequests = requests.map(request => ({
      id: request.id,
      name: request.name,
      phone: request.phone,
      email: request.email,
      company: request.company,
      message: request.message,
      equipment: request.equipment,
      status: request.status,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString()
    }))

    return NextResponse.json({ success: true, data: formattedRequests })
    
  } catch (error) {
    console.error('Contact GET API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при получении заявок' 
      },
      { status: 500 }
    )
  }
}
