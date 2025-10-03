'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE_CONFIG } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { CartModal } from '@/components/ui/CartModal'
import { AuthModal } from '@/components/ui/AuthModal'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'Каталог', href: '/catalog' },
  { name: 'Услуги', href: '/services' },
  { name: 'О компании', href: '/about' },
  { name: 'Контакты', href: '/contacts' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const pathname = usePathname()
  const { itemCount } = useCart()
  const { user, logout, loading } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img 
                src="/images/brands/logo.svg" 
                alt={SITE_CONFIG.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-xl text-gray-900">{SITE_CONFIG.name}</div>
              <div className="text-sm text-gray-600">{SITE_CONFIG.tagline}</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === item.href
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-right">
              <div className="font-semibold text-gray-900">{SITE_CONFIG.phone}</div>
              <div className="text-sm text-gray-600">Ежедневно 9:00-21:00</div>
            </div>
            
            {/* Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
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
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name || user.email}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                  title="Выйти"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsAuthOpen(true)}
              >
                Войти
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-base font-medium transition-colors hover:text-blue-600 ${
                    pathname === item.href ? 'text-blue-600' : 'text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="font-semibold text-gray-900">{SITE_CONFIG.phone}</div>
                <div className="text-sm text-gray-600 mb-3">Ежедневно 9:00-21:00</div>
                <Button size="sm" className="w-full">
                  Заказать звонок
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
      
      {/* Cart Modal */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </header>
  )
}
