import { Metadata } from 'next'
import { generateSEO } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Терминалы сбора данных (ТСД)',
    description: 'Профессиональные терминалы сбора данных для автоматизации складских процессов. Новые и восстановленные ТСД с гарантией.',
  })
}

export default function TSDPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400/40 rounded-lg transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border border-purple-400/40 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Терминалы сбора данных
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Мобильные компьютеры для эффективной автоматизации складских процессов, 
                инвентаризации и управления товарными потоками.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
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
                src="/images/equipment/zebra_mc3300ax.png" 
                alt="Терминал сбора данных"
                className="max-w-sm w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Преимущества наших ТСД
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-wifi text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Беспроводная связь</h3>
              <p className="text-slate-600">Wi-Fi, Bluetooth, 4G/5G подключение для работы в любых условиях</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Защищенный корпус</h3>
              <p className="text-slate-600">IP65/IP67 защита от пыли и влаги, ударопрочный дизайн</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-battery-full text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Длительная работа</h3>
              <p className="text-slate-600">До 12 часов автономной работы на одном заряде</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-barcode text-2xl text-orange-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Сканирование</h3>
              <p className="text-slate-600">1D/2D сканеры высокого разрешения для любых штрих-кодов</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-mobile-alt text-2xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Android OS</h3>
              <p className="text-slate-600">Современная операционная система с поддержкой приложений</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-cogs text-2xl text-indigo-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Интеграция</h3>
              <p className="text-slate-600">Легкая интеграция с WMS, ERP и другими системами</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Работаем с ведущими брендами
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
              <img src="/images/brands/urovo.svg" alt="Urovo" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center">
              <img src="/images/brands/m3mobile.svg" alt="M3 Mobile" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center">
              <img src="/images/brands/newland.svg" alt="Newland" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Нужна консультация по выбору ТСД?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Наши специалисты помогут подобрать оптимальное решение для ваших задач
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            Получить консультацию
          </Button>
        </div>
      </section>
    </div>
  )
}
