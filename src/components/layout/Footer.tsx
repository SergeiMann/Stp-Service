import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants'

const footerLinks = {
  services: [
    { name: 'Ремонт сканеров', href: '/services#scanners' },
    { name: 'Ремонт принтеров', href: '/services#printers' },
    { name: 'Ремонт ТСД', href: '/services#terminals' },
    { name: 'Техобслуживание', href: '/services#maintenance' },
  ],
  company: [
    { name: 'О компании', href: '/about' },
    { name: 'Наши услуги', href: '/services' },
    { name: 'Каталог товаров', href: '/catalog' },
    { name: 'Контакты', href: '/contacts' },
  ],
  support: [
    { name: 'Гарантия', href: '/services#warranty' },
    { name: 'Доставка', href: '/services#delivery' },
    { name: 'Оплата', href: '/services#payment' },
    { name: 'Возврат', href: '/services#return' },
  ]
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src="/images/brands/logo.svg" 
                  alt={SITE_CONFIG.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-lg">{SITE_CONFIG.name}</div>
                <div className="text-sm text-gray-400">{SITE_CONFIG.tagline}</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Профессиональный ремонт и обслуживание торгового оборудования. 
              Более 15 лет опыта работы с ведущими брендами.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-telegram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-vk text-xl"></i>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Услуги</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Компания</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Контакты</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <i className="fas fa-phone text-blue-400"></i>
                <span className="text-gray-400">{SITE_CONFIG.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-envelope text-blue-400"></i>
                <span className="text-gray-400">{SITE_CONFIG.email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fas fa-map-marker-alt text-blue-400 mt-1"></i>
                <span className="text-gray-400">{SITE_CONFIG.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-clock text-blue-400"></i>
                <span className="text-gray-400">Ежедневно 9:00-21:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
           © {new Date().getFullYear()} {SITE_CONFIG.name}. Все права защищены.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
