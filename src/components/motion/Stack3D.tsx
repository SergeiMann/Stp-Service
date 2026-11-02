'use client'

import Link from 'next/link'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './utils'

export interface StackItem {
  id: string
  title: string
  description: string
  image?: string
  href?: string
  cta?: string
  bullets?: string[]
  /** Фон карточки */
  bg: string
  /** Темный текст на светлом фоне */
  darkText?: boolean
}

interface Stack3DProps {
  items: StackItem[]
  /** Пауза перед сменой карточки, мс */
  interval?: number
  listTitle?: string
}

/**
 * Список слева и 3D-стопка справа: активная карточка вытягивается из стопки с наклоном,
 * прежняя возвращается на свое место. Пока стопка на экране, карточки листаются сами.
 */
export function Stack3D({ items, interval = 5000, listTitle }: Stack3DProps) {
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const n = items.length
  const running = inView && !hovered

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!running || prefersReducedMotion()) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % n), interval)
    return () => window.clearTimeout(id)
  }, [running, active, n, interval])

  return (
    <div
      ref={rootRef}
      className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div className="lg:col-span-5" data-reveal="left">
        {listTitle && <div className="mx-kicker mb-4">{listTitle}</div>}
        <ul className="mx-stack-list space-y-1" role="tablist">
          {items.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`${i === active ? 'is-active' : ''} ${running ? 'is-running' : ''}`}
                style={{ '--dur': `${interval}ms` } as CSSProperties}
                onClick={() => setActive(i)}
              >
                <span className="text-xs font-semibold tabular-nums opacity-60 w-6">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-lg md:text-xl font-semibold tracking-tight">{item.title}</span>
                <i
                  className="fas fa-arrow-right ml-auto text-sm transition-transform duration-300"
                  style={{ transform: i === active ? 'none' : 'translateX(-6px)', opacity: i === active ? 1 : 0 }}
                />
                <span className="mx-progress" key={i === active ? `p-${active}` : undefined} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-7" data-reveal="tilt">
        <div className="mx-stack" style={{ '--n': n - 1 } as CSSProperties}>
          {items.map((item, i) => {
            const k = (i - active + n) % n
            const isActive = k === 0
            return (
              <article
                key={item.id}
                className={`mx-stack-card ${isActive ? 'is-active' : ''}`}
                style={{ '--k': k, zIndex: n - k, background: item.bg, color: item.darkText ? '#0b1324' : '#fff' } as CSSProperties}
                onClick={() => !isActive && setActive(i)}
                aria-hidden={!isActive}
              >
                <div className="mx-stack-head">
                  <span className="tabular-nums opacity-60">{String(i + 1).padStart(2, '0')}</span>
                  <span>{item.title}</span>
                </div>
                <div className="mx-stack-body grid md:grid-cols-2 gap-4 md:gap-6 px-6 md:px-8 pb-6 md:pb-8 h-[calc(100%-34px)]">
                  <div className="flex flex-col justify-between gap-4 pt-2 md:pt-4 order-2 md:order-1">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-3">{item.title}</h3>
                      <p className={`text-sm md:text-base leading-relaxed ${item.darkText ? 'text-slate-700' : 'text-white/80'}`}>
                        {item.description}
                      </p>
                      {item.bullets && (
                        <ul className="mt-3 space-y-1.5 text-sm">
                          {item.bullets.map((b) => (
                            <li key={b} className="flex gap-2">
                              <i className="fas fa-check mt-1 text-[11px] opacity-70" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {item.href && (
                      <Link
                        href={item.href}
                        tabIndex={isActive ? 0 : -1}
                        className={`self-start mx-btn h-12 px-5 text-sm ${item.darkText ? 'mx-btn-dark' : 'bg-white text-slate-900'}`}
                      >
                        {item.cta ?? 'Подробнее'} <i className="fas fa-arrow-right text-xs" />
                      </Link>
                    )}
                  </div>
                  {item.image && (
                    <div className="relative order-1 md:order-2 flex items-center justify-center min-h-[140px]">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="mx-stack-img max-h-[150px] md:max-h-[260px] w-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
