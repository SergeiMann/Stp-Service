import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        // В сайдбаре показываем только наши "логические" категории,
        // а не технические уровни каталога из ThinkLink
        externalSource: null,
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

    // Плоский список → дерево категорий (parentId -> children)
    type CategoryNode = {
      id: string
      name: string
      slug: string
      description: string | null
      image: string | null
      parentId: string | null
      productsCount: number
      sortOrder: number
      isActive: boolean
      children?: CategoryNode[]
    }

    const byId = new Map<string, CategoryNode>()
    const roots: CategoryNode[] = []

    for (const category of categories) {
      byId.set(category.id, {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        parentId: category.parentId,
        productsCount: category._count.products,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        children: [],
      })
    }

    for (const category of categories) {
      const node = byId.get(category.id)!
      if (category.parentId && byId.has(category.parentId)) {
        const parent = byId.get(category.parentId)!
        if (!parent.children) parent.children = []
        parent.children.push(node)
      } else {
        roots.push(node)
      }
    }

    // Сортируем детей по sortOrder
    const sortTree = (nodes: CategoryNode[]) => {
      nodes.sort((a, b) => a.sortOrder - b.sortOrder)
      for (const n of nodes) {
        if (n.children && n.children.length > 0) {
          sortTree(n.children)
        }
      }
    }
    sortTree(roots)

    return NextResponse.json({
      success: true,
      data: roots
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
