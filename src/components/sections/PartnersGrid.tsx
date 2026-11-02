'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Brand } from '@/types'

interface PartnersGridProps {
  title?: string
  partners: Omit<Brand, 'productsCount'>[]
}

export function PartnersGrid({ title, partners }: PartnersGridProps) {
  return (
    <section aria-label={title ?? 'Партнёры'}>
      {title && <h2 className="text-3xl font-bold text-center text-white mb-12">{title}</h2>}

      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {partners.map((p) => {
          const scale = (p as any).logoScale ?? 1
          return (
          <div
            key={p.slug}
            className="mx-card mx-card-hover group overflow-hidden"
            data-reveal="scale"
          >
            <div className="p-3 md:p-4">
              {/* Логотип на белой плашке: фирменные цвета брендов рассчитаны на светлый фон */}
              <div className="relative mb-4 h-20 w-full overflow-hidden rounded-2xl bg-white md:h-24">
                <div className="absolute inset-x-5 inset-y-4 md:inset-x-7 md:inset-y-5">
                <Image
                  src={p.logo ?? '/images/brands/generic-logo.svg'}
                  alt={p.name}
                  fill
                  className="object-contain"
                  style={{ transform: `scale(${scale})` }}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                </div>
              </div>

              <div className="px-1 text-white font-semibold mb-1">{p.name}</div>
              {p.description && (
                <div className="px-1 pb-1 text-sm text-[#a9b4cf] leading-snug break-words hyphens-auto">
                  {p.description}
                </div>
              )}
            </div>

            {/* Ссылки на сайты убраны по требованию */}
          </div>
          )
        })}
      </div>
    </section>
  )
}


