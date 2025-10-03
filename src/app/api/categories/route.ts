import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
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
        sortOrder: 'asc'
      }
    })

    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      parentId: category.parentId,
      productsCount: category._count.products,
      sortOrder: category.sortOrder,
      isActive: category.isActive
    }))

    return NextResponse.json({
      success: true,
      data: formattedCategories
    })
  } catch (error) {
    console.error('Categories API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при получении категорий' 
      },
      { status: 500 }
    )
  }
}
