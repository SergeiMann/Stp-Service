import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
      if (!body.password) {
        // демо-режим: создаём пользователя без пароля
        user = await prisma.user.create({
          data: {
            email: body.email.toLowerCase().trim(),
            name: body.name?.trim() || null,
            phone: body.phone?.trim() || null,
            role: 'USER',
            password: null,
          }
        })
      } else {
        // создаём с хэшированным паролем
        const hash = await bcrypt.hash(body.password, 12)
        user = await prisma.user.create({
          data: {
            email: body.email.toLowerCase().trim(),
            name: body.name?.trim() || null,
            phone: body.phone?.trim() || null,
            role: 'USER',
            password: hash,
          }
        })
      }
    } else {
      if (!user.isActive) {
        return NextResponse.json(
          { success: false, error: 'Аккаунт заблокирован' },
          { status: 403 }
        )
      }

      // Проверка пароля для существующих пользователей
      if (user.password) {
        if (!body.password) {
          return NextResponse.json(
            { success: false, error: 'Пароль обязателен' },
            { status: 400 }
          )
        }
        const ok = await bcrypt.compare(body.password, user.password)
        if (!ok) {
          return NextResponse.json(
            { success: false, error: 'Неверный пароль' },
            { status: 401 }
          )
        }
      }
    }
    
    const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'CHANGE_ME_STRONG_SECRET'
    const token = jwt.sign(
      { uid: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    cookies().set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
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
