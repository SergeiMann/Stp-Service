import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

interface LoginData {
  email: string
  password?: string
  name?: string
  phone?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginData = await request.json()
    
    // Валидация email
    if (!body.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email обязателен' 
        },
        { status: 400 }
      )
    }
    
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
    
    // Поиск пользователя
    let user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase().trim() }
    })
    
    if (!user) {
      // Для демо: создаем нового пользователя только если нет пароля
      if (!body.password) {
        user = await prisma.user.create({
          data: {
            email: body.email.toLowerCase().trim(),
            name: body.name?.trim() || null,
            phone: body.phone?.trim() || null,
            role: 'USER'
          }
        })
        
        console.log('Новый пользователь создан:', {
          id: user.id,
          email: user.email,
          name: user.name
        })
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Пользователь не найден' 
          },
          { status: 401 }
        )
      }
    } else {
      // Проверка пароля для существующих пользователей
      if (user.password && body.password !== user.password) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Неверный пароль' 
          },
          { status: 401 }
        )
      }
      
      if (!user.isActive) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Аккаунт заблокирован' 
          },
          { status: 403 }
        )
      }
    }
    
    // Создаем простую сессию (в реальном проекте использовать JWT или NextAuth)
    const sessionData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      timestamp: Date.now()
    }
    
    // Устанавливаем cookie с сессией
    const cookieStore = cookies()
    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 дней
    })
    
    return NextResponse.json({
      success: true,
      message: 'Успешная авторизация',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
    
  } catch (error) {
    console.error('Login API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при авторизации' 
      },
      { status: 500 }
    )
  }
}
