'use client'

import Image from 'next/image'
import { useState } from 'react'
import { partners } from '@/data/partners'
import catalogBrandLogos from '@/data/catalog-brand-logos.json'
import { Product } from '@/types'

const normalizeBrand = (value: string) => value.toLowerCase().replace(/[\s_-]+/g, '')

export function ProductImage({
  product,
  imageIndex = 0,
  sizes,
}: {
  product: Product
  imageIndex?: number
  sizes: string
}) {
  const [failedSources, setFailedSources] = useState<string[]>([])
  const brand = product.brand
  const partner = brand && partners.find(item =>
    normalizeBrand(item.slug) === normalizeBrand(brand.slug) ||
    normalizeBrand(item.name) === normalizeBrand(brand.name) ||
    (item.slug === 'indata' && normalizeBrand(brand.name) === 'idata')
  )
  const photo = product.images?.[imageIndex]?.trim()
  const catalogBrand = brand && catalogBrandLogos.find(item =>
    normalizeBrand(item.name) === normalizeBrand(brand.name)
  )
  const logo = [partner?.logo, catalogBrand?.logo, brand?.logo].find(source =>
    source?.trim() && !source.includes('generic-logo') && !failedSources.includes(source)
  )
  const source = photo && !failedSources.includes(photo) ? photo : logo
  const isLogo = source !== photo

  if (!source) {
    return <span className="px-4 text-center text-lg font-semibold text-slate-500">{brand?.name || product.category.name}</span>
  }

  return (
    <Image
      src={source}
      alt={isLogo ? `Логотип ${brand?.name}` : product.name}
      fill
      sizes={sizes}
      className={`object-contain rounded-lg ${isLogo ? 'p-6' : ''} ${isLogo && source === catalogBrand?.logo && catalogBrand?.darkBackground ? 'bg-slate-800' : ''}`}
      onError={() => setFailedSources(previous => [...previous, source])}
    />
  )
}
