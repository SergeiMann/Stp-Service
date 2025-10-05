import { SITE_CONFIG } from '@/lib/constants'
import { generateSEO } from '@/lib/utils'
import { Metadata } from 'next'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { EquipmentCategories } from '@/components/catalog/EquipmentCategories'
import Link from 'next/link'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Главная',
    description: 'Профессиональный ремонт и обслуживание торгового оборудования. Быстро, качественно, с гарантией. Ремонт терминалов, сканеров штрих-кодов, принтеров этикеток.',
  })
}

export const revalidate = 60

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Zebra Scanners Background */}
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/zebra-ds8178-vs-zebra-ds2208-2.png')`
            }}
          >
            {/* Multi-layer overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/85 to-slate-900/95"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/90"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-800/70"></div>
            
            {/* Tech Pattern Overlay */}
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400/40 rounded-lg transform rotate-12 animate-pulse"></div>
              <div className="absolute top-40 right-32 w-24 h-24 border border-blue-400/30 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-32 left-32 w-40 h-40 border border-blue-400/35 rounded-lg transform -rotate-6 animate-pulse delay-700"></div>
              <div className="absolute bottom-20 right-20 w-28 h-28 border border-blue-400/40 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-blue-400/30 rounded-lg transform rotate-45 animate-pulse delay-500"></div>
              <div className="absolute top-1/3 right-1/4 w-20 h-20 border border-blue-400/35 rounded-full animate-pulse delay-200"></div>
              
              {/* Additional floating elements */}
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-blue-400/60 rounded-full animate-pulse delay-800"></div>
              <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-green-400/60 rounded-full animate-pulse delay-400"></div>
              <div className="absolute top-3/4 left-1/5 w-2 h-2 bg-yellow-400/60 rounded-full animate-pulse delay-600"></div>
              <div className="absolute top-1/5 right-1/5 w-5 h-5 bg-purple-400/60 rounded-full animate-pulse delay-900"></div>
            </div>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 animate-pulse"></div>
          </div>
        </div>

        {/* Header */}
        <div className="relative z-30 container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <Image 
                  src="/images/brands/logo.svg" 
                  alt="СТП-Сервис"
                  fill
                  className="object-contain"
                  sizes="40px"
                  priority
                />
              </div>
              <div>
                <div className="font-bold text-xl text-white">СТП-Сервис</div>
                <div className="text-sm text-gray-300">Ремонт торгового оборудования</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium text-white hover:text-blue-300 transition-colors">
                Главная
              </Link>
              <Link href="/catalog" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Каталог
              </Link>
              <Link href="/services" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Услуги
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                О компании
              </Link>
              <Link href="/contacts" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Контакты
              </Link>
            </nav>

            {/* Contact Info */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-right">
                <div className="font-semibold text-white">+7 (495) 255-08-54</div>
                <div className="text-sm text-gray-300">Ежедневно 9:00-21:00</div>
              </div>
              
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Администратор
              </Button>
            </div>

            {/* Mobile menu button */}
            <button className="lg:hidden p-2 rounded-md text-white hover:text-blue-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-20 container mx-auto px-4 flex-1 flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="text-white fade-in-left">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-600/20 backdrop-blur-sm rounded-full text-blue-300 text-sm font-medium border border-blue-400/30">
                  Профессиональный сервис
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Быстро и профессионально
                <span className="block text-blue-400">ремонтируем</span>
              </h1>
              <div className="text-lg md:text-xl mb-8 text-gray-300 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>терминалы сбора данных (ТСД)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>сканеры штрих-кодов</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>термо- и термотрансферные принтеры этикеток</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>защищенные планшеты</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Оставить заявку
                </Button>
                <Link href="/catalog">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                    Каталог товаров
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right side - empty space to let background show through */}
            <div className="hidden lg:block fade-in-right">
              {/* This space is intentionally left empty to showcase the background image */}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center text-white/60">
            <span className="text-sm mb-2">Прокрутите вниз</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Categories Section */}
      <EquipmentCategories />

      {/* Инлокер+ Section - Сжатая структура */}
      <section className="relative bg-slate-800 py-16">
        <div className="container mx-auto px-6">
          
          {/* Заголовочная секция */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-2 bg-green-500/20 rounded-full text-green-400 text-sm font-medium border border-green-500/30 mb-4">
              Инновационное решение
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              <span className="text-green-400">Инлокер+</span><br/>
              ремонт в интеграции<br/>
              со шкафами Инлокер
            </h2>
          </div>

          {/* Основной контент */}
          <div className="grid lg:grid-cols-4 gap-6 items-start">
            
            {/* Левая колонка - Описание */}
            <div className="lg:col-span-1 space-y-5">
              <div className="space-y-4 text-base text-gray-300">
                <p className="leading-relaxed">
                  Инлокер+ — это услуга по ремонту сломанных устройств, 
                  включающая все преимущества сервисного контракта 
                  и дополнительный контроль за оборудованием.
                </p>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-bold text-lg mb-2">Шкаф Инлокер</h3>
                  <p className="text-gray-300 mb-3 text-sm">
                    Возможна поставка как самих шкафов, так и в комплексе с решением Инлокер+.
                  </p>
                  <p className="text-green-400 text-xs font-medium">
                    В поставку входит внедрение и обучение сотрудников
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl p-4 border border-green-500/20">
                  <p className="text-white font-medium text-sm">
                    Наша работа по обслуживанию и ремонту начинается сразу, 
                    как только ваш персонал положит в шкаф сломанное устройство!
                  </p>
                </div>
              </div>
            </div>

            {/* Центральная колонка - Изображение (занимает 2 колонки) */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative w-full max-w-xl">
                <Image 
                  src="/images/equipment/product_16779-no-bg-preview (carve.photos).png" 
                  alt="Шкаф Инлокер - автоматизированная система хранения оборудования"
                  width={800}
                  height={800}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  priority={false}
                />
              </div>
            </div>

            {/* Правая колонка - Статистика и кнопки */}
            <div className="lg:col-span-1 space-y-5">
              {/* Статистические блоки */}
              <div className="space-y-3">
                <div className="bg-green-500 text-white rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold mb-1">100%</div>
                  <div className="text-xs uppercase tracking-wider">контроль за устройствами</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500 text-white rounded-lg p-3 text-center">
                    <div className="text-xl font-bold mb-1">до 20%</div>
                    <div className="text-xs uppercase">снижение поломок</div>
                  </div>
                  <div className="bg-green-500 text-white rounded-lg p-3 text-center">
                    <div className="text-xl font-bold mb-1">до 95%</div>
                    <div className="text-xs uppercase">рабочих устройств</div>
                  </div>
                </div>
              </div>

              {/* Информация для кого */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-green-400 text-lg font-bold mb-2">Для кого?</h4>
                <p className="text-gray-300 text-sm">
                  Использование шкафа Инлокер актуально для компаний с парком 
                  <span className="text-white font-semibold"> от 100 единиц оборудования</span>
                </p>
              </div>

              {/* Кнопки действий */}
              <div className="space-y-3">
                <Button size="md" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-sm font-semibold">
                  Узнать больше об Инлокер+
                </Button>
                <Button variant="outline" size="md" className="w-full border-white/30 text-white hover:bg-white/10 py-3 text-sm">
                  Заказать консультацию
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Content after sections - сжатая область */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-600">
        {/* Spacer to create smooth transition */}
        <div className="h-8"></div>
        
        {/* Additional content area that leads to footer */}
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-white">
            <h3 className="text-xl font-bold mb-3">Готовы начать работу?</h3>
            <p className="text-slate-300 mb-6 text-sm">Свяжитесь с нами для получения консультации</p>
            <div className="flex justify-center gap-3">
              <a href="tel:+74952550854" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors text-sm">
                Позвонить
              </a>
              <a href="/contacts" className="bg-transparent border border-white text-white hover:bg-white hover:text-slate-700 px-5 py-2 rounded-lg transition-colors text-sm">
                Контакты
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  )
}