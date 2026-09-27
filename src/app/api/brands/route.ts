import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { catalogWhere } from '@/lib/catalog-filter'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  try {
    const where = await catalogWhere(request.nextUrl.searchParams, 'brand')
    const brands = await prisma.brand.findMany({
      include: { _count: { select: { products: { where } } } },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({
      success: true,
      data: brands.map(b => ({
        ...b,
        logo: b.logo || '/images/brands/generic-logo.svg',
        productsCount: b._count.products,
      })),
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Не удалось загрузить бренды' },
      { status: 500 }
    )
  }
}
