'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { hasFinePointer, lerp, prefersReducedMotion } from './utils'

interface TiltProps {
  children: ReactNode
  className?: string
  /** Наибольший наклон, градусы */
  max?: number
  glare?: boolean
}

/** Карточка наклоняется к курсору, по ней скользит блик */
export function Tilt({ children, className = '', max = 10, glare = true }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !hasFinePointer() || prefersReducedMotion()) return

    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    let frame = 0

    const tick = () => {
      cur.x = lerp(cur.x, target.x, 0.12)
      cur.y = lerp(cur.y, target.y, 0.12)
      el.style.setProperty('--tx', `${cur.x.toFixed(3)}deg`)
      el.style.setProperty('--ty', `${cur.y.toFixed(3)}deg`)
      const settled = Math.abs(cur.x - target.x) < 0.01 && Math.abs(cur.y - target.y) < 0.01
      frame = settled ? 0 : requestAnimationFrame(tick)
    }
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      target.y = (px - 0.5) * max * 2
      target.x = -(py - 0.5) * max * 2
      el.style.setProperty('--gx', `${px * 100}%`)
      el.style.setProperty('--gy', `${py * 100}%`)
      el.style.setProperty('--go', '1')
      kick()
    }
    const onLeave = () => {
      target.x = 0
      target.y = 0
      el.style.setProperty('--go', '0')
      kick()
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [max])

  return (
    <div ref={ref} className={`mx-tilt relative ${className}`}>
      {children}
      {glare && <div className="mx-tilt-glare" aria-hidden="true" />}
    </div>
  )
}
