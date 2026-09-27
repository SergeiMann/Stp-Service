import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { syncThinkLinkToDb, ThinkLinkApiError } from '@/lib/thinklink'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')

    const keyAuthorized = !!env.ADMIN_API_KEY && apiKey === env.ADMIN_API_KEY
    const sessionAuthorized = getSession()?.role === 'ADMIN' && request.headers.get('origin') === request.nextUrl.origin
    if (!keyAuthorized && !sessionAuthorized) {
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
    // Do not log raw network errors: their URLs may contain supplier credentials.
    console.error('ThinkLink sync error:', error instanceof ThinkLinkApiError ? error.code : 'SYNC_FAILED')
    return NextResponse.json(
      {
        success: false,
        error: error instanceof ThinkLinkApiError ? error.message : 'Ошибка синхронизации с ThinkLink',
        code: error instanceof ThinkLinkApiError ? error.code : 'SYNC_FAILED',
      },
      { status: error instanceof ThinkLinkApiError ? 502 : 500 }
    )
  }
}


