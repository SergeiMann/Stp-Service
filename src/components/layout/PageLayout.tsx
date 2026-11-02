import { CSSProperties, ReactNode } from 'react'
import { MotionRuntime } from '@/components/motion/MotionRuntime'
import { SiteHeader } from '@/components/motion/SiteHeader'
import { FloatScene, FloatItem } from '@/components/motion/FloatScene'

interface PageLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  badge?: string
  /** Фото устройства без фона: парит в 3D справа от заголовка */
  heroImage?: string
  /** Подписи-плашки, которые парят вокруг фото */
  heroChips?: string[]
  /** Короткий первый экран без 3D-сцены — для рабочих страниц вроде каталога */
  compact?: boolean
  className?: string
}

const CHIP_TONES = ['mx-chip-lime', 'mx-chip-blue', 'mx-chip-white']
// Плашки держатся внутри колонки сцены, чтобы не вылезать за край экрана
const CHIP_SPOTS = [
  { x: 26, y: 14, z: 160, rotate: -7 },
  { x: 70, y: 74, z: 200, rotate: 6 },
  { x: 30, y: 90, z: 120, rotate: 3 },
]

/**
 * Каркас внутренних страниц в новом дизайне: шапка, первый экран с заголовком
 * и необязательной 3D-сценой, дальше — содержимое страницы.
 */
export function PageLayout({ children, title, subtitle, badge, heroImage, heroChips = [], compact = false, className = '' }: PageLayoutProps) {
  const showScene = Boolean(heroImage) && !compact
  return (
    <div className="mx-root min-h-screen">
      <MotionRuntime />
      <SiteHeader />

      <section className={`mx-page-hero relative overflow-hidden ${compact ? 'pb-6 pt-28 md:pb-8 md:pt-32' : 'pb-12 pt-32 md:pb-16 md:pt-40'}`}>
        <div className="mx-grid-bg" />
        <div className="mx-orb -right-40 -top-20 h-[460px] w-[460px] bg-[#3d6bff]/25" />
        <div className="mx-orb -left-40 top-40 h-[360px] w-[360px] bg-[#7b5cff]/15" style={{ animationDelay: '-6s' }} />

        <div className="relative z-10 mx-auto grid max-w-[1440px] items-center gap-8 px-4 md:px-8 lg:grid-cols-12">
          <div className={`min-w-0 ${showScene ? 'lg:col-span-8' : 'lg:col-span-10'} 2xl:pl-16`}>
            {badge && (
              <div className="mb-6" data-load style={{ '--d': '80ms' } as CSSProperties}>
                <span className="mx-badge">
                  <span className="mx-dot" /> {badge}
                </span>
              </div>
            )}
            <h1 className={`mx-page-title ${compact ? '!text-[clamp(2.1rem,4vw,3.4rem)]' : ''}`} data-load style={{ '--d': '160ms' } as CSSProperties}>
              {title}
            </h1>
            {subtitle && (
              <p className={`max-w-2xl text-lg leading-relaxed text-[#a9b4cf] ${compact ? 'mt-3' : 'mt-6 md:text-xl'}`} data-load style={{ '--d': '300ms' } as CSSProperties}>
                {subtitle}
              </p>
            )}
          </div>

          {showScene && (
            <FloatScene className="hidden h-[340px] lg:col-span-4 lg:block" maxTilt={10}>
              <FloatItem x={55} y={50} z={60} delay={200} duration={8}>
                <div className="mx-dev h-[240px] w-[240px]">
                  <img src={heroImage!} alt="" />
                </div>
              </FloatItem>
              {heroChips.slice(0, CHIP_SPOTS.length).map((chip, i) => (
                <FloatItem key={chip} {...CHIP_SPOTS[i]} delay={400 + i * 120} duration={6.5 + i}>
                  <span className={`mx-chip ${CHIP_TONES[i]} text-sm`}>{chip}</span>
                </FloatItem>
              ))}
            </FloatScene>
          )}
        </div>
      </section>

      <div className={`relative pb-6 ${className}`}>{children}</div>
    </div>
  )
}

/**
 * Скругленная панель-раздел внутренних страниц. В отличие от главной панель не откидывается
 * при прокрутке: на страницах с текстом и формами наклон выглядит как сломанная верстка.
 */
export function PagePanel({
  children,
  id,
  tone = 'dark',
  className = '',
}: {
  children: ReactNode
  id?: string
  tone?: 'dark' | 'ink' | 'blue' | 'lime'
  className?: string
}) {
  const tones = {
    dark: 'mx-panel-dark',
    ink: 'mx-panel-ink',
    blue: 'mx-panel-blue',
    lime: 'bg-[#cbf23d] text-[#0b1324]',
  }
  return (
    <section id={id} className={`mx-panel mx-panel-static ${tones[tone]}`} data-spot>
      <div className={`relative z-10 mx-auto max-w-[1440px] px-5 py-14 md:px-12 md:py-20 lg:pl-24 ${className}`}>{children}</div>
    </section>
  )
}
