interface SupplierPrice {
  currency: string
  price: number
  IsGPLPrice: number
}

// Always calculate from the supplier price, never from a previously marked-up price.
export function retailPrice(prices: SupplierPrice[], rates?: { USD_RUR: number; EUR_RUR: number }) {
  for (const currency of ['RUR', 'RUB', 'USD', 'EUR']) {
    const rate = currency === 'USD' ? Number(rates?.USD_RUR)
      : currency === 'EUR' ? Number(rates?.EUR_RUR) : 1
    if (!Number.isFinite(rate) || rate <= 0) continue
    const entry = prices.find(p => p.currency === currency && Number.isFinite(Number(p.price)) && Number(p.price) > 0)
    if (!entry) continue
    const price = Math.round((Number(entry.price) * rate * 1.1 + Number.EPSILON) * 100) / 100
    if (!Number.isFinite(price) || price <= 0) continue
    return { price, currency: 'RUR', isGpl: Number(entry.IsGPLPrice) === 1 }
  }
  return null
}
