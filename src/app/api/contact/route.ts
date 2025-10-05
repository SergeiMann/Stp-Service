import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(32),
  email: z.string().email().optional(),
  company: z.string().max(100).optional(),
  message: z.string().min(5).max(2000),
  equipment: z.string().max(100).optional(),
})

const limiter = rateLimit({ intervalMs: 60_000, uniqueTokenPerInterval: 1000 })

interface ContactFormData {
  name: string
  phone: string
  email?: string
  company?: string
  message: string
  equipment?: string
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
      return NextResponse.json({ success: false, error: 'Некорректные данные' }, { status: 400 })
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
    
    // Логирование для отладки
    console.log('Новая заявка сохранена:', {
      id: contactRequest.id,
      name: contactRequest.name,
      phone: contactRequest.phone,
      timestamp: contactRequest.createdAt
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
