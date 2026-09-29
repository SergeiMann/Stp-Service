import { Prisma } from '@prisma/client'
import { parseCatalog } from './catalog-state'
import { categoryProductWhere } from './catalog-categories'
import { prisma } from './prisma'

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
  if (s.search) {
    // A brand query refers to the manufacturer, not a component mentioned in
    // another manufacturer's long product title (e.g. Urovo with a Zebra reader).
    const brands = await prisma.brand.findMany({
      where: {
        OR: [
          { name: { equals: s.search, mode: 'insensitive' } },
          { name: { startsWith: s.search + ' ', mode: 'insensitive' } },
        ],
      },
      select: { id: true },
    })
    if (brands.length) where.brandId = { in: brands.map(brand => brand.id) }
    else
      where.OR = [
        { name: { contains: s.search, mode: 'insensitive' } },
        { sku: { contains: s.search, mode: 'insensitive' } },
        { manufacturerPartNumber: { contains: s.search, mode: 'insensitive' } },
      ]
  }
  if (omit !== 'category' && s.category.length)
    where.AND = [await categoryProductWhere(s.category)]
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
