import { prisma } from './prisma'

export async function categoryIdsWithChildren(ids: string[]) {
  const categories = await prisma.category.findMany({
    select: { id: true, parentId: true, slug: true },
  })
  const selected = new Set(
    categories
      .filter(c => ids.includes(c.id) || ids.includes(c.slug))
      .map(c => c.id)
  )
  let changed = true
  while (changed) {
    changed = false
    for (const category of categories) {
      if (
        category.parentId &&
        selected.has(category.parentId) &&
        !selected.has(category.id)
      ) {
        selected.add(category.id)
        changed = true
      }
    }
  }
  return [...selected]
}
