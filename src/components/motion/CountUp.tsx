'use client'

import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './utils'

interface CountUpProps {
  to: number
  from?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

/** Число «досчитывает» до значения, когда попадает в экран */
export function CountUp({ to, from = 0, prefix = '', suffix = '', duration = 1600, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  // До гидратации и без JS показываем итоговое значение
  const [value, setValue] = useState(to)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    setValue(from)
    let frame = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 4)
          setValue(Math.round(from + (to - from) * eased))
          if (t < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to, from, duration])

  return (
    <span ref={ref} className={`mx-stat ${className}`}>
      {prefix}
      {value}
      {suffix}
    </span>
  )
}
