import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { catalogWhere } from '@/lib/catalog-filter'
import { parseCatalog } from '@/lib/catalog-state'
import { equipmentSections } from '@/lib/equipment-sections'
import { categoryProductWhere } from '@/lib/catalog-categories'
import { buildCatalogTaxonomy, CatalogCategory } from '@/lib/catalog-taxonomy'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  try {
    const where = await catalogWhere(
      request?.nextUrl.searchParams ?? new URLSearchParams(),
      'category'
    )
    const [categories, counts, brands] = await Promise.all([
      prisma.category.findMany({
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      prisma.product.groupBy({ by: ['categoryId'], where, _count: true }),
      prisma.brand.findMany({ select: { name: true } }),
    ])
    const direct = new Map(counts.map(c => [c.categoryId, c._count]))
    const selected = parseCatalog(
      request?.nextUrl.searchParams ?? new URLSearchParams()
    ).category
    type VisibleCategory = CatalogCategory & { productsCount: number; children: VisibleCategory[] }
    function visibleNode(node: CatalogCategory): VisibleCategory {
      return {
        ...node,
        productsCount: node.sourceIds.reduce((sum, id) => sum + (direct.get(id) ?? 0), 0),
        children: node.children.map(visibleNode).filter(keep),
      }
    }
    function keep(node: VisibleCategory): boolean {
      return node.productsCount > 0 || node.children.length > 0 || selected.some(id => id === node.id || node.aliases.includes(id))
    }
    const visible = buildCatalogTaxonomy(categories, brands).map(visibleNode).filter(keep)
    // Retain the selected cross-manufacturer section, including an empty one,
    // so the catalog shows its name and lets the user remove the filter.
    const sections = await Promise.all(
      equipmentSections
        .filter(section => selected.includes(section.slug))
        .map(async section => ({
          id: section.slug,
          slug: section.slug,
          name: section.name,
          productsCount: await prisma.product.count({
            where: { AND: [where, await categoryProductWhere([section.slug])] },
          }),
          children: [],
        }))
    )
    return NextResponse.json({ success: true, data: [...sections, ...visible] })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Не удалось загрузить категории' },
      { status: 500 }
    )
  }
}
