import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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
    const body: ContactFormData = await request.json()
    
    // Валидация обязательных полей
    if (!body.name || !body.phone || !body.message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Заполните все обязательные поля' 
        },
        { status: 400 }
      )
    }
    
    // Валидация телефона (простая)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Некорректный формат телефона' 
        },
        { status: 400 }
      )
    }
    
    // Валидация email (если указан)
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Некорректный формат email' 
          },
          { status: 400 }
        )
      }
    }
    
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
export async function GET() {
  try {
    const requests = await prisma.contactRequest.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Последние 50 заявок
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

    return NextResponse.json({
      success: true,
      data: formattedRequests
    })
    
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
