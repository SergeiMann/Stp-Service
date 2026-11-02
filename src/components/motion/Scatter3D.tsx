'use client'

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'
import { hasFinePointer, prefersReducedMotion } from './utils'

export interface ScatterItem {
  id: string
  icon: string
  title: string
  description: string
  tags?: string[]
  meta?: ReactNode
  /** Классы фона и текста карточки */
  tone: string
  /** Классы плашки с иконкой */
  iconTone?: string
}

interface Scatter3DProps {
  items: ScatterItem[]
  className?: string
  gridClassName?: string
}

// Небольшие повороты, чтобы разлетевшиеся карточки лежали «живой» россыпью
const REST_ROTATIONS = [-2.5, 1.8, -1.2, 2.4, -1.8, 1.4, -2, 2]
const GATHER_ROTATIONS = [-14, 9, -6, 12, -10, 7, -12, 10]

/**
 * Карточки собраны в колоду в центре и разлетаются по местам, когда раздел попадает в экран.
 * Наведение или касание выдвигает карточку к зрителю, вся россыпь наклоняется за курсором.
 */
export function Scatter3D({ items, className = '', gridClassName = 'grid sm:grid-cols-2 lg:grid-cols-3 gap-5' }: Scatter3DProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState<string | null>(null)
  // Разлет хранится в состоянии компонента: класс, добавленный через classList, React стирает
  // при следующей перерисовке (например, по клику на карточку) — и карточки собирались обратно
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    const inner = innerRef.current
    if (!root || !inner) return
    if (prefersReducedMotion()) {
      setShown(true)
      return
    }

    // Смещение каждой карточки к центру россыпи — отсюда она и вылетает
    const place = () => {
      const cx = inner.offsetWidth / 2
      const cy = inner.offsetHeight / 2
      Array.from(inner.children).forEach((child) => {
        const el = child as HTMLElement
        el.style.setProperty('--fx', `${cx - (el.offsetLeft + el.offsetWidth / 2)}px`)
        el.style.setProperty('--fy', `${cy - (el.offsetTop + el.offsetHeight / 2)}px`)
      })
    }
    place()
    window.addEventListener('resize', place)

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(root)

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      inner.style.setProperty('--ry', `${(px * 8).toFixed(2)}deg`)
      inner.style.setProperty('--rx', `${(-py * 6).toFixed(2)}deg`)
    }
    const onLeave = () => {
      inner.style.setProperty('--ry', '0deg')
      inner.style.setProperty('--rx', '0deg')
    }
    const fine = hasFinePointer()
    if (fine) {
      root.addEventListener('pointermove', onMove)
      root.addEventListener('pointerleave', onLeave)
    }

    return () => {
      io.disconnect()
      window.removeEventListener('resize', place)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={rootRef} className={`mx-scatter ${shown ? 'is-in' : ''} ${picked ? 'has-pick' : ''} ${className}`}>
      <div ref={innerRef} className={`mx-scatter-inner ${gridClassName}`}>
        {items.map((item, i) => (
          <article
            key={item.id}
            className={`mx-sc-card rounded-[28px] p-6 md:p-7 cursor-pointer ${item.tone} ${picked === item.id ? 'is-picked' : ''}`}
            style={
              {
                '--d': `${i * 90}ms`,
                '--r0': `${GATHER_ROTATIONS[i % GATHER_ROTATIONS.length]}deg`,
                '--r1': `${REST_ROTATIONS[i % REST_ROTATIONS.length]}deg`,
              } as CSSProperties
            }
            onClick={() => setPicked((p) => (p === item.id ? null : item.id))}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl grid place-items-center text-lg ${item.iconTone ?? 'bg-black/15'}`}>
                <i className={item.icon} />
              </div>
              {item.meta && <div className="text-sm font-semibold opacity-80 text-right">{item.meta}</div>}
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2">{item.title}</h3>
            <p className="text-sm leading-relaxed opacity-80">{item.description}</p>
            {item.tags && (
              <div className="flex flex-wrap gap-1.5 mt-5">
                {item.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/10">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
