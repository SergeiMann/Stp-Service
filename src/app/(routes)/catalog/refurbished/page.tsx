import { Metadata } from 'next'
import { generateSEO } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Восстановленные ТСД',
    description: 'Восстановленные терминалы сбора данных с гарантией. Проверенное оборудование по доступным ценам для автоматизации склада.',
  })
}

export default function RefurbishedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-emerald-400/40 rounded-lg transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border border-teal-400/40 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-emerald-100 text-sm font-medium border border-emerald-300/30 mb-6">
                Экономичное решение
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Восстановленные ТСД
              </h1>
              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                Профессионально восстановленные терминалы сбора данных с полной гарантией. 
                Качество нового оборудования по доступной цене.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                  Посмотреть каталог
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
                src="/images/equipment/Datalogic-Memor-11-Review-featured-image.png" 
                alt="Восстановленный ТСД"
                className="max-w-sm w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Преимущества восстановленного оборудования
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-dollar-sign text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Экономия до 50%</h3>
              <p className="text-slate-600">Значительная экономия по сравнению с новым оборудованием</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Полная гарантия</h3>
              <p className="text-slate-600">Гарантия качества на все восстановленное оборудование</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-tools text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Профессиональное восстановление</h3>
              <p className="text-slate-600">Полная диагностика и замена изношенных компонентов</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-2xl text-orange-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Быстрая поставка</h3>
              <p className="text-slate-600">Наличие на складе, быстрая отгрузка</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-recycle text-2xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Экологичность</h3>
              <p className="text-slate-600">Вторичное использование оборудования</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-handshake text-2xl text-indigo-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Trade-in программа</h3>
              <p className="text-slate-600">Принимаем старое оборудование в зачет</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Процесс восстановления
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-800">Диагностика</h3>
              <p className="text-slate-600 text-sm">Полная проверка всех компонентов и функций устройства</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-800">Ремонт</h3>
              <p className="text-slate-600 text-sm">Замена изношенных деталей оригинальными запчастями</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-800">Тестирование</h3>
              <p className="text-slate-600 text-sm">Комплексное тестирование всех функций и систем</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-800">Сертификация</h3>
              <p className="text-slate-600 text-sm">Выдача сертификата качества и гарантийных документов</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Доступные категории
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-mobile-alt text-3xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Мобильные ТСД</h3>
              </div>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Zebra MC3300, MC9300</li>
                <li>• Honeywell CK65, CN80</li>
                <li>• Datalogic Memor, Skorpio</li>
                <li>• Urovo DT40, RT40</li>
              </ul>
              <Button variant="outline" className="w-full">Посмотреть модели</Button>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-tablet text-3xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Планшеты</h3>
              </div>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Zebra ET50, ET55</li>
                <li>• Honeywell RT10</li>
                <li>• Panasonic Toughpad</li>
                <li>• Getac T800</li>
              </ul>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Популярные модели</Button>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-barcode text-3xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Сканеры</h3>
              </div>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Zebra DS3600, DS8100</li>
                <li>• Honeywell 1900, 1400</li>
                <li>• Datalogic Gryphon</li>
                <li>• Newland HR32</li>
              </ul>
              <Button variant="outline" className="w-full">Посмотреть модели</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Warranty Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-slate-800">
              Гарантийные обязательства
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">6 мес</div>
                <div className="text-slate-600">Стандартная гарантия</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">12 мес</div>
                <div className="text-slate-600">Расширенная гарантия</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">30 дней</div>
                <div className="text-slate-600">Возврат без объяснений</div>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Мы настолько уверены в качестве нашего восстановленного оборудования, 
              что предоставляем полную гарантию и возможность возврата в течение 30 дней 
              без объяснения причин.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Готовы сэкономить на оборудовании?
          </h2>
          <p className="text-xl mb-8 text-emerald-100">
            Получите персональное предложение на восстановленное оборудование
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
              Получить предложение
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Trade-in оценка
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}