import { CSSProperties, ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  /** Время полного круга, с */
  speed?: number
  reverse?: boolean
  className?: string
}

/** Бесконечная бегущая строка: содержимое повторено дважды, трек сдвигается на половину */
export function Marquee({ children, speed = 45, reverse = false, className = '' }: MarqueeProps) {
  return (
    <div className={`mx-marquee ${reverse ? 'is-reverse' : ''} ${className}`} style={{ '--speed': `${speed}s` } as CSSProperties}>
      <div className="mx-marquee-track">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
