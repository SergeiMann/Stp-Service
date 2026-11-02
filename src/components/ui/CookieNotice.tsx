'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const CONSENT_STORAGE_KEY = 'stp-cookie-notice-accepted'

export function CookieNotice() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    try {
      setIsVisible(localStorage.getItem(CONSENT_STORAGE_KEY) !== 'true')
    } catch {
      setIsVisible(true)
    }
  }, [])

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'true')
    } catch {
      // Hide the notice for this page even when storage is unavailable.
    }
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <aside
      aria-label="Уведомление об использовании cookie"
      className="mx-cookie"
    >
      <p className="flex-1 text-sm leading-6">
        На сайте используются cookie для его корректной работы и улучшения сервиса. Продолжая пользоваться сайтом, вы соглашаетесь с их использованием. Подробнее — в{' '}
        <Link href="/privacy" className="text-[#cbf23d] underline underline-offset-2 hover:text-white">
          Политике обработки персональных данных
        </Link>
        .
      </p>
      <button
        type="button"
        onClick={accept}
        className="mx-btn mx-btn-primary h-11 shrink-0 px-6 text-sm"
      >
        Понятно
      </button>
    </aside>
  )
}
