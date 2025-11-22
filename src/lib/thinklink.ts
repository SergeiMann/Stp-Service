import { prisma } from './prisma'
import { env } from './env'
import { slugify } from './utils'

type ThinkLinkOperationStatus =
  | 'OK'
  | 'BAD_LOGIN'
  | 'AUTH_FAILED'
  | 'IP_FAILED'
  | 'MAX_REQUEST_MINUTE'
  | 'MAX_REQUEST_HOUR'
  | 'MAX_REQUEST_DAY'
  | 'API_INACTIVE'
  | 'BAD_PARAMS'
  | 'INNER_ERROR'
  | 'ORDER_BAD_ITEMS'
  | 'ORDER_BAD_ID'
  | 'ORDER_NOT_EDITABLE'
  | 'ORDER_SUBMITED'
  | 'ORDER_BAD_END_USER'
  | 'ORDER_BAD_CONTRACT'

interface ThinkLinkPaginatedResult<T> {
  current_page: number
  data: T[]
  from: number
  last_page: number
  to: number
  total: number
}

interface ThinkLinkResponse<T> {
  OperationStatus: ThinkLinkOperationStatus
  ErrorText: string
  ErrorDetails: string
  EffectiveDate: string
  Result: ThinkLinkPaginatedResult<T> | T | null
}

// catalog
export interface ThinkLinkCatalogItem {
  level: number
  sourceId: number
  parentId: number
  name: string
}

// items
export interface ThinkLinkItem {
  itemId: string
  itemName: string
  CatalogueLevel1: number
  CatalogueLevel2: number
  CatalogueLevel3: number
  IsEndUserRequired: number
  VendorPartnumber: string
  brand?: {
    code: string
    tl_name: string
  }
}

// price
export interface ThinkLinkPrice {
  itemId: string
  currency: 'USD' | 'EUR' | 'RUR' | string
  IsGPLPrice: number
  price: number
}

// qty
export interface ThinkLinkQty {
  itemId: string
  qty: number
}

// rates
export interface ThinkLinkRates {
  RUR_EUR: number
  EUR_RUR: number
  RUR_USD: number
  USD_RUR: number
  EUR_USD: number
  USD_EUR: number
}

const THINKLINK_SOURCE = 'THINKLINK'

function ensureCredentials() {
  if (!env.THINKLINK_LOGIN || !env.THINKLINK_TOKEN) {
    throw new Error('THINKLINK_LOGIN/THINKLINK_TOKEN не заданы в env')
  }
}

async function thinkLinkRequest<T>(
  method: string,
  extraParams: Record<string, string | number | undefined> = {}
): Promise<ThinkLinkResponse<T>> {
  ensureCredentials()

  const params = new URLSearchParams()
  params.set('login', env.THINKLINK_LOGIN as string)
  params.set('token', env.THINKLINK_TOKEN as string)

  for (const [key, value] of Object.entries(extraParams)) {
    if (value === undefined || value === null) continue
    params.set(key, String(value))
  }

  const base = env.THINKLINK_API_BASE || 'https://thinklink.ru/api'
  const url = `${base}/${method}?${params.toString()}`

  const res = await fetch(url, {
    method: 'GET',
  })

  // У ThinkLink ошибки могут приходить с HTTP 404, но с валидным JSON и OperationStatus != OK.
  // Поэтому сначала пробуем прочитать тело как JSON, даже если статус не 2xx.
  let data: ThinkLinkResponse<T>
  try {
    data = (await res.json()) as ThinkLinkResponse<T>
  } catch (e) {
    if (!res.ok) {
      throw new Error(`ThinkLink HTTP ${res.status} for ${method}`)
    }
    throw e
  }

  if (data.OperationStatus !== 'OK') {
    throw new Error(
      `ThinkLink error for ${method}: ${data.OperationStatus} ${data.ErrorText} ${data.ErrorDetails}`
    )
  }

  return data
}

async function fetchAllPages<T>(method: string, baseParams: Record<string, string | number | undefined> = {}) {
  const first = await thinkLinkRequest<ThinkLinkPaginatedResult<T>>(method, {
    ...baseParams,
    page: 1,
  })

  const result = first.Result as ThinkLinkPaginatedResult<T>
  if (!result) return []

  const items: T[] = [...result.data]

  for (let page = 2; page <= result.last_page; page++) {
    const next = await thinkLinkRequest<ThinkLinkPaginatedResult<T>>(method, {
      ...baseParams,
      page,
    })
    const nextResult = next.Result as ThinkLinkPaginatedResult<T>
    if (!nextResult) break
    items.push(...nextResult.data)
  }

  return items
}

export async function fetchThinkLinkCatalog(): Promise<ThinkLinkCatalogItem[]> {
  return fetchAllPages<ThinkLinkCatalogItem>('catalog')
}

export async function fetchThinkLinkItems(): Promise<ThinkLinkItem[]> {
  // includeBrand=1 чтобы сразу получить бренды
  return fetchAllPages<ThinkLinkItem>('items', { includeBrand: 1 })
}

export async function fetchThinkLinkPrices(): Promise<ThinkLinkPrice[]> {
  return fetchAllPages<ThinkLinkPrice>('price')
}

export async function fetchThinkLinkQty(): Promise<ThinkLinkQty[]> {
  return fetchAllPages<ThinkLinkQty>('qty')
}

export async function fetchThinkLinkRates(): Promise<ThinkLinkRates> {
  const res = await thinkLinkRequest<ThinkLinkRates>('rates')
  return res.Result as ThinkLinkRates
}

function pickBestPrice(
  prices: ThinkLinkPrice[],
  rates?: ThinkLinkRates
): { price: number; currency: string; isGpl: boolean } | null {
  if (!prices.length) return null

  // Сначала пробуем RUR
  const rur = prices.find((p) => p.currency === 'RUR')
  if (rur) {
    return { price: rur.price, currency: rur.currency, isGpl: rur.IsGPLPrice === 1 }
  }

  // Если нет RUR, попробуем конвертнуть из USD/EUR по курсам
  if (!rates) {
    // fallback — берем первую цену как есть
    const p = prices[0]
    return { price: p.price, currency: p.currency, isGpl: p.IsGPLPrice === 1 }
  }

  const byCurrency: Record<string, ThinkLinkPrice[]> = {}
  for (const p of prices) {
    if (!byCurrency[p.currency]) byCurrency[p.currency] = []
    byCurrency[p.currency].push(p)
  }

  // Предпочитаем USD, потом EUR
  if (byCurrency.USD?.length) {
    const p = byCurrency.USD[0]
    const rub = p.price * rates.USD_RUR
    return { price: rub, currency: 'RUR', isGpl: p.IsGPLPrice === 1 }
  }
  if (byCurrency.EUR?.length) {
    const p = byCurrency.EUR[0]
    const rub = p.price * rates.EUR_RUR
    return { price: rub, currency: 'RUR', isGpl: p.IsGPLPrice === 1 }
  }

  const p = prices[0]
  return { price: p.price, currency: p.currency, isGpl: p.IsGPLPrice === 1 }
}

export interface ThinkLinkSyncResult {
  categoriesCreated: number
  categoriesUpdated: number
  brandsCreated: number
  brandsUpdated: number
  productsCreated: number
  productsUpdated: number
  skippedNoPrice: number
}

export async function syncThinkLinkToDb(): Promise<ThinkLinkSyncResult> {
  ensureCredentials()

  const [catalog, items, prices, qtyList, rates] = await Promise.all([
    fetchThinkLinkCatalog(),
    fetchThinkLinkItems(),
    fetchThinkLinkPrices(),
    fetchThinkLinkQty(),
    fetchThinkLinkRates(),
  ])

  const priceByItem = new Map<string, ThinkLinkPrice[]>()
  for (const p of prices) {
    if (!priceByItem.has(p.itemId)) priceByItem.set(p.itemId, [])
    priceByItem.get(p.itemId)!.push(p)
  }

  const qtyByItem = new Map<string, number>()
  for (const q of qtyList) {
    qtyByItem.set(q.itemId, q.qty)
  }

  const result: ThinkLinkSyncResult = {
    categoriesCreated: 0,
    categoriesUpdated: 0,
    brandsCreated: 0,
    brandsUpdated: 0,
    productsCreated: 0,
    productsUpdated: 0,
    skippedNoPrice: 0,
  }

  // ---- CATEGORIES ----
  const existingCategories = await prisma.category.findMany({
    where: { externalSource: THINKLINK_SOURCE } as any,
  } as any)
  const categoryByExternalId = new Map<number, any>()
  for (const c of existingCategories as any[]) {
    if (c.externalCatalogId != null) {
      categoryByExternalId.set(c.externalCatalogId as number, c)
    }
  }

  // Сначала уровни 1, потом 2, потом 3
  const sortedCatalog = [...catalog].sort(
    (a, b) => Number((a as any).level) - Number((b as any).level)
  )

  for (const cat of sortedCatalog) {
    const level = Number((cat as any).level)
    const sourceId = Number((cat as any).sourceId)
    const parentSourceId = cat.parentId ? Number((cat as any).parentId) : 0

    const existing = categoryByExternalId.get(sourceId)
    const slug = slugify(cat.name)

    let parentId: string | null = null
    if (level > 1 && parentSourceId) {
      const parent = categoryByExternalId.get(parentSourceId)
      parentId = parent ? parent.id : null
    }

    if (!existing) {
      const createCategory = async (slugToUse: string) =>
        (prisma as any).category.create({
          data: {
            name: cat.name,
            slug: slugToUse,
            description: null,
            image: null,
            externalSource: THINKLINK_SOURCE,
            externalCatalogId: sourceId,
            externalLevel: level,
            parentId: parentId ?? undefined,
            sortOrder: level * 1000 + sourceId,
            isActive: true,
          },
        })

      let created
      try {
        created = await createCategory(slug)
      } catch (e: any) {
        // slug уже занят (например, нашей ручной категорией) — добавляем sourceId для уникальности
        if (e && e.code === 'P2002' && e.meta?.target?.includes?.('slug')) {
          const altSlug = `${slug}-${sourceId}`
          created = await createCategory(altSlug)
        } else {
          throw e
        }
      }

      categoryByExternalId.set(sourceId, created)
      result.categoriesCreated++
    } else {
      const updated = await (prisma as any).category.update({
        where: { id: existing.id },
        data: {
          name: cat.name,
          slug,
          externalLevel: level,
          parentId: parentId ?? undefined,
        },
      })
      categoryByExternalId.set(sourceId, updated)
      result.categoriesUpdated++
    }
  }

  // ---- BRANDS ----
  const existingBrands = await (prisma as any).brand.findMany({
    where: { externalCode: { not: null } },
  } as any)
  const brandByCode = new Map<string, any>()
  for (const b of existingBrands) {
    if (b.externalCode) brandByCode.set(b.externalCode, b)
  }

  for (const item of items) {
    if (!item.brand) continue
    const code = item.brand.code
    if (!code) continue

    if (!brandByCode.has(code)) {
      const name = item.brand.tl_name || code
      const slug = slugify(name)
      const created = await (prisma as any).brand.create({
        data: {
          name,
          slug,
          externalCode: code,
          isActive: true,
        },
      })
      brandByCode.set(code, created)
      result.brandsCreated++
    } else {
      const existing = brandByCode.get(code)!
      const name = item.brand.tl_name || existing.name
      const slug = slugify(name)
      const updated = await (prisma as any).brand.update({
        where: { id: existing.id },
        data: {
          name,
          slug,
        },
      })
      brandByCode.set(code, updated)
      result.brandsUpdated++
    }
  }

  // ---- PRODUCTS ----
  const existingProducts = await (prisma as any).product.findMany({
    where: { externalSource: THINKLINK_SOURCE },
    select: { id: true, externalItemId: true },
  } as any)
  const productByExternalId = new Map<string, { id: string; externalItemId: string | null }>()
  for (const p of existingProducts) {
    if (p.externalItemId) {
      productByExternalId.set(p.externalItemId, p)
    }
  }

  for (const item of items) {
    const itemPrices = priceByItem.get(item.itemId) || []
    const bestPrice = pickBestPrice(itemPrices, rates)
    if (!bestPrice) {
      result.skippedNoPrice++
      continue
    }

    const qty = qtyByItem.get(item.itemId) ?? 0
    const isAvailable = qty > 0

    // Категория: берем приоритетно уровень 3, потом 2, потом 1
    const catId =
      categoryByExternalId.get(item.CatalogueLevel3)?.id ||
      categoryByExternalId.get(item.CatalogueLevel2)?.id ||
      categoryByExternalId.get(item.CatalogueLevel1)?.id

    if (!catId) {
      // если нет категории — пропускаем
      result.skippedNoPrice++
      continue
    }

    const brandCode = item.brand?.code
    const brand = brandCode ? brandByCode.get(brandCode) : undefined

    const name = item.itemName || item.itemId
    const baseSlug = slugify(name)
    const slug = `${baseSlug}-${item.itemId.toLowerCase()}`

    const existing = productByExternalId.get(item.itemId)

    if (!existing) {
      const created = await (prisma as any).product.create({
        data: {
          name,
          slug,
          description: null,
          shortDescription: null,
          sku: item.itemId,
          externalSource: THINKLINK_SOURCE,
          externalItemId: item.itemId,
          price: bestPrice.price,
          oldPrice: null,
          currency: bestPrice.currency,
          isGplPrice: bestPrice.isGpl,
          isNew: false,
          isFeatured: false,
          isAvailable,
          stock: qty,
          minOrder: 1,
          weight: null,
          dimensions: undefined,
          images: JSON.stringify([]),
          seoTitle: null,
          seoDescription: null,
          seoKeywords: null,
          viewCount: 0,
          categoryId: catId,
          brandId: brand?.id,
        },
      })
      productByExternalId.set(item.itemId, { id: created.id, externalItemId: item.itemId })
      result.productsCreated++
    } else {
      await (prisma as any).product.update({
        where: { id: existing.id },
        data: {
          name,
          price: bestPrice.price,
          currency: bestPrice.currency,
          isGplPrice: bestPrice.isGpl,
          isAvailable,
          stock: qty,
          categoryId: catId,
          brandId: brand?.id,
        },
      })
      result.productsUpdated++
    }
  }

  return result
}


