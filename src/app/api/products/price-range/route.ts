import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Параметры фильтрации (без цены)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    
    // Построение условий фильтрации
    const where: any = {
      isAvailable: true,
    }
    
    // Массив для AND условий
    const andConditions: any[] = []
    
    // Фильтрация по категории (поддержка множественного выбора)
    if (category && category !== 'all') {
      const categories = category.split(',')
      andConditions.push({
        categoryId: {
          in: categories
        }
      })
    }
    
    // Фильтрация по бренду (поддержка множественного выбора)
    if (brand && brand !== 'all') {
      const brands = brand.split(',')
      andConditions.push({
        brandId: {
          in: brands
        }
      })
    }
    
    // Поиск по названию, описанию и характеристикам
    if (search) {
      const searchLower = search.toLowerCase()
      andConditions.push({
        OR: [
          { name: { contains: searchLower, mode: 'insensitive' } },
          { description: { contains: searchLower, mode: 'insensitive' } },
          { shortDescription: { contains: searchLower, mode: 'insensitive' } },
          { sku: { contains: searchLower, mode: 'insensitive' } },
          { 
            specifications: {
              some: {
                OR: [
                  { name: { contains: searchLower, mode: 'insensitive' } },
                  { value: { contains: searchLower, mode: 'insensitive' } }
                ]
              }
            }
          }
        ]
      })
    }
    
    // Применяем AND условия если они есть
    if (andConditions.length > 0) {
      where.AND = andConditions
    }
    
    // Получение минимальной и максимальной цены
    const priceStats = await prisma.product.aggregate({
      where,
      _min: {
        price: true
      },
      _max: {
        price: true
      }
    })
    
    // Проверяем, есть ли товары
    const productCount = await prisma.product.count({ where })
    
    let minPrice = 0
    let maxPrice = 200000
    
    if (productCount > 0 && priceStats._min.price && priceStats._max.price) {
      minPrice = parseFloat(priceStats._min.price.toString())
      maxPrice = parseFloat(priceStats._max.price.toString())
    }
    
    return NextResponse.json({
      success: true,
      data: {
        minPrice,
        maxPrice
      }
    })
    
  } catch (error) {
    console.error('Price Range API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при получении диапазона цен' 
      },
      { status: 500 }
    )
  }
}
