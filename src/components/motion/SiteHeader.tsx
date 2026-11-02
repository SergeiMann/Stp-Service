'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CSSProperties, useEffect, useState } from 'react'
import { SITE_CONFIG } from '@/lib/constants'
import { useCart } from '@/contexts/CartContext'
import { CartModal } from '@/components/ui/CartModal'
import { LiveClock } from './LiveClock'

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'Каталог', href: '/catalog' },
  { name: 'О компании', href: '/about' },
  { name: 'Инлокер', href: '/inlocker' },
  { name: 'Контакты', href: '/contacts' },
]

/**
 * Прозрачная шапка поверх первого экрана: при прокрутке становится стеклянной,
 * вниз — прячется, вверх — возвращается. light — для светлых страниц (Инлокер).
 */
export function SiteHeader({ light = false }: { light?: boolean }) {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 160)
        lastY = y
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header className={`mx-header ${light ? 'is-light' : ''} ${scrolled ? 'is-scrolled' : ''} ${hidden && !menuOpen ? 'is-hidden' : ''}`}>
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-4 px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="СТП-Сервис — на главную">
            {/* Логотип светлый, поэтому на светлой шапке он лежит на темной плашке */}
            <span className={light ? 'grid h-11 w-11 place-items-center rounded-xl bg-[#1b1d1f]' : ''}>
              <img src="/images/brands/logo.png" alt="" className={light ? 'h-8 w-8 object-contain' : 'h-11 w-11 object-contain'} />
            </span>
            <span className="leading-tight">
              <span className={`block text-lg font-bold tracking-tight ${light ? 'text-[#1b1d1f]' : 'text-white'}`}>СТП-Сервис</span>
              <span className={`hidden sm:block text-xs ${light ? 'text-[#6b7570]' : 'text-[#8e9ab6]'}`}>Ремонт и поставка оборудования</span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1 mx-auto">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className={`mx-nav-link ${pathname === item.href ? 'is-active' : ''}`}>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="ml-auto xl:ml-0 flex items-center gap-2 md:gap-4">
            <LiveClock className={`hidden 2xl:inline-flex text-xs whitespace-nowrap ${light ? 'text-[#6b7570]' : 'text-[#8e9ab6]'}`} />
            <a href={`tel:${SITE_CONFIG.phone.replace(/[^+\d]/g, '')}`} className={`hidden md:block whitespace-nowrap text-sm font-semibold ${light ? 'text-[#1b1d1f] hover:text-[#16b455]' : 'text-white hover:text-[#cbf23d]'}`}>
              {SITE_CONFIG.phone}
            </a>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Корзина"
              className={`relative grid h-11 w-11 place-items-center rounded-full ring-1 ${
                light ? 'bg-white text-[#1b1d1f] ring-black/10 hover:bg-[#f6fbf8]' : 'bg-white/5 text-white ring-white/10 hover:bg-white/10'
              }`}
            >
              <i className="fas fa-shopping-cart text-sm" />
              {itemCount > 0 && (
                <span className={`absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold ${light ? 'bg-[#2dd765] text-white' : 'bg-[#cbf23d] text-[#0b1324]'}`}>
                  {itemCount}
                </span>
              )}
            </button>
            {/* .mx-btn задает display, поэтому скрываем обертку, а не саму кнопку */}
            <span className="hidden md:inline-flex">
              <Link href="/contacts" className={`mx-btn h-11 px-5 text-sm ${light ? 'mx-btn-green' : 'mx-btn-primary'}`} data-magnet="0.2">
                Оставить заявку
              </Link>
            </span>
            <button
              type="button"
              className={`xl:hidden relative z-[80] grid h-11 w-11 place-items-center rounded-full ${light ? 'bg-[#1b1d1f] text-white' : 'bg-white text-[#0b1324]'}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
            >
              <i className={`fas ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mx-mobile-menu xl:hidden ${menuOpen ? 'is-open' : ''}`}
        style={light ? { background: 'rgba(255,255,255,.94)' } : undefined}
        aria-hidden={!menuOpen}
      >
        <nav className="flex h-full flex-col justify-center gap-2 px-8">
          {navigation.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className={`mx-mm-link text-4xl font-bold tracking-tight ${
                pathname === item.href ? (light ? 'text-[#16b455]' : 'text-[#cbf23d]') : light ? 'text-[#1b1d1f]' : 'text-white'
              }`}
              style={{ '--i': i } as CSSProperties}
            >
              {item.name}
            </Link>
          ))}
          <a
            href={`tel:${SITE_CONFIG.phone.replace(/[^+\d]/g, '')}`}
            tabIndex={menuOpen ? 0 : -1}
            className={`mx-mm-link mt-8 text-xl font-semibold ${light ? 'text-[#1b1d1f]' : 'text-white'}`}
            style={{ '--i': navigation.length } as CSSProperties}
          >
            {SITE_CONFIG.phone}
          </a>
          <span className="mx-mm-link text-sm text-[#8e9ab6]" style={{ '--i': navigation.length + 1 } as CSSProperties}>
            <LiveClock />
          </span>
        </nav>
      </div>

      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
