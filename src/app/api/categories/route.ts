import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { catalogWhere } from '@/lib/catalog-filter'
import { parseCatalog } from '@/lib/catalog-state'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  try {
    const where = await catalogWhere(
      request?.nextUrl.searchParams ?? new URLSearchParams(),
      'category'
    )
    const [categories, counts] = await Promise.all([
      prisma.category.findMany({
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      prisma.product.groupBy({ by: ['categoryId'], where, _count: true }),
    ])
    const direct = new Map(counts.map(c => [c.categoryId, c._count]))
    type Node = (typeof categories)[number] & {
      productsCount: number
      children: Node[]
    }
    const nodes = new Map<string, Node>(
      categories.map(c => [
        c.id,
        { ...c, productsCount: direct.get(c.id) || 0, children: [] },
      ])
    )
    const roots: Node[] = []
    nodes.forEach(n => {
      const parent = n.parentId && nodes.get(n.parentId)
      if (parent) parent.children.push(n)
      else roots.push(n)
    })
    const selected = parseCatalog(
      request?.nextUrl.searchParams ?? new URLSearchParams()
    ).category
    function prune(n: Node): boolean {
      const kept = n.children.filter(prune)
      n.productsCount += n.children.reduce((sum, c) => sum + c.productsCount, 0)
      n.children = kept
      return (
        n.productsCount > 0 ||
        kept.length > 0 ||
        selected.includes(n.id) ||
        selected.includes(n.slug)
      )
    }
    return NextResponse.json({ success: true, data: roots.filter(prune) })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Не удалось загрузить категории' },
      { status: 500 }
    )
  }
}
