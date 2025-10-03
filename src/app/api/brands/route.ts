import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                isAvailable: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    const formattedBrands = brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
      description: brand.description,
      website: brand.website,
      productsCount: brand._count.products,
      isActive: brand.isActive
    }))

    return NextResponse.json({
      success: true,
      data: formattedBrands
    })
  } catch (error) {
    console.error('Brands API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при получении брендов' 
      },
      { status: 500 }
    )
  }
}
