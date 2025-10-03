import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // Удаляем cookie с сессией
    const cookieStore = cookies()
    cookieStore.delete('session')
    
    return NextResponse.json({
      success: true,
      message: 'Вы успешно вышли из системы'
    })
    
  } catch (error) {
    console.error('Logout API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при выходе из системы' 
      },
      { status: 500 }
    )
  }
}
