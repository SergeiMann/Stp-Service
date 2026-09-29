import { prisma } from './prisma'
import { resolveCategoryIds } from './equipment-sections'
import { equipmentSections, isEquipmentProduct } from './equipment-sections'
import { Prisma } from '@prisma/client'
import { buildCatalogTaxonomy, flattenCatalogTaxonomy } from './catalog-taxonomy'

export async function categoryProductWhere(
  ids: string[]
): Promise<Prisma.ProductWhereInput> {
  const sections = ids.filter(id =>
    equipmentSections.some(section => section.slug === id)
  )
  const ordinary = ids.filter(id => !sections.includes(id))
  const alternatives: Prisma.ProductWhereInput[] = []
  if (ordinary.length)
    alternatives.push({
      categoryId: { in: await categoryIdsWithChildren(ordinary, true) },
    })
  for (const section of sections) {
    const candidates = await prisma.product.findMany({
      where: { categoryId: { in: await categoryIdsWithChildren([section]) } },
      select: { id: true, name: true },
    })
    alternatives.push({
      id: {
        in: candidates
          .filter(product => isEquipmentProduct(section, product.name))
          .map(product => product.id),
      },
    })
  }
  return { OR: alternatives }
}

export async function categoryIdsWithChildren(ids: string[], mergeAliases = false) {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany(),
    prisma.brand.findMany({ select: { name: true } }),
  ])
  const groups = flattenCatalogTaxonomy(buildCatalogTaxonomy(categories, brands))
  const matched = groups.filter(group => ids.some(id =>
    id === group.id || (mergeAliases && group.aliases.includes(id))
  ))
  const grouped = ids.filter(id => id.startsWith('category-') ||
    (mergeAliases && matched.some(group => group.aliases.includes(id))))
  return [...new Set([
    ...resolveCategoryIds(categories, ids.filter(id => !grouped.includes(id))),
    ...matched.flatMap(group => group.sourceIds),
  ])]
}
