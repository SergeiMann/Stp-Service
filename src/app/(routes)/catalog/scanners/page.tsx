import { Metadata } from 'next'
import { generateSEO } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Сканеры штрих-кода',
    description: 'Профессиональные сканеры штрих-кода для торговли и склада. Ручные, стационарные, беспроводные сканеры ведущих производителей.',
  })
}

export default function ScannersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-orange-400/40 rounded-lg transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border border-red-400/40 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-orange-100 text-sm font-medium border border-orange-300/30 mb-6">
                Популярная категория
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Сканеры штрих кода
              </h1>
              <p className="text-xl text-orange-100 mb-8 leading-relaxed">
                Высокоточные сканеры для быстрого и надежного считывания штрих-кодов 
                в торговле, на складе и в производстве.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
                  Получить консультацию
                </Button>
                <Link href="/contacts">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    Связаться с нами
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="/images/equipment/zebra_ds2208-hc.png" 
                alt="Сканер штрих-кода"
                className="max-w-sm w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Типы сканеров штрих-кода
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-hand-paper text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Ручные сканеры</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Портативные сканеры для мобильного использования. Идеальны для розничной торговли и небольших складов.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Проводные и беспроводные модели</li>
                <li>• 1D и 2D сканирование</li>
                <li>• Эргономичный дизайн</li>
                <li>• Быстрое сканирование</li>
              </ul>
              <Button variant="outline" className="w-full">Подробнее</Button>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-desktop text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Стационарные сканеры</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Встраиваемые и настольные сканеры для кассовых зон и производственных линий.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Высокая скорость сканирования</li>
                <li>• Автоматическое срабатывание</li>
                <li>• Компактный размер</li>
                <li>• Надежная конструкция</li>
              </ul>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Популярный выбор</Button>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-industry text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Промышленные сканеры</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Защищенные сканеры для работы в сложных условиях производства и логистики.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• IP65/IP67 защита</li>
                <li>• Ударопрочный корпус</li>
                <li>• Работа при экстремальных температурах</li>
                <li>• Дальнее сканирование</li>
              </ul>
              <Button variant="outline" className="w-full">Подробнее</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Технические возможности
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-qrcode text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-800">1D/2D коды</h3>
              <p className="text-slate-600 text-sm">Сканирование всех типов штрих-кодов и QR-кодов</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-tachometer-alt text-2xl text-green-600"></i>
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-800">Высокая скорость</h3>
              <p className="text-slate-600 text-sm">До 1000 сканирований в секунду</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-eye text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-800">Точность</h3>
              <p className="text-slate-600 text-sm">99.9% точность распознавания</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-plug text-2xl text-orange-600"></i>
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-800">Подключение</h3>
              <p className="text-slate-600 text-sm">USB, RS232, Bluetooth, Wi-Fi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Ведущие производители
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            <div className="flex justify-center">
              <img src="/images/brands/Zebra_id1_bzK6E2_1.svg" alt="Zebra" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center">
              <img src="/images/brands/honeywell-logo.svg" alt="Honeywell" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center">
              <img src="/images/brands/datalogic.svg" alt="Datalogic" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center">
              <img src="/images/brands/cipherlab.svg" alt="CipherLab" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center">
              <img src="/images/brands/newland.svg" alt="Newland" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center">
              <img src="/images/brands/sunlux.svg" alt="Sunlux" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Подберем оптимальный сканер для ваших задач
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Бесплатная консультация и тестирование оборудования
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
              Получить консультацию
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Заказать тест-драйв
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
