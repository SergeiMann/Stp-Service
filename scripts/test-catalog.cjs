const assert = require('node:assert/strict')
const base = 'http://localhost:3000'
async function get(path, q = '') {
  const r = await fetch(base + path + '?' + q)
  assert.equal(r.status, 200)
  const j = await r.json()
  assert.equal(j.success, true)
  return j.data
}
;(async () => {
  const p = await get('/api/products')
  const total = p.pagination.totalProducts
  assert.ok(total > 0)
  assert.equal(p.products.length, 24)
  const cats = await get('/api/categories')
  assert.equal(
    cats.reduce((n, c) => n + c.productsCount, 0),
    total
  )
  for (const c of cats.slice(0, 4)) {
    const r = await get('/api/products', 'category=' + c.id)
    assert.equal(r.pagination.totalProducts, c.productsCount)
  }
  for (const limit of [12, 24, 48, 96]) {
    const r = await get('/api/products', `limit=${limit}&sort=price-asc`)
    assert.equal(r.products.length, limit)
    assert.ok(r.products.every((p, i, a) => !i || p.price >= a[i - 1].price))
  }
  const all = await get('/api/products', 'stock=all')
  assert.ok(all.pagination.totalProducts > total)
  const item = p.products[0]
  const sku = await get(
    '/api/products',
    'search=' + encodeURIComponent(item.sku)
  )
  assert.ok(sku.products.some(x => x.id === item.id))
  const q = `category=${cats[0].id}&min=1000&max=100000&stock=all`
  const filtered = await get('/api/products', q)
  assert.ok(filtered.products.every(p => p.price >= 1000 && p.price <= 100000))
  const range = await get('/api/products/price-range', q)
  const unpriced = await get(
    '/api/products',
    `category=${cats[0].id}&stock=all`
  )
  assert.equal(range.count, unpriced.pagination.totalProducts)
  const empty = await get('/api/products', 'search=__no_such_product__&page=99')
  assert.equal(empty.pagination.totalProducts, 0)
  assert.equal(empty.pagination.currentPage, 1)
  const retained = await get(
    '/api/categories',
    'category=' + cats[0].id + '&search=__no_such_product__'
  )
  assert.equal(retained[0].id, cats[0].id)
  assert.equal(retained[0].productsCount, 0)
  const invalid = await get('/api/products', 'limit=-1&page=Infinity&min=NaN')
  assert.equal(invalid.pagination.limit, 24)
  console.log(
    'PASS: stock ' +
      total +
      '; category totals and descendants; 12/24/48/96; price sorting; SKU; bounds; price facet; empty results; retained selection; invalid URL. All priced:',
    all.pagination.totalProducts
  )
})().catch(e => {
  console.error(e)
  process.exitCode = 1
})
