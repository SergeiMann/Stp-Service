import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Параметры фильтрации
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    
    console.log('Products API params:', { category, brand, search, minPrice, maxPrice, page, limit })
    
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
    
    // Фильтрация по цене
    if (minPrice || maxPrice) {
      const priceCondition: any = {}
      if (minPrice && !isNaN(parseFloat(minPrice))) {
        priceCondition.gte = parseFloat(minPrice)
      }
      if (maxPrice && !isNaN(parseFloat(maxPrice))) {
        priceCondition.lte = parseFloat(maxPrice)
      }
      
      if (Object.keys(priceCondition).length > 0) {
        andConditions.push({
          price: priceCondition
        })
      }
    }
    
    // Применяем AND условия если они есть
    if (andConditions.length > 0) {
      where.AND = andConditions
    }
    
    console.log('Prisma where condition:', JSON.stringify(where, null, 2))
    
    // Подсчет общего количества товаров
    const totalProducts = await prisma.product.count({ where })
    console.log('Total products found:', totalProducts)
    
    // Получение товаров с пагинацией
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        specifications: {
          orderBy: { sortOrder: 'asc' }
        },
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { isNew: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * limit,
      take: limit,
    })
    
    // Преобразование данных в нужный формат
    const formattedProducts = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      sku: product.sku,
      price: parseFloat(product.price.toString()),
      oldPrice: product.oldPrice ? parseFloat(product.oldPrice.toString()) : undefined,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      isAvailable: product.isAvailable,
      stock: product.stock,
      minOrder: product.minOrder,
      weight: product.weight ? parseFloat(product.weight.toString()) : undefined,
      dimensions: product.dimensions,
      images: JSON.parse(product.images || '[]'),
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        description: product.category.description,
        sortOrder: product.category.sortOrder,
        isActive: product.category.isActive
      },
      brand: product.brand ? {
        id: product.brand.id,
        name: product.brand.name,
        slug: product.brand.slug,
        logo: product.brand.logo,
        description: product.brand.description,
        website: product.brand.website,
        isActive: product.brand.isActive
      } : undefined,
      specifications: product.specifications.map((spec: any) => ({
        id: spec.id,
        name: spec.name,
        value: spec.value,
        group: spec.group,
        sortOrder: spec.sortOrder
      })),
      tags: product.tags.map((tagRel: any) => ({
        id: tagRel.tag.id,
        name: tagRel.tag.name,
        slug: tagRel.tag.slug,
        color: tagRel.tag.color
      })),
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
      seoKeywords: product.seoKeywords,
      viewCount: product.viewCount,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }))
    
    // Статистика пагинации
    const totalPages = Math.ceil(totalProducts / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return NextResponse.json({
      success: true,
      data: {
        products: formattedProducts,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          hasNextPage,
          hasPrevPage,
          limit
        }
      }
    })
    
  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при получении товаров' 
      },
      { status: 500 }
    )
  }
}
