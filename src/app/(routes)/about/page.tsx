import { Metadata } from 'next'
import { CSSProperties } from 'react'
import Link from 'next/link'
import { generateSEO } from '@/lib/utils'
import { PageLayout, PagePanel } from '@/components/layout/PageLayout'
import { CertsGallery } from '@/components/sections/CertsGallery'
import { PartnersGrid } from '@/components/sections/PartnersGrid'
import { partners as partnersData } from '@/data/partners'
import { CountUp } from '@/components/motion/CountUp'
import { Scatter3D, ScatterItem } from '@/components/motion/Scatter3D'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'О компании',
    description: 'СТП-Сервис - профессиональная компания по ремонту и продаже оборудования для маркировки.',
  })
}

const reasons: ScatterItem[] = [
  {
    id: 'repair',
    icon: 'fas fa-tools',
    title: 'Профессиональный ремонт',
    description: 'Сертифицированные специалисты с многолетним опытом работы с торговым оборудованием',
    tone: 'bg-[#3d6bff] text-white',
  },
  {
    id: 'speed',
    icon: 'fas fa-clock',
    title: 'Быстрые сроки',
    description: 'Большинство ремонтов выполняем в течение 24 часов благодаря наличию запчастей на складе',
    tone: 'bg-[#cbf23d] text-[#0b1324]',
  },
  {
    id: 'warranty',
    icon: 'fas fa-shield-alt',
    title: 'Гарантия качества',
    description: 'Предоставляем гарантию на все виды работ и используемые запчасти',
    tone: 'bg-[#e9eef9] text-[#0b1324]',
  },
  {
    id: 'personal',
    icon: 'fas fa-handshake',
    title: 'Индивидуальный подход',
    description: 'Разрабатываем персональные решения для каждого клиента и типа оборудования',
    tone: 'bg-[#7b5cff] text-white',
  },
  {
    id: 'stock',
    icon: 'fas fa-warehouse',
    title: 'Собственный склад',
    description: 'Большой ассортимент оригинальных запчастей всегда в наличии',
    tone: 'bg-[#ff7a1a] text-white',
  },
  {
    id: 'support',
    icon: 'fas fa-phone-alt',
    title: 'Техподдержка 24/7',
    description: 'Круглосуточная консультационная поддержка по всем техническим вопросам',
    tone: 'bg-[#1a2647] text-white ring-1 ring-white/10',
  },
]

const stats = [
  { to: 15, suffix: '+', label: 'лет опыта', color: 'text-[#5b84ff]' },
  { to: 5000, suffix: '+', label: 'отремонтированных устройств', color: 'text-[#2ad67c]' },
  { to: 98, suffix: '%', label: 'успешных ремонтов', color: 'text-[#cbf23d]' },
  { to: 24, suffix: 'ч', label: 'средний срок ремонта', color: 'text-[#a58bff]' },
]

const certifications = [
  {
    title: 'Авторизованный сервис',
    icon: 'fas fa-certificate',
    tone: 'bg-[#3d6bff]',
    items: ['Zebra Technologies', 'Datalogic', 'Honeywell', 'TSC Printers'],
  },
  {
    title: 'Сертификаты качества',
    icon: 'fas fa-award',
    tone: 'bg-[#2ad67c] text-[#062414]',
    items: ['ISO 9001:2015', 'Сертификат соответствия ГОСТ', 'Лицензия на ремонт оборудования'],
  },
]

function Heading({ kicker, lines, className = '' }: { kicker: string; lines: string[]; className?: string }) {
  return (
    <div className={`mb-10 md:mb-14 ${className}`}>
      <div className="mx-kicker mb-5" data-reveal>
        {kicker}
      </div>
      <h2 className="mx-h2" data-reveal="lines">
        {lines.map((l, i) => (
          <span key={l} className="mx-ln" style={{ '--i': i } as CSSProperties}>
            <span>{l}</span>
          </span>
        ))}
      </h2>
    </div>
  )
}

export default function AboutPage() {
  return (
    <PageLayout
      title="О компании СТП-Сервис"
      subtitle="Мы специализируемся на профессиональном ремонте и продаже оборудования для маркировки и сбора данных с 2010 года"
      badge="Профессиональный сервис"
      heroImage="/images/equipment/honeywell-eda52-500x500.png"
      heroChips={['с 2010 года', '5000+ устройств', 'Авторизованный сервис']}
    >
      <div className="mx-panels">
        {/* ---------- Миссия и цифры ---------- */}
        <PagePanel tone="dark">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Heading kicker="Наша миссия" lines={['Оборудование', 'должно работать']} className="!mb-8" />
              <div className="space-y-4 text-lg leading-relaxed text-[#a9b4cf]" data-reveal>
                <p>
                  Обеспечить бесперебойную работу оборудования для маркировки наших клиентов через качественный сервис,
                  профессиональный ремонт и надежные решения.
                </p>
                <p>
                  Мы понимаем, что каждая минута простоя оборудования — это потерянная прибыль, поэтому работаем быстро,
                  качественно и с полной ответственностью.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {stats.map((s, i) => (
                <div key={s.label} className="mx-card p-5 md:p-7" data-reveal="scale" style={{ '--d': `${i * 90}ms` } as CSSProperties}>
                  <div className={`text-4xl font-bold tracking-tight md:text-5xl ${s.color}`}>
                    <CountUp to={s.to} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 text-sm text-[#a9b4cf]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </PagePanel>

        {/* ---------- Почему выбирают нас ---------- */}
        <PagePanel tone="ink">
          <Heading kicker="Преимущества" lines={['Почему выбирают нас']} />
          <Scatter3D items={reasons} />
        </PagePanel>

        {/* ---------- Сертификации ---------- */}
        <PagePanel tone="dark">
          <Heading kicker="Статус" lines={['Сертификации', 'и партнерства']} />
          <div className="grid gap-4 md:grid-cols-2">
            {certifications.map((c, i) => (
              <div key={c.title} className="mx-card p-6 md:p-8" data-reveal="tilt" style={{ '--d': `${i * 120}ms` } as CSSProperties}>
                <div className="mb-6 flex items-center gap-4">
                  <span className={`mx-icon ${c.tone}`}>
                    <i className={c.icon} />
                  </span>
                  <h3 className="text-xl font-bold tracking-tight md:text-2xl">{c.title}</h3>
                </div>
                <ul className="space-y-3">
                  {c.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[#c9d3ee]">
                      <i className="fas fa-check text-xs text-[#cbf23d]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PagePanel>

        {/* ---------- Партнеры ---------- */}
        <PagePanel tone="ink">
          <Heading kicker="Бренды" lines={['Наши партнёры']} />
          <PartnersGrid partners={partnersData} />
        </PagePanel>

        {/* ---------- Сертификаты ---------- */}
        <PagePanel tone="dark" id="certs">
          <Heading kicker="Документы" lines={['Наши сертификаты']} />
          <CertsGallery
            images={[
              'astra.jpg',
              'cipher.jpg',
              'godex.jpg',
              'm3.jpg',
              'tsc.jpg',
              'urovo_service.jpg',
              'urovo_reseller.jpg',
              'urovo2024.jpg',
              'zebra.jpg',
            ]}
          />
        </PagePanel>

        {/* ---------- Связаться ---------- */}
        <PagePanel tone="lime">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <h2 className="mx-h2 lg:col-span-7" data-reveal="lines">
              <span className="mx-ln" style={{ '--i': 0 } as CSSProperties}>
                <span>Готовы начать</span>
              </span>
              <span className="mx-ln" style={{ '--i': 1 } as CSSProperties}>
                <span>сотрудничество?</span>
              </span>
            </h2>
            <div className="lg:col-span-5" data-reveal="right">
              <p className="mb-6 text-lg text-[#0b1324]/75">Свяжитесь с нами для обсуждения ваших потребностей</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/contacts" className="mx-btn mx-btn-dark" data-magnet>
                  Связаться с нами <i className="fas fa-arrow-right text-sm" />
                </Link>
                <Link href="/#services" className="mx-btn bg-white text-[#0b1324]" data-magnet>
                  Посмотреть услуги
                </Link>
              </div>
            </div>
          </div>
        </PagePanel>
      </div>
    </PageLayout>
  )
}
