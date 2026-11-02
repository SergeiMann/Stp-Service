'use client'

import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './utils'

interface WordRotatorProps {
  words: string[]
  interval?: number
  className?: string
  /**
   * Классы каждого слова. Градиентный текст (background-clip: text) задается здесь, а не на
   * контейнере: на контейнере браузер рисует буквы всех слов одной маской, не учитывая их
   * сдвиг и прозрачность, и слова накладываются друг на друга.
   */
  wordClassName?: string
}

/** Слово в заголовке, которое по кругу сменяется: старое уезжает вверх, новое въезжает снизу */
export function WordRotator({ words, interval = 2600, className = '', wordClassName = '' }: WordRotatorProps) {
  const [index, setIndex] = useState(0)
  const prev = useRef<number | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = window.setInterval(() => {
      setIndex((i) => {
        prev.current = i
        return (i + 1) % words.length
      })
    }, interval)
    return () => window.clearInterval(id)
  }, [words.length, interval])

  return (
    <span className={`mx-rotator ${className}`} aria-hidden="true">
      {words.map((w, i) => (
        <span key={w} className={`${wordClassName} ${i === index ? 'is-on' : i === prev.current ? 'is-off' : ''}`}>
          {w}
        </span>
      ))}
    </span>
  )
}
