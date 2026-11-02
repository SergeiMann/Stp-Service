'use client'

import { CSSProperties, ReactNode, useEffect, useRef } from 'react'
import { clamp, hasFinePointer, lerp, prefersReducedMotion } from './utils'

interface FloatSceneProps {
  children: ReactNode
  className?: string
  /** Наибольший наклон сцены под курсором, градусы */
  maxTilt?: number
}

/**
 * 3D-сцена первого экрана: сцена поворачивается вслед за курсором,
 * а при прокрутке элементы разлетаются к зрителю (--sp от 0 до 1).
 */
export function FloatScene({ children, className = '', maxTilt = 12 }: FloatSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const scene = sceneRef.current
    if (!wrap || !scene || prefersReducedMotion()) return

    const fine = hasFinePointer()
    const target = { rx: 0, ry: 0 }
    const cur = { rx: 0, ry: 0, sp: 0 }
    let visible = true
    let frame = 0

    const onPointer = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      target.ry = nx * maxTilt * 2
      target.rx = -ny * maxTilt
    }

    const tick = () => {
      frame = 0
      if (!visible) return
      const r = wrap.getBoundingClientRect()
      const sp = clamp(-r.top / (r.height * 1.1) + 0.05)
      // Без мыши сцена медленно покачивается сама
      if (!fine) {
        const t = performance.now() / 1000
        target.ry = Math.sin(t * 0.5) * maxTilt * 0.6
        target.rx = Math.cos(t * 0.4) * maxTilt * 0.3
      }
      cur.rx = lerp(cur.rx, target.rx, 0.06)
      cur.ry = lerp(cur.ry, target.ry, 0.06)
      cur.sp = lerp(cur.sp, sp, 0.12)
      scene.style.setProperty('--rx', `${cur.rx.toFixed(3)}deg`)
      scene.style.setProperty('--ry', `${cur.ry.toFixed(3)}deg`)
      scene.style.setProperty('--sp', cur.sp.toFixed(4))
      frame = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame) frame = requestAnimationFrame(tick)
    })
    io.observe(wrap)
    if (fine) window.addEventListener('pointermove', onPointer, { passive: true })
    frame = requestAnimationFrame(tick)

    return () => {
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      cancelAnimationFrame(frame)
    }
  }, [maxTilt])

  return (
    <div ref={wrapRef} className={`mx-scene-wrap ${className}`}>
      <div ref={sceneRef} className="mx-scene">
        {children}
      </div>
    </div>
  )
}

interface FloatItemProps {
  children: ReactNode
  /** Положение центра в процентах сцены */
  x: number
  y: number
  /** Глубина, px: больше — ближе к зрителю */
  z?: number
  rotate?: number
  /** Задержка влета, мс */
  delay?: number
  /** Период покачивания, с */
  duration?: number
  className?: string
}

export function FloatItem({ children, x, y, z = 0, rotate = 0, delay = 0, duration = 7, className = '' }: FloatItemProps) {
  const style = {
    '--x': x,
    '--y': y,
    '--z': z,
    '--r': `${rotate}deg`,
    '--in': `${delay}ms`,
    '--dur': `${duration}s`,
    '--del': `${-(delay / 1000) * 1.7}s`,
    zIndex: Math.round(z + 1000),
  } as CSSProperties

  return (
    <div className={`mx-fl ${className}`} style={style}>
      <div className="mx-fl-in">
        <div className="mx-fl-bob">{children}</div>
      </div>
    </div>
  )
}
