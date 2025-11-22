import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { syncThinkLinkToDb } from '@/lib/thinklink'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')

    if (!env.ADMIN_API_KEY || apiKey !== env.ADMIN_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await syncThinkLinkToDb()

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('ThinkLink sync error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Ошибка синхронизации с ThinkLink',
      },
      { status: 500 }
    )
  }
}


