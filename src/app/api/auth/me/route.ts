import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Получаем сессию из cookie
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('session')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Не авторизован' 
        },
        { status: 401 }
      )
    }
    
    let sessionData
    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Некорректная сессия' 
        },
        { status: 401 }
      )
    }
    
    // Проверяем актуальность сессии (7 дней)
    const maxAge = 60 * 60 * 24 * 7 * 1000 // 7 дней в миллисекундах
    if (Date.now() - sessionData.timestamp > maxAge) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Сессия истекла' 
        },
        { status: 401 }
      )
    }
    
    // Получаем актуальные данные пользователя
    const user = await prisma.user.findUnique({
      where: { id: sessionData.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true
      }
    })
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Пользователь не найден или заблокирован' 
        },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        user
      }
    })
    
  } catch (error) {
    console.error('Me API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при получении данных пользователя' 
      },
      { status: 500 }
    )
  }
}
