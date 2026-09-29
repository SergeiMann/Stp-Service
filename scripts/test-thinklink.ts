import assert from 'node:assert/strict'
import { loadEnvConfig } from '@next/env'
import { NextRequest } from 'next/server'
import { retailPrice } from '../src/lib/thinklink-price'

loadEnvConfig(process.cwd(), true)
const testUrl = new URL(process.env.TEST_DATABASE_URL || 'http://missing')
if (testUrl.hostname !== '127.0.0.1' || testUrl.pathname !== '/stp_thinklink_test') {
  throw new Error('Tests require a dedicated local TEST_DATABASE_URL database named stp_thinklink_test')
}
process.env.DATABASE_URL = testUrl.toString()
process.env.THINKLINK_LOGIN = 'test'
process.env.THINKLINK_TOKEN = 'test'
process.env.THINKLINK_API_BASE = 'https://thinklink.invalid/api'

async function main() {
  const { prisma } = await import('../src/lib/prisma')
  const { syncThinkLinkToDb } = await import('../src/lib/thinklink')
  const { POST } = await import('../src/app/api/orders/route')
  const { GET: getProducts } = await import('../src/app/api/products/route')
  const { GET: getCategories } = await import('../src/app/api/categories/route')
  const originalFetch = globalThis.fetch
  let phase = 0
  let broken = false
  const item = (id: string) => ({ itemId: id, itemName: `Test ${id}`, VendorPartnumber: phase === 0 ? ' MPN-123 ' : 'MPN-456', IsEndUserRequired: phase === 0 ? 1 : 0, CatalogueLevel1: 90001, CatalogueLevel2: 90001, CatalogueLevel3: 90003, brand: { code: 'TEST', tl_name: 'Test supplier' } })
  globalThis.fetch = async (input) => {
    const method = new URL(String(input)).pathname.split('/').pop()!
    if (broken && method === 'items') return Response.json({ OperationStatus: 'OK', Result: null })
    const data: Record<string, unknown> = {
      catalog: [
        { level: 1, sourceId: 90001, parentId: 0, name: 'Test root' },
        { level: 2, sourceId: 90001, parentId: 90001, name: 'Test root' },
        { level: 3, sourceId: 90003, parentId: 90001, name: 'Test leaf' },
      ],
      items: phase === 0 ? [item('TEST-A'), item('TEST-B'), item('TEST-C')] : [item('TEST-A'), item('TEST-C')],
      price: [
        { itemId: 'TEST-A', price: 1000, currency: 'RUR', IsGPLPrice: 0 },
        { itemId: 'TEST-B', price: 10, currency: 'USD', IsGPLPrice: 0 },
        ...(phase === 0 ? [{ itemId: 'TEST-C', price: 2000, currency: 'RUR', IsGPLPrice: 0 }] : []),
      ],
      qty: [{ itemId: 'TEST-A', qty: phase === 0 ? 7 : 3 }, { itemId: 'TEST-B', qty: 4 }, { itemId: 'TEST-C', qty: 5 }],
      rates: { data: { USD_RUR: '90', EUR_RUR: '100' } },
    }
    const value = data[method]
    assert.ok(value, `Unexpected API call ${method}`)
    return Response.json({ OperationStatus: 'OK', Result: Array.isArray(value) ? { current_page: 1, last_page: 1, total: value.length, data: value } : value })
  }
  try {
    // Only the explicitly dedicated test database is cleared.
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.updateMany({ data: { parentId: null } })
    await prisma.category.deleteMany()
    await prisma.brand.deleteMany()

    assert.equal(retailPrice([{ price: 1000, currency: 'RUR', IsGPLPrice: 0 }])?.price, 1100)
    assert.equal(retailPrice([{ price: 10, currency: 'USD', IsGPLPrice: 0 }], { USD_RUR: 90, EUR_RUR: 100 })?.price, 990)
    assert.equal(retailPrice([{ price: 10, currency: 'USD', IsGPLPrice: 0 }]), null)
    assert.equal(retailPrice([{ price: 0, currency: 'RUR', IsGPLPrice: 0 }]), null)
    console.log('PASS: markup, currency conversion, invalid/missing prices')

    const first = await syncThinkLinkToDb()
    assert.equal(first.productsCreated, 3)
    const product = await prisma.product.findUniqueOrThrow({ where: { externalItemId: 'TEST-A' } })
    assert.equal(product.price, 1100)
    assert.equal(product.stock, 7)
    assert.equal(product.manufacturerPartNumber, 'MPN-123')
    assert.equal(product.endUserRequired, true)
    assert.equal(product.sku, 'TEST-A')
    const mpnSearch = await (await getProducts(new NextRequest('http://localhost/api/products?search=MPN-123'))).json()
    assert.equal(mpnSearch.data.pagination.totalProducts, 3)
    assert.equal(mpnSearch.data.products[0].manufacturerPartNumber, 'MPN-123')
    await prisma.product.update({ where: { id: product.id }, data: {
      description: 'Verified description', images: '["/images/test.jpg"]',
      specifications: { create: { name: 'Interface', value: 'USB' } },
    } })
    const categories = await (await getCategories(new NextRequest('http://localhost/api/categories'))).json()
    assert.equal(categories.data[0].children[0].children.length, 1)
    const root = await prisma.category.findFirstOrThrow({ where: { externalCatalogId: 90001, externalLevel: 1 } })
    const filtered = await (await getProducts(new NextRequest(`http://localhost/api/products?category=${root.id}`))).json()
    assert.equal(filtered.data.pagination.totalProducts, 3)
    console.log('PASS: first import, three category levels, parent category filter')

    const inquiry = (quantity: number) => new NextRequest('http://localhost/api/orders', {
      method: 'POST', body: JSON.stringify({ customerName: 'Test customer', customerPhone: '+79991234567', items: [{ productId: product.id, quantity, price: 1 }, { productId: product.id, quantity: 2 }] }),
    })
    const response = await POST(inquiry(8))
    assert.equal(response.status, 200)
    const result = await response.json()
    const order = await prisma.order.findUniqueOrThrow({ where: { id: result.data.orderId }, include: { items: true } })
    assert.equal(order.isInquiry, true)
    assert.equal(order.total, 11000)
    assert.equal(order.items.length, 1)
    assert.equal(order.items[0].quantity, 10)
    assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock, 7)
    for (const quantity of [0, -1, 1.5]) assert.equal((await POST(inquiry(quantity))).status, 400)
    console.log('PASS: inquiry without email, merged quantities, server prices, unchanged stock, invalid quantities rejected')

    phase = 1
    await syncThinkLinkToDb()
    const updated = await prisma.product.findUniqueOrThrow({ where: { id: product.id } })
    assert.equal(updated.price, 1100)
    assert.equal(updated.stock, 3)
    assert.equal(updated.manufacturerPartNumber, 'MPN-456')
    assert.equal(updated.endUserRequired, false)
    assert.equal(updated.description, 'Verified description')
    assert.equal(updated.images, '["/images/test.jpg"]')
    assert.equal(await prisma.productSpecification.count({ where: { productId: product.id } }), 1)
    assert.equal(await prisma.product.count(), 3)
    assert.equal(await prisma.product.count({ where: { isAvailable: true } }), 1)
    console.log('PASS: repeated import, no compounded markup, updated stock, missing/unpriced products unavailable')

    broken = true
    await assert.rejects(syncThinkLinkToDb())
    assert.equal((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock, 3)
    console.log('PASS: incomplete supplier response leaves catalog unchanged')
  } finally {
    globalThis.fetch = originalFetch
    await prisma.$disconnect()
  }
}

main().catch(error => { console.error(error); process.exitCode = 1 })

