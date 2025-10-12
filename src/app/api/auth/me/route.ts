import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.uid },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден или заблокирован' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true, data: { user } })
  } catch (error) {
    console.error('Me API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении данных пользователя' },
      { status: 500 }
    )
  }
}
