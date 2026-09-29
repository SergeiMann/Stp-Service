import { prisma } from './prisma'
import { env } from './env'
import { slugify } from './utils'
import { retailPrice } from './thinklink-price'

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

export class ThinkLinkApiError extends Error {
  constructor(public readonly code: string) {
    const messages: Record<string, string> = {
      IP_FAILED: 'IP сервера не разрешён в настройках API ThinkLink.',
      AUTH_FAILED: 'ThinkLink отклонил логин или токен.',
      BAD_LOGIN: 'Некорректный формат учётных данных ThinkLink.',
      API_INACTIVE: 'API отключён в аккаунте ThinkLink.',
      MAX_REQUEST_MINUTE: 'Превышен минутный лимит запросов ThinkLink.',
      MAX_REQUEST_HOUR: 'Превышен часовой лимит запросов ThinkLink.',
      MAX_REQUEST_DAY: 'Превышен суточный лимит запросов ThinkLink.',
      SYNC_BUSY: 'Синхронизация ThinkLink уже выполняется.',
    }
    super(messages[code] || 'Ошибка ответа API ThinkLink.')
    this.name = 'ThinkLinkApiError'
  }
}

function ensureCredentials() {
  if (!env.THINKLINK_LOGIN || !env.THINKLINK_TOKEN) {
    throw new Error('THINKLINK_LOGIN/THINKLINK_TOKEN не заданы в env')
  }
}

// Shared queue across paginated methods; documented limit is 20 requests/minute.
let requestQueue: Promise<void> = Promise.resolve()
let nextRequestAt = 0
async function waitForRequestSlot() {
  const slot = requestQueue.then(async () => {
    await new Promise(resolve => setTimeout(resolve, Math.max(0, nextRequestAt - Date.now())))
    nextRequestAt = Date.now() + 3700
  })
  requestQueue = slot.catch(() => {})
  await slot
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

  const base = env.THINKLINK_API_BASE.replace(/\/$/, '')
  if (new URL(base).protocol !== 'https:') throw new Error('ThinkLink API requires HTTPS')
  const url = `${base}/${method}?${params.toString()}`

  await waitForRequestSlot()
  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    signal: AbortSignal.timeout(30000),
    redirect: 'error',
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
    throw new ThinkLinkApiError(data.OperationStatus)
  }

  if (!res.ok) throw new Error(`ThinkLink HTTP ${res.status} for ${method}`)

  return data
}

async function fetchAllPages<T>(method: string, baseParams: Record<string, string | number | undefined> = {}) {
  const first = await thinkLinkRequest<ThinkLinkPaginatedResult<T>>(method, {
    ...baseParams,
    page: 1,
  })

  const result = first.Result as ThinkLinkPaginatedResult<T>
  if (!result || !Array.isArray(result.data) || !Number.isInteger(result.last_page) || result.last_page < 1) {
    throw new Error('Invalid ThinkLink pagination')
  }

  const items: T[] = [...result.data]

  for (let page = 2; page <= result.last_page; page++) {
    const next = await thinkLinkRequest<ThinkLinkPaginatedResult<T>>(method, {
      ...baseParams,
      page,
    })
    const nextResult = next.Result as ThinkLinkPaginatedResult<T>
    if (!nextResult || !Array.isArray(nextResult.data) || Number(nextResult.current_page) !== page) {
      throw new Error('Incomplete ThinkLink response')
    }
    items.push(...nextResult.data)
  }

  if (items.length !== Number(result.total)) throw new Error('Incomplete ThinkLink snapshot')
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
  const result = res.Result as ThinkLinkRates | { data: ThinkLinkRates } | null
  if (!result) throw new Error('Invalid ThinkLink rates')
  return 'data' in result ? result.data : result
}

export interface ThinkLinkSyncResult {
  categoriesCreated: number
  categoriesUpdated: number
  brandsCreated: number
  brandsUpdated: number
  productsCreated: number
  productsUpdated: number
  skippedNoPrice: number
  skippedNoCategory: number
  productsUnavailable: number
}

export async function syncThinkLinkToDb(onProgress?: (message: string) => void): Promise<ThinkLinkSyncResult> {
  ensureCredentials()

  // One importer per database, including CLI and web workers. Roll back failed imports.
  return prisma.$transaction(async (tx) => {
    const [lock] = await tx.$queryRaw<{ locked: boolean }[]>`SELECT pg_try_advisory_xact_lock(731902451) AS locked`
    if (!lock.locked) throw new ThinkLinkApiError('SYNC_BUSY')
    onProgress?.('Загрузка категорий ThinkLink…')
    const catalog = await fetchThinkLinkCatalog()
    onProgress?.('Загрузка товаров ThinkLink…')
    const items = await fetchThinkLinkItems()
    onProgress?.('Загрузка цен ThinkLink…')
    const prices = await fetchThinkLinkPrices()
    onProgress?.('Загрузка остатков и курсов ThinkLink…')
    const qtyList = await fetchThinkLinkQty()
    const rates = await fetchThinkLinkRates()
    if (!catalog.length || !items.length) throw new Error('Empty ThinkLink snapshot')
    onProgress?.(`Сохранение: ${catalog.length} категорий, ${items.length} товаров.`)

    const priceByItem = new Map<string, ThinkLinkPrice[]>()
    for (const p of prices) {
      if (!priceByItem.has(p.itemId)) priceByItem.set(p.itemId, [])
      priceByItem.get(p.itemId)!.push(p)
    }

    const qtyByItem = new Map<string, number>()
    for (const q of qtyList) {
      const qty = Number(q.qty)
      if (!Number.isSafeInteger(qty)) throw new Error('Invalid ThinkLink quantity')
      qtyByItem.set(q.itemId, Math.max(0, qty))
    }

    const result: ThinkLinkSyncResult = {
      categoriesCreated: 0,
      categoriesUpdated: 0,
      brandsCreated: 0,
      brandsUpdated: 0,
      productsCreated: 0,
      productsUpdated: 0,
      skippedNoPrice: 0,
      skippedNoCategory: 0,
      productsUnavailable: 0,
    }

    // ---- CATEGORIES ----
    const existingCategories = await tx.category.findMany({
      where: { externalSource: THINKLINK_SOURCE } as any,
    } as any)
    const categoryByExternalId = new Map<string, any>()
    for (const c of existingCategories as any[]) {
      if (c.externalCatalogId != null) {
        categoryByExternalId.set(`${c.externalLevel}:${c.externalCatalogId}`, c)
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

      const key = `${level}:${sourceId}`
      const existing = categoryByExternalId.get(key)
      const slug = `thinklink-${slugify(cat.name)}-${level}-${sourceId}`

      let parentId: string | null = null
      if (level > 1 && parentSourceId) {
        const parent = categoryByExternalId.get(`${level - 1}:${parentSourceId}`)
        parentId = parent ? parent.id : null
      }

      if (!existing) {
        const createCategory = async (slugToUse: string) =>
          (tx as any).category.create({
            data: {
              name: cat.name,
              slug: slugToUse,
              description: null,
              image: null,
              externalSource: THINKLINK_SOURCE,
              externalCatalogId: sourceId,
              externalLevel: level,
              parentId,
              sortOrder: level * 1000 + sourceId,
              isActive: true,
            },
          })

        const created = await createCategory(slug)

        categoryByExternalId.set(key, created)
        result.categoriesCreated++
      } else {
        const updated = await (tx as any).category.update({
          where: { id: existing.id },
          data: {
            name: cat.name,
            externalLevel: level,
            parentId,
          },
        })
        categoryByExternalId.set(key, updated)
        result.categoriesUpdated++
      }
    }

    // ---- BRANDS ----
    const existingBrands = await (tx as any).brand.findMany({
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
        const baseSlug = `thinklink-brand-${Buffer.from(code).toString('hex')}`

        const createBrand = async (slugToUse: string) =>
          (tx as any).brand.create({
            data: {
              name,
              slug: slugToUse,
              externalCode: code,
              isActive: true,
            },
          })

        const created = await createBrand(baseSlug)

        brandByCode.set(code, created)
        result.brandsCreated++
      } else {
        const existing = brandByCode.get(code)!
        const name = item.brand.tl_name || existing.name
        const updated = await (tx as any).brand.update({
          where: { id: existing.id },
          data: {
            name,
          },
        })
        brandByCode.set(code, updated)
        result.brandsUpdated++
      }
    }

    // ---- PRODUCTS ----
    const existingProducts = await (tx as any).product.findMany({
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
      const bestPrice = retailPrice(itemPrices, rates)
      if (!bestPrice) {
        result.skippedNoPrice++
        continue
      }

      const qty = qtyByItem.get(item.itemId) ?? 0
      const isAvailable = qty > 0

      // Категория: берем приоритетно уровень 3, потом 2, потом 1
      const catId =
        categoryByExternalId.get(`3:${Number(item.CatalogueLevel3)}`)?.id ||
        categoryByExternalId.get(`2:${Number(item.CatalogueLevel2)}`)?.id ||
        categoryByExternalId.get(`1:${Number(item.CatalogueLevel1)}`)?.id

      if (!catId) {
        // если нет категории — пропускаем
        result.skippedNoCategory++
        continue
      }

      const brandCode = item.brand?.code
      const brand = brandCode ? brandByCode.get(brandCode) : undefined

      const name = item.itemName || item.itemId
      const baseSlug = slugify(name)
      const slug = `${baseSlug}-${item.itemId.toLowerCase()}`

      const existing = productByExternalId.get(item.itemId)

      if (!existing) {
        const created = await (tx as any).product.create({
          data: {
            name,
            slug,
            description: null,
            shortDescription: null,
            sku: item.itemId,
            manufacturerPartNumber: item.VendorPartnumber?.trim() || null,
            endUserRequired: item.IsEndUserRequired == null ? null : Number(item.IsEndUserRequired) === 1,
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
        await (tx as any).product.update({
          where: { id: existing.id },
          data: {
            name,
            price: bestPrice.price,
            manufacturerPartNumber: item.VendorPartnumber?.trim() || null,
            endUserRequired: item.IsEndUserRequired == null ? null : Number(item.IsEndUserRequired) === 1,
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

    // A complete snapshot is authoritative: missing/unpriced products cannot stay available.
    const validIds = items.filter(item =>
      retailPrice(priceByItem.get(item.itemId) || [], rates) &&
      [item.CatalogueLevel1, item.CatalogueLevel2, item.CatalogueLevel3].some((id, index) => categoryByExternalId.has(`${index + 1}:${Number(id)}`))
    ).map(item => item.itemId)
    const unavailable = await tx.product.updateMany({
      where: { externalSource: THINKLINK_SOURCE, externalItemId: { notIn: validIds } },
      data: { isAvailable: false, stock: 0 },
    })
    result.productsUnavailable = unavailable.count
    return result
  }, { timeout: 30 * 60 * 1000, maxWait: 10000 })
}


