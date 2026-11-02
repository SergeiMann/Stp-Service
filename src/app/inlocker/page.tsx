import { Metadata } from 'next'
import Link from 'next/link'
import { CSSProperties } from 'react'
import { MotionRuntime } from '@/components/motion/MotionRuntime'
import { SiteHeader } from '@/components/motion/SiteHeader'
import { SideRail, RailSection } from '@/components/motion/SideRail'
import { FloatScene, FloatItem } from '@/components/motion/FloatScene'
import { Stack3D, StackItem } from '@/components/motion/Stack3D'
import { Scatter3D, ScatterItem } from '@/components/motion/Scatter3D'
import { CountUp } from '@/components/motion/CountUp'
import { Tilt } from '@/components/motion/Tilt'
import { Marquee } from '@/components/motion/Marquee'

export const metadata: Metadata = {
  title: 'Инлокер — автоматизированная система ячеек',
  description: 'Инлокер — система ячеек для хранения и учёта оборудования: контроль, безопасность, аналитика и интеграции. Подходит для складов, производств, офисов и сервисных центров.'
}

// Страница партнерского продукта оформлена в фирменном стиле Инлокера (inlocker.ru): тема .il-root
const sections: RailSection[] = [
  { id: 'top', label: 'Инлокер', icon: 'fas fa-lock' },
  { id: 'benefits', label: 'Преимущества', icon: 'fas fa-star' },
  { id: 'elements', label: 'Элементы системы', icon: 'fas fa-layer-group' },
  { id: 'lockers', label: 'Система ячеек', icon: 'fas fa-table-cells-large' },
  { id: 'dashboard', label: 'Личный кабинет', icon: 'fas fa-chart-line' },
  { id: 'module', label: 'Модуль управления', icon: 'fas fa-microchip' },
  { id: 'cta', label: 'Внедрить', icon: 'fas fa-paper-plane' },
]

const benefits: ScatterItem[] = [
  {
    id: 'human',
    icon: 'fas fa-user-shield',
    title: 'Исключает человеческий фактор',
    description: 'Выдача/возврат через ячейки и роли доступа',
    tone: 'bg-white text-[#1b1d1f]',
    iconTone: 'bg-[#2dd765] text-white',
  },
  {
    id: 'remote',
    icon: 'fas fa-satellite-dish',
    title: 'Контроль состояния удалённо',
    description: 'Статусы, проблемы, медосмотр, сервис',
    tone: 'bg-white text-[#1b1d1f]',
    iconTone: 'bg-[#2dd765] text-white',
  },
  {
    id: 'costs',
    icon: 'fas fa-piggy-bank',
    title: 'Снижает расходы',
    description: 'Меньше потерь, меньше внепланового ремонта',
    tone: 'bg-[#2dd765] text-white',
    iconTone: 'bg-white text-[#16b455]',
  },
  {
    id: 'speed',
    icon: 'fas fa-bolt',
    title: 'Ускоряет учёт',
    description: 'Автоматические отчёты и аналитика',
    tone: 'bg-[#1c1f1d] text-white',
    iconTone: 'bg-[#2dd765] text-white',
  },
]

const elements: StackItem[] = [
  {
    id: 'lockers',
    title: 'Система ячеек',
    description: '4 типоразмера, USB для зарядки',
    bullets: ['Цветовая индикация, считыватель, экран', 'Питание, Wi‑Fi, до 480 ячеек на систему'],
    image: '/images/inlocker/4_shkaf.png',
    href: '#lockers',
    cta: 'Подробнее',
    bg: 'linear-gradient(150deg, #3be074 0%, #1fbf58 100%)',
  },
  {
    id: 'module',
    title: 'Модуль управления',
    description: 'Отвечает за весь функционал',
    bullets: ['Поддержка объектов, пользователей, прав доступа', 'Интеграция с вашей системой'],
    image: '/images/inlocker/auth.png',
    href: '#module',
    cta: 'Подробнее',
    bg: '#f1f4f2',
    darkText: true,
  },
  {
    id: 'dashboard',
    title: 'Личный кабинет',
    description: 'Учёт, распределение, статистика',
    bullets: ['Управление ролями и правами', 'Отчёты, проблемы, ремонт, расходники'],
    image: '/images/inlocker/adminka.png',
    href: '#dashboard',
    cta: 'Подробнее',
    bg: '#1c1f1d',
  },
]

const moduleSpecs = [
  { label: 'WI‑FI', tip: 'Диапазоны 2,4 и 5 ГГц' },
  { label: 'Экран', tip: '10″ антивандальный проекционно‑емкостный сенсорный монитор' },
  { label: 'ОС', tip: 'Linux ARM' },
  { label: 'ПО', tip: 'ПО Инлокер: мониторинг, аналитика, управление' },
  { label: 'Считыватель', tip: 'Считыватель карт 6‑в‑1 R15‑Multi: 2.4 ГГц, 13.56 МГц, 125 КГц, NFC' },
  { label: 'Питание', tip: 'Вход 200–240 VAC. Выход: 12V, 17A, 204W. Встроенный PFC > 0.5' },
  { label: 'Цветовая индикация', tip: 'Светодиодная адресная подсветка' },
]

const dashboardTabs = ['Пользователи', 'Шкафы', 'Проблемы', 'Сервис', 'Объекты', 'Оборудование', 'Медосмотр', 'Ремонт', 'Расходники']

function Lines({ lines, className = '' }: { lines: string[]; className?: string }) {
  return (
    <h2 className={className} data-reveal="lines">
      {lines.map((l, i) => (
        <span key={l} className="mx-ln" style={{ '--i': i } as CSSProperties}>
          <span>{l}</span>
        </span>
      ))}
    </h2>
  )
}

export default function InlockerPage() {
  return (
    <div className="mx-root il-root">
      <MotionRuntime />
      <SiteHeader light />
      <SideRail sections={sections} />

      {/* ---------- Первый экран ---------- */}
      <section id="top" className="il-hero">
        <div className="mx-grid-bg" />
        <div className="relative z-10 mx-auto grid max-w-[1440px] min-h-[calc(100svh-20px)] grid-cols-1 items-center gap-6 px-4 pb-16 pt-28 md:px-8 lg:grid-cols-12 lg:pt-24">
          <div className="min-w-0 lg:col-span-6 2xl:pl-16">
            <div className="mb-7" data-load style={{ '--d': '100ms' } as CSSProperties}>
              <span className="mx-badge">
                <span className="mx-dot !bg-[#2dd765]" /> Инлокер+ · простое и технологичное решение
              </span>
            </div>
            <h1 className="mx-fit [--fit:11.2cqi] text-[clamp(2rem,4.6vw+0.4rem,5rem)] font-bold leading-[0.98] tracking-[-0.04em]" data-load="lines">
              <span className="mx-ln" style={{ '--i': 0 } as CSSProperties}>
                <span>
                  <span className="text-[#2dd765]">Инлокер</span> —
                </span>
              </span>
              <span className="mx-ln" style={{ '--i': 1 } as CSSProperties}>
                <span>система ячеек</span>
              </span>
              <span className="mx-ln" style={{ '--i': 2 } as CSSProperties}>
                <span>хранения и учёта</span>
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#4b524e]" data-load style={{ '--d': '500ms' } as CSSProperties}>
              Исключает человеческий фактор, контролирует состояние оборудования удалённо, снижает расходы и ускоряет учёт
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-load style={{ '--d': '650ms' } as CSSProperties}>
              <Link href="/contacts" className="mx-btn mx-btn-dark" data-magnet>
                Заказать демонстрацию <i className="fas fa-arrow-right text-sm" />
              </Link>
              <Link href="#elements" className="mx-btn mx-btn-ghost" data-magnet>
                Элементы системы
              </Link>
            </div>
            <div className="mt-12 hidden items-center gap-10 sm:flex" data-load style={{ '--d': '800ms' } as CSSProperties}>
              <span className="mx-scroll-cue">
                <i /> Листайте
              </span>
              <div className="flex gap-8 text-sm text-[#6b7570]">
                <div>
                  <div className="text-2xl font-bold text-[#1b1d1f]">480+</div>
                  ячеек в одной системе
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#1b1d1f]">24/7</div>
                  мониторинг и контроль
                </div>
              </div>
            </div>
          </div>

          <FloatScene className="h-[440px] sm:h-[540px] lg:col-span-6 lg:h-[660px]">
            <FloatItem x={50} y={50} z={40} delay={150} duration={10}>
              <img
                src="/images/inlocker/4_shkaf.png"
                alt="Система ячеек Инлокер"
                className="w-[340px] max-w-none drop-shadow-[0_40px_50px_rgba(20,60,35,0.35)]"
              />
            </FloatItem>
            <FloatItem x={16} y={30} z={150} rotate={-6} delay={300} duration={8}>
              <div className="mx-dev h-[170px] w-[170px] p-3">
                <img src="/images/inlocker/2_shkaf.png" alt="Ячейки M и L" />
              </div>
            </FloatItem>
            <FloatItem x={84} y={24} z={110} rotate={7} delay={400} duration={8.5}>
              <div className="mx-dev h-[190px] w-[150px]">
                <img src="/images/inlocker/auth.png" alt="Модуль управления" />
              </div>
            </FloatItem>
            <FloatItem x={82} y={80} z={200} rotate={-4} delay={500} duration={7}>
              <div className="mx-dev h-[130px] w-[150px]">
                <img src="/images/inlocker/1_shkaf.png" alt="Ячейка S" />
              </div>
            </FloatItem>

            <FloatItem x={40} y={9} z={240} rotate={-5} delay={650} duration={6.5}>
              <span className="mx-chip il-chip-green">
                <i className="fas fa-table-cells-large" /> до 480 ячеек
              </span>
            </FloatItem>
            <FloatItem x={14} y={64} z={260} rotate={-9} delay={750} duration={7}>
              <span className="mx-chip il-chip-white">
                <i className="fas fa-wifi text-[#2dd765]" /> Wi‑Fi 2,4 / 5 ГГц
              </span>
            </FloatItem>
            <FloatItem x={88} y={52} z={230} rotate={8} delay={850} duration={6.8}>
              <span className="mx-chip il-chip-dark">
                <i className="fas fa-id-card text-[#2dd765]" /> NFC · RFID
              </span>
            </FloatItem>
            <FloatItem x={46} y={93} z={150} rotate={3} delay={950} duration={7.4}>
              <span className="mx-chip il-chip-white">
                <i className="fas fa-chart-line text-[#2dd765]" /> Личный кабинет
              </span>
            </FloatItem>
          </FloatScene>
        </div>
      </section>

      <div className="py-6 md:py-8" aria-hidden="true">
        <Marquee speed={40}>
          {dashboardTabs.concat(moduleSpecs.map((s) => s.label)).map((t) => (
            <span
              key={t}
              className="mr-3 inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1b1d1f] shadow-[0_8px_24px_-16px_rgba(0,0,0,0.3)]"
            >
              <i className="fas fa-circle text-[6px] text-[#2dd765]" /> {t}
            </span>
          ))}
        </Marquee>
      </div>

      <div className="mx-panels pb-4 md:pb-6">
        {/* ---------- Преимущества ---------- */}
        <section id="benefits" className="mx-panel il-panel-mint" data-panel data-spot>
          <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 md:px-12 md:py-24 lg:pl-24">
            <div className="mb-12 grid gap-6 md:mb-16 lg:grid-cols-2 lg:items-end">
              <div>
                <div className="mx-kicker mb-5" data-reveal>
                  Простое и технологичное решение
                </div>
                <Lines lines={['Сократите простои', 'и потери']} className="mx-h2" />
              </div>
              <p className="max-w-lg text-lg text-[#4b524e] lg:justify-self-end" data-reveal style={{ '--d': '200ms' } as CSSProperties}>
                Благодаря удобному личному кабинету процессы контроля, учёта и аналитики происходят автоматически. Решение
                быстро интегрируется во внутренние процессы и масштабируется под ваши задачи.
              </p>
            </div>
            <Scatter3D items={benefits} gridClassName="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" />
          </div>
        </section>

        {/* ---------- Элементы: 3D-стопка ---------- */}
        <section id="elements" className="mx-panel il-panel-white" data-panel data-spot>
          <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 md:px-12 md:py-24 lg:pl-24">
            <div className="mb-12 md:mb-16">
              <div className="mx-kicker mb-5" data-reveal>
                Элементы системы
              </div>
              <Lines lines={['Всего', '3 элемента']} className="mx-h2" />
            </div>
            <Stack3D items={elements} listTitle="Из чего состоит" interval={5500} />
          </div>
        </section>

        {/* ---------- Система ячеек ---------- */}
        <section id="lockers" className="mx-panel il-panel-mint" data-panel data-spot>
          <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 md:px-12 md:py-24 lg:pl-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mx-kicker mb-5" data-reveal>
                  01 · Ячейки
                </div>
                <Lines lines={['Система ячеек']} className="mx-h2" />
                <p className="mt-6 text-lg text-[#4b524e]" data-reveal>
                  С возможностью установки USB для зарядки. Доступны 4 типоразмера — от S до XL.
                </p>
                <ul className="mt-6 space-y-3" data-reveal>
                  {['Цветовая индикация, считыватель, экран', 'Питание, Wi‑Fi, до 480 ячеек на систему', 'Индивидуальная компоновка под задачи и помещение'].map((t) => (
                    <li key={t} className="flex gap-3 text-[#1b1d1f]">
                      <i className="fas fa-check mt-1 text-[#2dd765]" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-end justify-center gap-3 md:gap-6" style={{ perspective: '1200px' }}>
                {[
                  { src: '/images/inlocker/1_shkaf.png', alt: 'Ячейка S', w: 'w-[24%] md:w-32' },
                  { src: '/images/inlocker/2_shkaf.png', alt: 'Ячейки M/L', w: 'w-[31%] md:w-44' },
                  { src: '/images/inlocker/4_shkaf.png', alt: 'Ячейки XL', w: 'w-[41%] md:w-60' },
                ].map((l, i) => (
                  <div key={l.src} className={l.w} data-reveal="tilt" style={{ '--d': `${i * 150}ms` } as CSSProperties}>
                    <Tilt max={14} glare={false}>
                      <img src={l.src} alt={l.alt} loading="lazy" className="w-full drop-shadow-[0_24px_30px_rgba(20,60,35,0.3)]" />
                    </Tilt>
                    <div className="mt-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#6b7570] md:text-xs">{l.alt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Личный кабинет ---------- */}
        <section id="dashboard" className="mx-panel il-panel-white" data-panel data-spot>
          <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 md:px-12 md:py-24 lg:pl-24">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="mx-kicker mb-5" data-reveal>
                  02 · Личный кабинет
                </div>
                <Lines lines={['Личный кабинет', 'администратора']} className="mx-h2 !text-[clamp(2rem,3.6vw,3.4rem)]" />
                <p className="mt-6 text-lg text-[#4b524e]" data-reveal>
                  Контролирует работу всех параметров с доступом с любого устройства.
                </p>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {dashboardTabs.map((t, i) => (
                    <span key={t} className="mx-pill" data-reveal="scale" style={{ '--d': `${i * 50}ms` } as CSSProperties}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-7" data-reveal="tilt">
                <Tilt max={6} className="rounded-[26px]">
                  <div className="mx-window !shadow-[0_40px_90px_-40px_rgba(20,60,35,0.5)] ring-1 ring-black/5">
                    <div className="mx-window-bar">
                      <i />
                      <i />
                      <i />
                      <span className="ml-3 text-xs font-medium text-slate-500">Инлокер · личный кабинет</span>
                    </div>
                    <img src="/images/inlocker/adminka.png" alt="Личный кабинет — экран" loading="lazy" className="w-full" />
                  </div>
                </Tilt>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Модуль управления ---------- */}
        <section id="module" className="mx-panel il-panel-dark" data-panel data-spot>
          <div className="mx-orb w-[460px] h-[460px] right-0 top-0 bg-[#2dd765]/20" />
          <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-16 md:px-12 md:py-24 lg:pl-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mx-kicker mb-5 !text-[#2dd765]" data-reveal>
                  03 · Модуль
                </div>
                <Lines lines={['Модуль управления']} className="mx-h2" />
                <p className="mt-6 text-lg text-white/70" data-reveal>
                  Отвечает за весь функционал и поддерживает до 480 ячеек в работе. Наведите на характеристику, чтобы увидеть
                  подробности.
                </p>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {moduleSpecs.map((s, i) => (
                    <span key={s.label} tabIndex={0} className="mx-pill cursor-default" data-reveal="scale" style={{ '--d': `${i * 60}ms` } as CSSProperties}>
                      {s.label}
                      <span className="mx-tip" role="tooltip">
                        {s.tip}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-center" data-reveal="scale">
                <Tilt max={12} className="w-full max-w-sm rounded-[32px]">
                  <div className="mx-dev aspect-[3/4] w-full">
                    <img src="/images/inlocker/auth.png" alt="Модуль управления" loading="lazy" style={{ transform: 'translateZ(50px)' }} />
                  </div>
                </Tilt>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Внедрение ---------- */}
        <section id="cta" className="mx-panel il-panel-green" data-panel="last">
          <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-20 md:px-12 md:py-28 lg:pl-24">
            <div className="grid items-end gap-12 lg:grid-cols-12">
              <div className="min-w-0 lg:col-span-7">
                <Lines
                  lines={['Готовы внедрить', 'Инлокер?']}
                  className="mx-fit text-[clamp(2.3rem,7vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.045em]"
                />
                <p className="mt-6 max-w-lg text-lg text-white/85" data-reveal>
                  Оставьте контакты — пришлём чек‑лист как начать экономить и подготовим демо.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-reveal>
                  <Link href="/contacts" className="mx-btn mx-btn-dark" data-magnet>
                    Связаться с нами <i className="fas fa-arrow-right text-sm" />
                  </Link>
                  <Link href="/catalog" className="mx-btn bg-white text-[#1b1d1f]" data-magnet>
                    Сопутствующее оборудование
                  </Link>
                </div>
              </div>
              <div className="grid min-w-0 grid-cols-2 gap-4 lg:col-span-5" data-reveal="right">
                <div className="rounded-[28px] bg-[#1c1f1d] p-5 text-white md:p-6">
                  <div className="text-4xl font-bold tracking-tight text-[#2dd765] md:text-5xl">
                    <CountUp to={14} />
                  </div>
                  <div className="mt-2 text-sm text-white/70">дней бесплатного теста</div>
                </div>
                <div className="rounded-[28px] bg-white p-5 text-[#1b1d1f] md:p-6">
                  <div className="text-4xl font-bold tracking-tight md:text-5xl">24/7</div>
                  <div className="mt-2 text-sm text-[#6b7570]">мониторинг и контроль</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
