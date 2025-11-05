'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Brand } from '@/types'

interface PartnersGridProps {
  title?: string
  partners: Omit<Brand, 'productsCount'>[]
}

export function PartnersGrid({ title = 'Наши партнёры', partners }: PartnersGridProps) {
  return (
    <section aria-labelledby="partners-title" className="mb-16">
      <h2 id="partners-title" className="text-3xl font-bold text-center text-white mb-12">
        {title}
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {partners.map((p) => {
          const scale = (p as any).logoScale ?? 1
          return (
          <div
            key={p.slug}
            className="group relative rounded-xl ring-1 ring-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-transform duration-300 hover:scale-[1.01]"
          >
            <div className="p-6">
              <div className="relative h-16 w-full mb-4">
                <Image
                  src={p.logo ?? '/images/brands/generic-logo.svg'}
                  alt={p.name}
                  fill
                  className="object-contain"
                  style={{ transform: `scale(${scale})` }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              <div className="text-white font-semibold mb-1">{p.name}</div>
              {p.description && (
                <div className="text-sm text-gray-300 leading-snug">
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


