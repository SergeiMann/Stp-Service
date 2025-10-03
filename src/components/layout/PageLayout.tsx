'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE_CONFIG } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { CartModal } from '@/components/ui/CartModal'
import { AuthModal } from '@/components/ui/AuthModal'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'Каталог', href: '/catalog' },
  { name: 'Услуги', href: '/services' },
  { name: 'О компании', href: '/about' },
  { name: 'Контакты', href: '/contacts' },
]

interface PageLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  badge?: string
  backgroundImage?: string
  className?: string
}

export function PageLayout({ 
  children, 
  title, 
  subtitle, 
  badge,
  backgroundImage = '/images/equipment/trade-and-warehouse-equipment-1.webp',
  className = ''
}: PageLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const pathname = usePathname()
  const { itemCount } = useCart()
  const { user, logout, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700">
      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: `url('${backgroundImage}')`
            }}
          >
            {/* Multi-layer overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/85 to-slate-900/95"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/90"></div>
            
            {/* Tech Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400/40 rounded-lg transform rotate-12 animate-pulse"></div>
              <div className="absolute top-40 right-32 w-24 h-24 border border-blue-400/30 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-32 left-32 w-40 h-40 border border-blue-400/35 rounded-lg transform -rotate-6 animate-pulse delay-700"></div>
              <div className="absolute bottom-20 right-20 w-28 h-28 border border-blue-400/40 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="relative z-30 container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src="/images/brands/logo.svg" 
                  alt="СТП-Сервис"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-xl text-white">СТП-Сервис</div>
                <div className="text-sm text-gray-300">Ремонт торгового оборудования</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-300 ${
                    pathname === item.href
                      ? 'text-blue-300 border-b-2 border-blue-300 pb-1'
                      : 'text-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Contact Info & CTA */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-right">
                <div className="font-semibold text-white">{SITE_CONFIG.phone}</div>
                <div className="text-sm text-gray-300">Ежедневно 9:00-21:00</div>
              </div>
              
              {/* Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-300 hover:text-blue-300 transition-colors"
              >
                <i className="fas fa-shopping-cart text-xl"></i>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              
              {/* User Auth */}
              {loading ? (
                <div className="w-8 h-8 animate-pulse bg-gray-600 rounded"></div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      {user.name || user.email}
                    </div>
                    <div className="text-xs text-gray-300">
                      {user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
                    </div>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="text-sm text-gray-300 hover:text-red-400 transition-colors"
                    title="Выйти"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsAuthOpen(true)}
                >
                  Войти
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md text-white hover:text-blue-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            <div className="lg:hidden border-t border-gray-600 py-4 mt-4">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-base font-medium transition-colors hover:text-blue-300 ${
                      pathname === item.href ? 'text-blue-300' : 'text-gray-300'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-600">
                  <div className="font-semibold text-white">{SITE_CONFIG.phone}</div>
                  <div className="text-sm text-gray-300 mb-3">Ежедневно 9:00-21:00</div>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Заказать звонок
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>

        {/* Page Title Section */}
        <div className="relative z-20 container mx-auto px-4 py-16">
          <div className="text-center text-white fade-in-up">
            {badge && (
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-600/20 backdrop-blur-sm rounded-full text-blue-300 text-sm font-medium border border-blue-400/30">
                  {badge}
                </span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className={`relative bg-gradient-to-b from-slate-800 to-slate-700 ${className}`}>
        {children}
      </div>

      {/* Modals */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
      
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </div>
  )
}
