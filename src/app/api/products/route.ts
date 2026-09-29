import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { catalogWhere } from '@/lib/catalog-filter'
import { parseCatalog } from '@/lib/catalog-state'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const state = parseCatalog(searchParams)
    const where = await catalogWhere(searchParams)
    const limit = state.limit
    const totalProducts = await prisma.product.count({ where })
    const page = Math.min(
      state.page,
      Math.max(1, Math.ceil(totalProducts / limit))
    )
    // Получение товаров с пагинацией
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        specifications: {
          orderBy: { sortOrder: 'asc' },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy:
        state.sort === 'price-asc'
          ? [{ price: 'asc' }, { id: 'asc' }]
          : state.sort === 'price-desc'
            ? [{ price: 'desc' }, { id: 'asc' }]
            : [{ name: 'asc' }, { id: 'asc' }],
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
      manufacturerPartNumber: product.manufacturerPartNumber,
      endUserRequired: product.endUserRequired,
      price: parseFloat(product.price.toString()),
      oldPrice: product.oldPrice
        ? parseFloat(product.oldPrice.toString())
        : undefined,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      isAvailable: product.isAvailable,
      stock: product.stock,
      minOrder: product.minOrder,
      weight: product.weight
        ? parseFloat(product.weight.toString())
        : undefined,
      dimensions: product.dimensions,
      images: JSON.parse(product.images || '[]'),
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        description: product.category.description,
        sortOrder: product.category.sortOrder,
        isActive: product.category.isActive,
      },
      brand: product.brand
        ? {
            id: product.brand.id,
            name: product.brand.name,
            slug: product.brand.slug,
            logo: product.brand.logo,
            description: product.brand.description,
            website: product.brand.website,
            isActive: product.brand.isActive,
          }
        : undefined,
      specifications: product.specifications.map((spec: any) => ({
        id: spec.id,
        name: spec.name,
        value: spec.value,
        group: spec.group,
        sortOrder: spec.sortOrder,
      })),
      tags: product.tags.map((tagRel: any) => ({
        id: tagRel.tag.id,
        name: tagRel.tag.name,
        slug: tagRel.tag.slug,
        color: tagRel.tag.color,
      })),
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
      seoKeywords: product.seoKeywords,
      viewCount: product.viewCount,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
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
          limit,
        },
      },
    })
  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Ошибка при получении товаров',
      },
      { status: 500 }
    )
  }
}
