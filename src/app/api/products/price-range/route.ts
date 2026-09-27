import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { catalogWhere } from '@/lib/catalog-filter'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  try {
    const where = await catalogWhere(request.nextUrl.searchParams, 'price')
    const stats = await prisma.product.aggregate({
      where,
      _min: { price: true },
      _max: { price: true },
      _count: true,
    })
    return NextResponse.json({
      success: true,
      data: {
        minPrice: stats._min.price,
        maxPrice: stats._max.price,
        count: stats._count,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Не удалось загрузить диапазон цен' },
      { status: 500 }
    )
  }
}
