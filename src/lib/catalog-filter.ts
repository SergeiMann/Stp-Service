import { Prisma } from '@prisma/client'
import { parseCatalog } from './catalog-state'
import { categoryIdsWithChildren } from './catalog-categories'

// All facets share the same sellable-price and stock rules. A facet excludes
// its own selection so users can add alternatives with OR semantics.
export async function catalogWhere(
  params: URLSearchParams,
  omit?: 'category' | 'brand' | 'price'
): Promise<Prisma.ProductWhereInput> {
  const s = parseCatalog(params)
  s.search = s.search.trim()
  const where: Prisma.ProductWhereInput = {
    price: { gt: 0, lt: Number.MAX_VALUE },
  }
  if (s.stock === 'in') where.stock = { gt: 0 }
  if (s.search)
    where.OR = [
      { name: { contains: s.search, mode: 'insensitive' } },
      { sku: { contains: s.search, mode: 'insensitive' } },
    ]
  if (omit !== 'category' && s.category.length)
    where.categoryId = { in: await categoryIdsWithChildren(s.category) }
  if (omit !== 'brand' && s.brand.length)
    where.brand = { OR: [{ id: { in: s.brand } }, { slug: { in: s.brand } }] }
  if (omit !== 'price')
    where.price = {
      gt: 0,
      lt: Number.MAX_VALUE,
      ...(s.min !== '' ? { gte: Number(s.min) } : {}),
      ...(s.max !== '' ? { lte: Number(s.max) } : {}),
    }
  return where
}
