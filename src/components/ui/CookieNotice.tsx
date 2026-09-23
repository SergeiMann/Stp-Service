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
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-4xl flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 text-gray-800 shadow-xl sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm leading-6">
        На сайте используются cookie для его корректной работы и улучшения сервиса. Продолжая пользоваться сайтом, вы соглашаетесь с их использованием. Подробнее — в{' '}
        <Link href="/privacy" className="text-blue-700 underline hover:text-blue-800">
          Политике обработки персональных данных
        </Link>
        .
      </p>
      <button
        type="button"
        onClick={accept}
        className="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Понятно
      </button>
    </aside>
  )
}
