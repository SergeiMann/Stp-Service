import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants'

const footerLinks = {
  services: [
    { name: 'Ремонт ТСД', href: '/#services' },
    { name: 'Ремонт сканеров', href: '/#services' },
    { name: 'Ремонт принтеров', href: '/#services' },
    { name: 'Техобслуживание', href: '/#services' },
    { name: 'Как проходит ремонт', href: '/#repair' },
  ],
  company: [
    { name: 'О компании', href: '/about' },
    { name: 'Каталог товаров', href: '/catalog' },
    { name: 'Инлокер', href: '/inlocker' },
    { name: 'Сертификаты', href: '/about#certs' },
    { name: 'Контакты', href: '/contacts' },
  ],
}

export function Footer() {
  const tel = SITE_CONFIG.phone.replace(/[^+\d]/g, '')

  return (
    <footer className="bg-[#060a14] text-white font-[family-name:var(--font-onest)]">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-14 md:px-12 lg:pl-24">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="mb-5 flex items-center gap-3">
              <img src="/images/brands/logo.png" alt="" className="h-11 w-11 object-contain" />
              <span>
                <span className="block text-lg font-bold tracking-tight">{SITE_CONFIG.name}</span>
                <span className="block text-sm text-[#8e9ab6]">{SITE_CONFIG.tagline}</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[#8e9ab6]">
              Профессиональный ремонт и обслуживание оборудования для маркировки и сбора данных. Более 15 лет опыта работы с
              ведущими брендами.
            </p>
          </div>

          <nav aria-label="Услуги" className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#8e9ab6]">Услуги</h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-[#c9d3ee] transition-colors hover:text-[#cbf23d]">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Компания" className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#8e9ab6]">Компания</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-[#c9d3ee] transition-colors hover:text-[#cbf23d]">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#8e9ab6]">Контакты</h3>
            <a href={`tel:${tel}`} className="block text-2xl font-bold tracking-tight hover:text-[#cbf23d]">
              {SITE_CONFIG.phone}
            </a>
            <a href={`mailto:${SITE_CONFIG.email}`} className="mt-1 block text-[#c9d3ee] hover:text-[#cbf23d]">
              {SITE_CONFIG.email}
            </a>
            <p className="mt-4 text-sm leading-relaxed text-[#8e9ab6]">
              {SITE_CONFIG.address}
              <br />
              {SITE_CONFIG.workingHours}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-[#8e9ab6] md:flex-row md:items-center md:justify-between">
          <div>
            © 2010–{new Date().getFullYear()} {SITE_CONFIG.name}. Все права защищены.
          </div>
          <Link href="/privacy" className="transition-colors hover:text-white">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  )
}
