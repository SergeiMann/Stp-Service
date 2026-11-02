import { generateSEO } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import { CSSProperties } from 'react'
import { SITE_CONFIG } from '@/lib/constants'
import { MotionRuntime } from '@/components/motion/MotionRuntime'
import { SiteHeader } from '@/components/motion/SiteHeader'
import { SideRail, RailSection } from '@/components/motion/SideRail'
import { FloatScene, FloatItem } from '@/components/motion/FloatScene'
import { WordRotator } from '@/components/motion/WordRotator'
import { Marquee } from '@/components/motion/Marquee'
import { Stack3D, StackItem } from '@/components/motion/Stack3D'
import { Scatter3D, ScatterItem } from '@/components/motion/Scatter3D'
import { RepairDemo } from '@/components/motion/RepairDemo'
import { CountUp } from '@/components/motion/CountUp'
import { Tilt } from '@/components/motion/Tilt'
import { LiveClock } from '@/components/motion/LiveClock'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Главная',
    description: 'Профессиональный ремонт и обслуживание оборудования для маркировки и сбора данных. Быстро, качественно, с гарантией. Ремонт терминалов, сканеров штрих-кодов, принтеров этикеток.',
  })
}

export const revalidate = 60

const sections: RailSection[] = [
  { id: 'top', label: 'Главная', icon: 'fas fa-house' },
  { id: 'equipment', label: 'Оборудование', icon: 'fas fa-layer-group' },
  { id: 'repair', label: 'Как проходит ремонт', icon: 'fas fa-screwdriver-wrench' },
  { id: 'services', label: 'Услуги', icon: 'fas fa-toolbox' },
  { id: 'inlocker', label: 'Инлокер+', icon: 'fas fa-lock' },
  { id: 'contact', label: 'Связаться', icon: 'fas fa-phone' },
]

// Логотипы обрезаны по содержимому (brands/tight). ratio — ширина к высоте:
// по нему подбираем высоту, чтобы широкие и квадратные логотипы выглядели одного «веса»
const brands = [
  { name: 'Zebra', slug: 'zebra', ratio: 2.97 },
  { name: 'Honeywell', slug: 'honeywell', ratio: 5.19 },
  { name: 'Datalogic', slug: 'datalogic', ratio: 4.73 },
  { name: 'Urovo', slug: 'urovo', ratio: 4.58 },
  { name: 'M3 Mobile', slug: 'm3mobile', ratio: 2.31 },
  { name: 'CipherLab', slug: 'cipherlab', ratio: 2.46 },
  { name: 'Newland', slug: 'newland', ratio: 3.04 },
  { name: 'Point Mobile', slug: 'pointmobile', ratio: 2.2 },
  { name: 'TSC', slug: 'tsc', ratio: 2.14 },
  { name: 'Bixolon', slug: 'bixolon', ratio: 7.06 },
  { name: 'SATO', slug: 'sato', ratio: 3.26 },
  { name: 'Mertech', slug: 'mertech', ratio: 5.88 },
  { name: 'GoDEX', slug: 'godex', ratio: 4.14 },
  { name: 'Sunmi', slug: 'sunmi', ratio: 1 },
  { name: 'Bluebird', slug: 'bluebird', ratio: 1.2 },
  { name: 'iData', slug: 'idata', ratio: 2.77 },
]

const logoHeight = (ratio: number) => Math.round(Math.min(56, Math.max(24, Math.sqrt(6000 / ratio))))

const equipment: StackItem[] = [
  {
    id: 'tsd',
    title: 'Терминалы сбора данных',
    description: 'Мобильные компьютеры для сбора и обработки данных в складской логистике',
    image: '/images/equipment/zebra_mc3300ax.png',
    href: '/catalog?category=tsd',
    cta: 'Смотреть в каталоге',
    bg: 'linear-gradient(150deg, #4a76ff 0%, #2b44c8 100%)',
  },
  {
    id: 'scanners',
    title: 'Сканеры штрих-кода',
    description: 'Ручные и стационарные сканеры для считывания штрих-кодов различных типов',
    image: '/images/equipment/zebra_ds2208-hc.png',
    href: '/catalog?category=scanners',
    cta: 'Смотреть в каталоге',
    bg: '#cbf23d',
    darkText: true,
  },
  {
    id: '3d-scan',
    title: '3D scan определение ВГХ',
    description: 'Системы измерения габаритов и веса для логистических центров',
    image: '/images/equipment/caml-05.png',
    href: '/catalog?category=3d-scan',
    cta: 'Смотреть в каталоге',
    bg: 'linear-gradient(150deg, #8a6dff 0%, #5a3fd6 100%)',
  },
  {
    id: 'printers',
    title: 'Принтеры этикеток',
    description: 'Термо- и термотрансферные принтеры для печати этикеток и бирок',
    image: '/images/equipment/Zebra_ZD421C_Ribbon_Cartridge_Desktop_Barcode_Label_Printer_Right_Printing__81871.1754573824.png',
    href: '/catalog?category=printers',
    cta: 'Смотреть в каталоге',
    bg: 'linear-gradient(150deg, #ff8f33 0%, #ee5b0b 100%)',
  },
  {
    id: 'wifi',
    title: 'Wi-Fi оборудование',
    description: 'Промышленные точки доступа и сетевое оборудование для склада',
    image: '/images/equipment/Cisco_Access-Point.png',
    href: '/catalog?category=wifi',
    cta: 'Смотреть в каталоге',
    bg: 'linear-gradient(150deg, #2fcff5 0%, #1489bd 100%)',
  },
  {
    id: 'refurbished',
    title: 'Восстановленные ТСД',
    description: 'Восстановленные терминалы сбора данных с гарантией качества',
    image: '/images/equipment/Datalogic-Memor-11-Review-featured-image.png',
    href: '/catalog?category=refurbished',
    cta: 'Смотреть в каталоге',
    bg: '#e9eef9',
    darkText: true,
  },
]

// Услуги и цены (раньше были на отдельной странице /services)
const services: ScatterItem[] = [
  {
    id: 'tsd',
    icon: 'fas fa-wrench',
    title: 'Ремонт ТСД',
    description: 'Профессиональный ремонт терминалов сбора данных всех популярных брендов',
    tags: ['Диагностика', 'Замена экранов', 'Ремонт плат', 'Восстановление ПО'],
    meta: 'от 1 000 ₽',
    tone: 'bg-[#3d6bff] text-white',
  },
  {
    id: 'scanners',
    icon: 'fas fa-barcode',
    title: 'Ремонт сканеров',
    description: 'Восстановление работоспособности сканеров штрих-кодов любой сложности',
    tags: ['Чистка оптики', 'Замена лазера', 'Ремонт корпуса', 'Настройка'],
    meta: 'от 500 ₽',
    tone: 'bg-[#cbf23d] text-[#0b1324]',
  },
  {
    id: 'printers',
    icon: 'fas fa-print',
    title: 'Ремонт принтеров',
    description: 'Обслуживание термо- и термотрансферных принтеров этикеток',
    tags: ['Замена головки', 'Чистка механизма', 'Настройка печати', 'Профилактика'],
    meta: 'от 1 500 ₽',
    tone: 'bg-[#ff7a1a] text-white',
  },
  {
    id: 'tablets',
    icon: 'fas fa-tablet-alt',
    title: 'Ремонт планшетов',
    description: 'Восстановление защищенных планшетов для промышленного использования',
    tags: ['Замена дисплеев', 'Ремонт разъемов', 'Восстановление корпуса', 'Обновление ПО'],
    meta: 'от 1 500 ₽',
    tone: 'bg-[#7b5cff] text-white',
  },
  {
    id: 'maintenance',
    icon: 'fas fa-tools',
    title: 'Техническое обслуживание',
    description: 'Регулярное профилактическое обслуживание оборудования',
    tags: ['Плановая диагностика', 'Чистка и смазка', 'Обновление ПО', 'Калибровка'],
    meta: 'от 500 ₽',
    tone: 'bg-[#e9eef9] text-[#0b1324]',
  },
  {
    id: 'support',
    icon: 'fas fa-headset',
    title: 'Техническая поддержка',
    description: 'Консультации и удаленная помощь по настройке оборудования',
    tags: ['Удаленная диагностика', 'Настройка ПО', 'Обучение персонала'],
    meta: 'от 500 ₽/час',
    tone: 'bg-[#1a2647] text-white ring-1 ring-white/10',
  },
]

function Lines({ lines, className = '', as: Tag = 'h2', delay = 0 }: { lines: string[]; className?: string; as?: 'h1' | 'h2'; delay?: number }) {
  return (
    <Tag className={className} data-reveal="lines" style={{ '--d': `${delay}ms` } as CSSProperties}>
      {lines.map((l, i) => (
        <span key={l} className="mx-ln" style={{ '--i': i } as CSSProperties}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  )
}

export default function HomePage() {
  const tel = SITE_CONFIG.phone.replace(/[^+\d]/g, '')

  return (
    <div className="mx-root">
      <MotionRuntime />
      <SiteHeader />
      <SideRail sections={sections} />

      {/* ---------- Первый экран ---------- */}
      <section id="top" className="mx-hero">
        <div className="mx-grid-bg" />
        <div className="mx-orb w-[520px] h-[520px] -right-40 top-10 bg-[#3d6bff]/30" />
        <div className="mx-orb w-[420px] h-[420px] -left-40 bottom-0 bg-[#7b5cff]/25" style={{ animationDelay: '-6s' }} />

        <div className="relative z-10 mx-auto grid max-w-[1440px] min-h-[100svh] grid-cols-1 items-center gap-6 px-4 pb-16 pt-28 md:px-8 lg:grid-cols-12 lg:pt-24">
          <div className="min-w-0 lg:col-span-6 2xl:pl-16">
            <div className="mb-7" data-load style={{ '--d': '100ms' } as CSSProperties}>
              <span className="mx-badge">
                <LiveClock showStatus className="text-[#c9d3ee]" />
                <span className="opacity-40">|</span>
                Сервисный центр
              </span>
            </div>

            <h1 className="mx-fit [--fit:11.2cqi] text-[clamp(2rem,4.6vw+0.4rem,5rem)] font-bold leading-[0.98] tracking-[-0.04em]" data-load="lines">
              <span className="mx-ln" style={{ '--i': 0 } as CSSProperties}>
                <span>Быстро и</span>
              </span>
              <span className="mx-ln" style={{ '--i': 1 } as CSSProperties}>
                <span>профессионально</span>
              </span>
              <span className="mx-ln" style={{ '--i': 2 } as CSSProperties}>
                <span className="text-[#8e9ab6]">ремонтируем</span>
              </span>
              <span className="mx-ln" style={{ '--i': 3 } as CSSProperties}>
                <span>
                  <WordRotator words={['терминалы', 'сканеры', 'принтеры', 'планшеты']} wordClassName="mx-grad-text" />
                  <span className="sr-only">терминалы сбора данных, сканеры штрих-кодов, принтеры этикеток и защищенные планшеты</span>
                </span>
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#a9b4cf]" data-load style={{ '--d': '550ms' } as CSSProperties}>
              Терминалы сбора данных, сканеры штрих-кодов, термо- и термотрансферные принтеры этикеток и защищенные
              планшеты. Бесплатная диагностика и гарантия до 12 месяцев.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-load style={{ '--d': '700ms' } as CSSProperties}>
              <Link href="/contacts" className="mx-btn mx-btn-primary" data-magnet>
                Оставить заявку <i className="fas fa-arrow-right text-sm" />
              </Link>
              <Link href="/catalog" className="mx-btn mx-btn-ghost" data-magnet>
                Каталог товаров
              </Link>
            </div>

            <div className="mt-12 hidden items-center gap-10 sm:flex" data-load style={{ '--d': '850ms' } as CSSProperties}>
              <span className="mx-scroll-cue">
                <i /> Листайте
              </span>
              <div className="flex gap-8 text-sm text-[#8e9ab6]">
                <div>
                  <div className="text-2xl font-bold text-white">0 ₽</div>
                  диагностика
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">до 12 мес</div>
                  гарантия
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">24–48 ч</div>
                  большинство ремонтов
                </div>
              </div>
            </div>
          </div>

          <FloatScene className="h-[420px] sm:h-[520px] lg:col-span-6 lg:h-[640px]">
            <FloatItem x={50} y={50} z={60} delay={150} duration={9}>
              <div className="mx-core">
                <div className="mb-3 flex items-center justify-between text-xs text-[#8e9ab6]">
                  <span>Сканирование…</span>
                  <i className="fas fa-wifi" />
                </div>
                <div className="mx-barcode">
                  <div className="mx-bars" />
                  <div className="mx-digits">4 600000 123456</div>
                  <div className="mx-laser" />
                </div>
                <div className="mx-core-status">
                  <i className="fas fa-circle-check text-[#cbf23d]" />
                  Устройство исправно · <b>гарантия</b>
                </div>
              </div>
            </FloatItem>

            <FloatItem x={17} y={22} z={150} rotate={-8} delay={300} duration={7}>
              <div className="mx-dev h-[170px] w-[150px]">
                <img src="/images/equipment/zebra_mc3300ax.png" alt="Терминал Zebra MC3300" />
              </div>
            </FloatItem>
            <FloatItem x={86} y={28} z={40} rotate={9} delay={400} duration={8}>
              <div className="mx-dev h-[150px] w-[130px]">
                <img src="/images/equipment/zebra_ds2208-hc.png" alt="Сканер Zebra DS2208" />
              </div>
            </FloatItem>
            <FloatItem x={80} y={82} z={170} rotate={-5} delay={500} duration={7.5}>
              <div className="mx-dev h-[150px] w-[180px]">
                <img
                  src="/images/equipment/Zebra_ZD421C_Ribbon_Cartridge_Desktop_Barcode_Label_Printer_Right_Printing__81871.1754573824.png"
                  alt="Принтер этикеток Zebra ZD421"
                />
              </div>
            </FloatItem>
            <FloatItem x={16} y={78} z={20} rotate={7} delay={600} duration={8.5}>
              <div className="mx-dev h-[150px] w-[120px]">
                <img src="/images/equipment/honeywell-eda52-500x500.png" alt="Терминал Honeywell EDA52" />
              </div>
            </FloatItem>

            <FloatItem x={44} y={8} z={220} rotate={-6} delay={700} duration={6.5}>
              <span className="mx-chip mx-chip-lime">
                <i className="fas fa-screwdriver-wrench" /> Ремонт ТСД
              </span>
            </FloatItem>
            <FloatItem x={12} y={50} z={250} rotate={-10} delay={800} duration={7}>
              <span className="mx-chip mx-chip-violet">
                <i className="fas fa-barcode" /> Сканеры
              </span>
            </FloatItem>
            <FloatItem x={88} y={58} z={230} rotate={8} delay={900} duration={6.8}>
              <span className="mx-chip mx-chip-orange">
                <i className="fas fa-print" /> Принтеры
              </span>
            </FloatItem>
            <FloatItem x={50} y={95} z={130} rotate={3} delay={1000} duration={7.2}>
              <span className="mx-chip mx-chip-blue">
                <i className="fas fa-tablet-alt" /> Планшеты
              </span>
            </FloatItem>
            <FloatItem x={68} y={70} z={280} rotate={-3} delay={1100} duration={6}>
              <span className="mx-chip mx-chip-white text-sm">
                <i className="fas fa-stethoscope text-[#3d6bff]" /> Диагностика бесплатно
              </span>
            </FloatItem>

            <FloatItem x={66} y={16} z={-90} rotate={4} delay={1200} duration={9}>
              <span className="mx-logo-chip">
                <img src="/images/brands/tight/zebra.svg" alt="Zebra" />
              </span>
            </FloatItem>
            <FloatItem x={30} y={90} z={-120} rotate={-4} delay={1300} duration={10}>
              <span className="mx-logo-chip">
                <img src="/images/brands/tight/honeywell.svg" alt="Honeywell" />
              </span>
            </FloatItem>
            <FloatItem x={26} y={40} z={-160} rotate={-3} delay={1400} duration={9.5}>
              <span className="mx-logo-chip">
                <img src="/images/brands/tight/datalogic.svg" alt="Datalogic" />
              </span>
            </FloatItem>
          </FloatScene>
        </div>
      </section>

      {/* ---------- Бренды ---------- */}
      <section className="relative py-10 md:py-14" aria-label="Бренды">
        <div className="mx-auto mb-6 max-w-[1440px] px-4 md:px-8">
          <span className="mx-kicker">Оборудование ведущих брендов</span>
        </div>
        <Marquee speed={50}>
          {brands.map((b) => (
            <span key={b.name} className="mx-brand" title={b.name}>
              <img
                src={`/images/brands/tight/${b.slug}.svg`}
                alt={b.name}
                loading="lazy"
                style={{ height: logoHeight(b.ratio), width: Math.round(logoHeight(b.ratio) * b.ratio) }}
              />
            </span>
          ))}
        </Marquee>
      </section>

      <div className="mx-panels pb-4 md:pb-6">
        {/* ---------- Оборудование: 3D-стопка ---------- */}
        <section id="equipment" className="mx-panel mx-panel-dark" data-panel data-spot>
          <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 md:px-12 md:py-24 lg:pl-24">
            <div className="mb-12 grid gap-6 md:mb-16 lg:grid-cols-2 lg:items-end">
              <div>
                <div className="mx-kicker mb-5" data-reveal>
                  Каталог
                </div>
                <Lines lines={['Оборудование', 'для автоматизации']} className="mx-h2" />
              </div>
              <p className="max-w-lg text-lg text-[#a9b4cf] lg:justify-self-end" data-reveal style={{ '--d': '200ms' } as CSSProperties}>
                Поставляем и обслуживаем технику для склада, производства и розницы. Выберите направление — карточка
                выдвинется из стопки.
              </p>
            </div>
            <Stack3D items={equipment} listTitle="Направления" />
            <div className="mt-12 flex justify-center" data-reveal>
              <Link href="/catalog" className="mx-btn mx-btn-ghost" data-magnet>
                Посмотреть весь каталог <i className="fas fa-arrow-right text-sm" />
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- Как проходит ремонт ---------- */}
        <section id="repair" className="mx-panel mx-panel-blue" data-panel data-spot>
          <div className="mx-grid-bg opacity-60" />
          <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 md:px-12 md:py-24 lg:pl-24">
            <div className="mb-12 md:mb-16">
              <div className="mx-kicker mb-5 !text-white/70" data-reveal>
                Как мы работаем
              </div>
              <Lines lines={['Ремонт — в четыре', 'понятных шага']} className="mx-h2" />
            </div>
            <RepairDemo />
          </div>
        </section>

        {/* ---------- Услуги: разлет карточек ---------- */}
        <section id="services" className="mx-panel mx-panel-ink" data-panel data-spot>
          <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 md:px-12 md:py-24 lg:pl-24">
            <div className="mb-12 grid gap-8 md:mb-16 lg:grid-cols-2 lg:items-end">
              <div>
                <div className="mx-kicker mb-5" data-reveal>
                  Услуги
                </div>
                <Lines lines={['Чиним, обслуживаем,', 'поддерживаем']} className="mx-h2" />
              </div>
              <div className="grid grid-cols-3 gap-3" data-reveal style={{ '--d': '200ms' } as CSSProperties}>
                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div className="text-2xl font-bold md:text-3xl">
                    до <CountUp to={12} />
                  </div>
                  <div className="mt-1 text-xs text-[#8e9ab6]">месяцев гарантии на работы и запчасти</div>
                </div>
                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div className="text-2xl font-bold md:text-3xl">
                    <CountUp to={24} />–<CountUp to={48} />ч
                  </div>
                  <div className="mt-1 text-xs text-[#8e9ab6]">на большинство ремонтов</div>
                </div>
                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div className="text-2xl font-bold md:text-3xl">
                    <CountUp to={100} suffix="%" />
                  </div>
                  <div className="mt-1 text-xs text-[#8e9ab6]">предоплаты вернем, если ремонт невозможен</div>
                </div>
              </div>
            </div>
            <Scatter3D items={services} />
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3" data-reveal>
              <Link href="/contacts" className="mx-btn mx-btn-primary" data-magnet>
                Оставить заявку на ремонт <i className="fas fa-arrow-right text-sm" />
              </Link>
              <span className="text-sm text-[#8e9ab6]">Нажмите на карточку, чтобы выдвинуть ее</span>
            </div>
          </div>
        </section>

        {/* ---------- Инлокер+ — партнерский продукт, в фирменном светлом стиле Инлокера ---------- */}
        <section id="inlocker" className="mx-panel il-root il-panel-mint" data-panel data-spot>
          <div className="mx-orb w-[500px] h-[500px] left-1/3 top-10 bg-[#2dd765]/25" />
          <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 md:px-12 md:py-24 lg:pl-24">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="mb-5" data-reveal>
                  <span className="mx-badge">
                    <span className="mx-dot !bg-[#2dd765]" /> Инновационное решение
                  </span>
                </div>
                <h2 className="mx-fit text-[clamp(2.2rem,3.8vw,3.6rem)] font-bold leading-none tracking-[-0.035em]" data-reveal="lines">
                  <span className="mx-ln" style={{ '--i': 0 } as CSSProperties}>
                    <span className="text-[#2dd765]">Инлокер+</span>
                  </span>
                  <span className="mx-ln" style={{ '--i': 1 } as CSSProperties}>
                    <span>ремонт в интеграции</span>
                  </span>
                  <span className="mx-ln" style={{ '--i': 2 } as CSSProperties}>
                    <span>со шкафами Инлокер</span>
                  </span>
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-[#4b524e]" data-reveal>
                  Инлокер+ — это услуга по ремонту сломанных устройств, включающая все преимущества сервисного контракта и
                  дополнительный контроль за оборудованием.
                </p>
                <div className="mt-6 rounded-3xl bg-white p-5 shadow-[0_16px_40px_-24px_rgba(20,60,35,0.4)] ring-1 ring-[#2dd765]/30" data-reveal>
                  <p className="font-medium text-[#1b1d1f]">
                    Наша работа по обслуживанию и ремонту начинается сразу, как только ваш персонал положит в шкаф сломанное
                    устройство!
                  </p>
                </div>
                <p className="mt-5 text-sm text-[#4b524e]" data-reveal>
                  Возможна поставка как самих шкафов, так и в комплексе с решением Инлокер+. В поставку входит внедрение и
                  обучение сотрудников. Актуально для компаний с парком{' '}
                  <span className="font-semibold text-[#1b1d1f]">от 100 единиц оборудования</span>.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-reveal>
                  <Link href="/inlocker" className="mx-btn mx-btn-green" data-magnet>
                    Узнать больше <i className="fas fa-arrow-right text-sm" />
                  </Link>
                  <Link href="/contacts" className="mx-btn mx-btn-ghost" data-magnet>
                    Заказать консультацию
                  </Link>
                </div>
              </div>

              <div className="relative lg:col-span-7" data-reveal="scale">
                <Tilt max={8} glare={false} className="mx-auto max-w-xl">
                  <img
                    src="/images/equipment/product_16779-no-bg-preview%20(carve.photos).png"
                    alt="Шкаф Инлокер — автоматизированная система хранения оборудования"
                    loading="lazy"
                    className="relative w-full drop-shadow-[0_40px_50px_rgba(20,60,35,0.35)]"
                    style={{ transform: 'translateZ(40px)' }}
                  />
                  <div
                    className="absolute left-0 top-[12%] rounded-3xl bg-[#2dd765] px-5 py-4 text-white shadow-2xl md:-left-6"
                    style={{ transform: 'translateZ(90px)' }}
                  >
                    <div className="text-3xl font-bold">
                      <CountUp to={100} suffix="%" />
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider">контроль за устройствами</div>
                  </div>
                  <div
                    className="absolute bottom-[18%] right-0 rounded-3xl bg-white px-5 py-4 text-[#1b1d1f] shadow-2xl md:-right-4"
                    style={{ transform: 'translateZ(120px)' }}
                  >
                    <div className="text-2xl font-bold">
                      до <CountUp to={95} suffix="%" />
                    </div>
                    <div className="text-xs font-semibold uppercase">рабочих устройств</div>
                  </div>
                  <div
                    className="absolute bottom-[2%] left-[8%] rounded-3xl bg-[#1c1f1d] px-5 py-4 text-white shadow-2xl"
                    style={{ transform: 'translateZ(70px)' }}
                  >
                    <div className="text-2xl font-bold text-[#2dd765]">
                      до <CountUp to={20} suffix="%" />
                    </div>
                    <div className="text-xs font-semibold uppercase">снижение поломок</div>
                  </div>
                </Tilt>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Связаться ---------- */}
        <section id="contact" className="mx-panel bg-[#cbf23d] text-[#0b1324]" data-panel="last">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-[0.07]" aria-hidden="true">
            <Marquee speed={60}>
              {['Ремонт ТСД', 'Сканеры', 'Принтеры этикеток', 'Планшеты', 'Техобслуживание', 'Инлокер+'].map((w) => (
                <span key={w} className="mr-12 whitespace-nowrap text-[clamp(5rem,14vw,12rem)] font-bold tracking-tighter">
                  {w} ·
                </span>
              ))}
            </Marquee>
          </div>
          <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-20 md:px-12 md:py-28 lg:pl-24">
            <div className="grid items-end gap-12 lg:grid-cols-12">
              <div className="min-w-0 lg:col-span-7">
                <div className="mx-kicker mb-5 !text-[#0b1324]/60" data-reveal>
                  Связаться
                </div>
                <Lines lines={['Сломалось', 'оборудование?', 'Починим.']} className="mx-fit text-[clamp(2.3rem,7vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.045em]" />
              </div>
              <div className="min-w-0 lg:col-span-5" data-reveal="right">
                <a href={`tel:${tel}`} className="block text-3xl font-bold tracking-tight hover:underline md:text-4xl">
                  {SITE_CONFIG.phone}
                </a>
                <a href={`mailto:${SITE_CONFIG.email}`} className="mt-2 block text-lg font-medium hover:underline">
                  {SITE_CONFIG.email}
                </a>
                <p className="mt-3 text-sm text-[#0b1324]/70">
                  {SITE_CONFIG.address}
                  <br />
                  {SITE_CONFIG.workingHours}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link href="/contacts" className="mx-btn mx-btn-dark" data-magnet>
                    Оставить заявку <i className="fas fa-arrow-right text-sm" />
                  </Link>
                  <a href={`tel:${tel}`} className="mx-btn bg-white text-[#0b1324]" data-magnet>
                    <i className="fas fa-phone text-sm" /> Позвонить
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
