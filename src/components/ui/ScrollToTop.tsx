'use client'

import { useState, useEffect } from 'react'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Ищем snap-контейнер
      const snapContainer = document.querySelector('.snap-container')
      if (snapContainer && snapContainer.scrollTop > 300) {
        setIsVisible(true)
      } else if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Слушаем скролл как на window, так и на snap-контейнере
    const snapContainer = document.querySelector('.snap-container')
    
    window.addEventListener('scroll', toggleVisibility)
    if (snapContainer) {
      snapContainer.addEventListener('scroll', toggleVisibility)
    }

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
      if (snapContainer) {
        snapContainer.removeEventListener('scroll', toggleVisibility)
      }
    }
  }, [])

  const scrollToTop = () => {
    // Пытаемся скроллить snap-контейнер, если он есть
    const snapContainer = document.querySelector('.snap-container')
    if (snapContainer) {
      snapContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <button
      className={`fixed bottom-8 right-8 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
      onClick={scrollToTop}
      aria-label="Вернуться вверх"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  )
}
