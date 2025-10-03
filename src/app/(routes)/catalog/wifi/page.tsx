import { Metadata } from 'next'
import { generateSEO } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Wi-Fi оборудование для склада',
    description: 'Промышленное Wi-Fi оборудование для складов и производства. Точки доступа, контроллеры, антенны для надежной беспроводной связи.',
  })
}

export default function WiFiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-cyan-400/40 rounded-lg transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border border-blue-400/40 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Wi-Fi оборудование
              </h1>
              <p className="text-xl text-cyan-100 mb-8 leading-relaxed">
                Промышленные беспроводные сети для складов, производства и логистических центров. 
                Надежная связь для мобильных устройств и автоматизации.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-cyan-600 hover:bg-cyan-50">
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
                src="/images/equipment/Cisco_Access-Point.png" 
                alt="Wi-Fi оборудование"
                className="max-w-sm w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Решения для различных задач
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-warehouse text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Складские сети</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Покрытие больших складских помещений с высокими стеллажами и металлическими конструкциями.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Промышленные точки доступа</li>
                <li>• Направленные антенны</li>
                <li>• Контроллеры Wi-Fi</li>
                <li>• Система мониторинга</li>
              </ul>
              <Button variant="outline" className="w-full">Подробнее</Button>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-white">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-industry text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Производственные сети</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Надежная связь в условиях электромагнитных помех и агрессивной среды производства.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Защищенное оборудование IP67</li>
                <li>• Помехоустойчивость</li>
                <li>• Высокая температурная стойкость</li>
                <li>• Резервирование каналов</li>
              </ul>
              <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">Для производства</Button>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-truck text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Логистические центры</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Бесшовное покрытие для мобильных терминалов и автоматизированных систем.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Mesh-сети</li>
                <li>• Роуминг без разрывов</li>
                <li>• Высокая плотность устройств</li>
                <li>• Приоритизация трафика</li>
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
            Ключевые особенности
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-signal text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-800">Высокая мощность</h3>
              <p className="text-slate-600 text-sm">До 1000 мВт для максимального покрытия</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-2xl text-green-600"></i>
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-800">Множество устройств</h3>
              <p className="text-slate-600 text-sm">До 500 одновременных подключений</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-800">Безопасность</h3>
              <p className="text-slate-600 text-sm">WPA3, 802.1X, VPN поддержка</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-2xl text-orange-600"></i>
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-800">Мониторинг</h3>
              <p className="text-slate-600 text-sm">Централизованное управление и контроль</p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Типы оборудования
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Точки доступа</h3>
              <div className="space-y-4">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-wifi text-blue-600"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Внутренние точки доступа</h4>
                      <p className="text-sm text-slate-600">Для установки внутри помещений</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-cloud text-green-600"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Наружные точки доступа</h4>
                      <p className="text-sm text-slate-600">Защищенные от погодных условий</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-broadcast-tower text-purple-600"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Mesh-точки</h4>
                      <p className="text-sm text-slate-600">Для создания самовосстанавливающихся сетей</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Дополнительное оборудование</h3>
              <div className="space-y-4">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-server text-orange-600"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Контроллеры Wi-Fi</h4>
                      <p className="text-sm text-slate-600">Централизованное управление сетью</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-satellite-dish text-red-600"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Антенны</h4>
                      <p className="text-sm text-slate-600">Направленные и всенаправленные</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-plug text-indigo-600"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">PoE коммутаторы</h4>
                      <p className="text-sm text-slate-600">Питание по Ethernet кабелю</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Нужна надежная Wi-Fi сеть для вашего объекта?
          </h2>
          <p className="text-xl mb-8 text-cyan-100">
            Проведем радиообследование и спроектируем оптимальное решение
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-cyan-600 hover:bg-cyan-50">
              Заказать проект
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Радиообследование
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
