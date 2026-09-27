export interface CatalogState {
  search: string
  category: string[]
  brand: string[]
  min: string
  max: string
  stock: string
  sort: string
  limit: number
  page: number
}
export const defaults: CatalogState = {
  search: '',
  category: [],
  brand: [],
  min: '',
  max: '',
  stock: 'in',
  sort: 'name',
  limit: 24,
  page: 1,
}
export function parseCatalog(p: URLSearchParams): CatalogState {
  const list = (key: string) => [
    ...new Set((p.get(key) || '').split(',').filter(x => x && x !== 'all')),
  ]
  const price = (key: string, alias: string) => {
    const v = p.get(key) ?? p.get(alias)
    return v !== null &&
      v.trim() !== '' &&
      Number.isFinite(Number(v)) &&
      Number(v) >= 0
      ? v
      : ''
  }
  return {
    search: p.get('search') || p.get('q') || '',
    category: list('category'),
    brand: list('brand'),
    min: price('min', 'minPrice'),
    max: price('max', 'maxPrice'),
    stock: p.get('stock') === 'all' ? 'all' : 'in',
    sort: ['price-asc', 'price-desc'].includes(p.get('sort') || '')
      ? p.get('sort')!
      : 'name',
    limit: [12, 24, 48, 96].includes(Number(p.get('limit')))
      ? Number(p.get('limit'))
      : 24,
    page: Math.max(
      1,
      Math.min(1000000, Math.floor(Number(p.get('page')) || 1))
    ),
  }
}
export function catalogQuery(s: CatalogState) {
  const p = new URLSearchParams()
  if (s.search) p.set('search', s.search)
  if (s.category.length) p.set('category', s.category.join(','))
  if (s.brand.length) p.set('brand', s.brand.join(','))
  if (s.min !== '') p.set('min', s.min)
  if (s.max !== '') p.set('max', s.max)
  p.set('stock', s.stock)
  p.set('sort', s.sort)
  p.set('limit', String(s.limit))
  p.set('page', String(s.page))
  return p.toString()
}
