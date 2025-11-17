'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SITE_CONFIG } from '@/lib/constants'

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'Каталог', href: '/catalog' },
  { name: 'Услуги', href: '/services' },
  { name: 'О компании', href: '/about' },
  { name: 'Инлокер', href: '/inlocker' },
  { name: 'Контакты', href: '/contacts' },
]

export function HeroHeaderHome() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-4">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden">
            <img
              src="/images/brands/logo.png"
              alt="СТП-Сервис"
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <div className="font-bold text-3xl text-white">СТП-Сервис</div>
            <div className="text-base text-gray-300">
              Ремонт и поставка оборудования для маркировки
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Contact Info */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="text-right">
            <div className="font-semibold text-white">{SITE_CONFIG.phone}</div>
            <div className="text-sm text-gray-300">пн-пт 10:00-19:00</div>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-md text-white hover:text-blue-300"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Открыть меню"
          aria-expanded={isMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-white/20 py-4 mt-2">
          <nav className="flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-base font-medium transition-colors ${
                  pathname === item.href ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/20">
              <div className="font-semibold text-white">{SITE_CONFIG.phone}</div>
              <div className="text-sm text-gray-300">пн-пт 10:00-19:00</div>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}


