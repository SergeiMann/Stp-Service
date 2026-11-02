'use client'

import { useEffect, useState } from 'react'

const timeFmt = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit' })
const partsFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Moscow', weekday: 'short', hour: 'numeric', hourCycle: 'h23' })

// Часы работы из SITE_CONFIG.workingHours: пн-пт 10:00-19:00
function isOpen(date: Date) {
  const parts = partsFmt.formatToParts(date)
  const weekday = parts.find((p) => p.type === 'weekday')?.value
  const hour = Number(parts.find((p) => p.type === 'hour')?.value)
  return weekday !== 'Sat' && weekday !== 'Sun' && hour >= 10 && hour < 19
}

/** «Москва · 14:32» и статус «открыто / закрыто» по московскому времени */
export function LiveClock({ className = '', showStatus = true }: { className?: string; showStatus?: boolean }) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 15000)
    return () => window.clearInterval(id)
  }, [])

  const open = now ? isOpen(now) : true

  return (
    <span className={`inline-flex items-center gap-2 tabular-nums ${className}`}>
      {showStatus && <span className={`mx-dot ${open ? '' : 'is-off'}`} aria-hidden="true" />}
      <span>Москва · {now ? timeFmt.format(now) : '--:--'}</span>
      {showStatus && now && <span className="opacity-60">{open ? 'открыто' : 'закрыто'}</span>}
    </span>
  )
}
