import { createHash } from 'node:crypto'

type SourceCategory = {
  id: string
  slug: string
  name: string
  parentId: string | null
  externalSource: string | null
  externalLevel: number | null
}

export type CatalogCategory = {
  id: string
  slug: string
  name: string
  sourceIds: string[]
  aliases: string[]
  children: CatalogCategory[]
}

function categoryName(name: string) {
  const clean = name.normalize('NFKC').trim().replace(/\s+/g, ' ')
  if (/^(сервер|сервера|серверы)$/iu.test(clean)) return 'Серверы'
  if (/^терминал(?:ы)? сбора данных$/iu.test(clean)) return 'Терминалы сбора данных'
  if (/^сканеры штрих[ -]код(?:а|ов)$/iu.test(clean)) return 'Сканеры штрих-кода'
  return clean
}

// Keep supplier IDs intact for imports; expose a manufacturer-independent tree.
// Merge within the same equipment path so unrelated "Accessories" stay separate.
export function buildCatalogTaxonomy(categories: SourceCategory[], brands: { name: string }[]) {
  const brandNames = new Set(brands.map(b => categoryName(b.name).toLocaleLowerCase('ru')))
  const byParent = new Map<string | null, SourceCategory[]>()
  const ids = new Set(categories.map(c => c.id))
  for (const category of categories) {
    const parent = category.parentId && ids.has(category.parentId) ? category.parentId : null
    byParent.set(parent, [...(byParent.get(parent) ?? []), category])
  }
  function merge(sources: SourceCategory[], path: string[]): CatalogCategory[] {
    const groups = new Map<string, SourceCategory[]>()
    const promote = (category: SourceCategory) => {
      const name = categoryName(category.name)
      const key = name.toLocaleLowerCase('ru')
      if ((category.externalSource === 'THINKLINK' && category.externalLevel === 1) || brandNames.has(key)) {
        for (const child of byParent.get(category.id) ?? []) promote(child)
        // Preserve products assigned directly to a manufacturer category.
        const other = { ...category, name: 'Прочие товары' }
        groups.set('прочие товары', [...(groups.get('прочие товары') ?? []), other])
      } else {
        groups.set(key, [...(groups.get(key) ?? []), category])
      }
    }
    sources.forEach(promote)
    return [...groups.entries()].map(([key, group]) => {
      const id = 'category-' + createHash('sha256').update(JSON.stringify([...path, key])).digest('hex').slice(0, 24)
      const children = key === 'прочие товары' ? [] : merge(group.flatMap(c => byParent.get(c.id) ?? []), [...path, key])
      return {
        id, slug: id, name: categoryName(group[0].name),
        aliases: group.flatMap(c => [c.id, c.slug]),
        sourceIds: [...new Set([...group.map(c => c.id), ...children.flatMap(c => c.sourceIds)])],
        children,
      }
    }).sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }
  return merge(byParent.get(null) ?? [], [])
}

export function flattenCatalogTaxonomy(nodes: CatalogCategory[]): CatalogCategory[] {
  return nodes.flatMap(node => [node, ...flattenCatalogTaxonomy(node.children)])
}
