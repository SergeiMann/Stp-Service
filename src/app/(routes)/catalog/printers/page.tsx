import { Metadata } from 'next'
import { generateSEO } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Принтеры этикеток',
    description: 'Термо- и термотрансферные принтеры этикеток для склада и производства. Настольные и промышленные модели ведущих брендов.',
  })
}

export default function PrintersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400/40 rounded-lg transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border border-purple-400/40 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Принтеры этикеток
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Профессиональные термо- и термотрансферные принтеры для печати этикеток, 
                бирок и маркировочных материалов высокого качества.
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
                src="/images/equipment/Zebra_ZD421C_Ribbon_Cartridge_Desktop_Barcode_Label_Printer_Right_Printing__81871.1754573824.png" 
                alt="Принтер этикеток"
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
            Типы принтеров этикеток
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-desktop text-2xl text-white"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">Настольные принтеры</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Компактные принтеры для офиса и небольших объемов печати. 
                    Идеальны для розничной торговли и малого бизнеса.
                  </p>
                  <ul className="text-sm text-slate-600 space-y-2 mb-6">
                    <li>• Ширина печати до 108 мм</li>
                    <li>• Скорость до 152 мм/сек</li>
                    <li>• USB, Ethernet, Wi-Fi</li>
                    <li>• Простота использования</li>
                    <li>• Доступная цена</li>
                  </ul>
                  <Button variant="outline" className="w-full">Подробнее</Button>
                </div>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-industry text-2xl text-white"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">Промышленные принтеры</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Мощные принтеры для больших объемов печати в производственных условиях. 
                    Высокая надежность и производительность.
                  </p>
                  <ul className="text-sm text-slate-600 space-y-2 mb-6">
                    <li>• Ширина печати до 170 мм</li>
                    <li>• Скорость до 356 мм/сек</li>
                    <li>• 24/7 режим работы</li>
                    <li>• Металлический корпус</li>
                    <li>• Расширенная гарантия</li>
                  </ul>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Для производства</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Технологии печати
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Термопечать (Direct Thermal)</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Печать без красящей ленты на термочувствительных материалах. 
                Идеально для временных этикеток и документов.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Низкая стоимость печати</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Простота обслуживания</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Быстрая печать</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Экологичность</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Термотрансферная печать</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Печать с использованием красящей ленты (риббона). 
                Обеспечивает долговечность и стойкость изображения.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Высокая стойкость к внешним воздействиям</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Четкость изображения</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Долгий срок хранения</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Разнообразие материалов</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Области применения
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-warehouse text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-800">Складская логистика</h3>
              <p className="text-slate-600 text-sm">Маркировка товаров, паллет, адресные этикетки</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shopping-cart text-2xl text-green-600"></i>
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-800">Розничная торговля</h3>
              <p className="text-slate-600 text-sm">Ценники, промо-этикетки, штрих-коды товаров</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-cogs text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-800">Производство</h3>
              <p className="text-slate-600 text-sm">Маркировка продукции, контроль качества</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-truck text-2xl text-orange-600"></i>
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-800">Транспорт и логистика</h3>
              <p className="text-slate-600 text-sm">Транспортные этикетки, накладные</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Ведущие производители
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            <div className="flex justify-center">
              <img src="/images/brands/Zebra_id1_bzK6E2_1.svg" alt="Zebra" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center">
              <img src="/images/brands/tsc.svg" alt="TSC" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center">
              <img src="/images/brands/godex.svg" alt="Godex" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center">
              <img src="/images/brands/bixolon_logo.svg" alt="Bixolon" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center">
              <img src="/images/brands/sato.svg" alt="SATO" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center">
              <img src="/images/brands/honeywell-logo.svg" alt="Honeywell" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Нужна помощь в выборе принтера?
          </h2>
          <p className="text-xl mb-8 text-slate-300">
            Наши эксперты подберут оптимальное решение для ваших задач печати
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Получить консультацию
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Рассчитать стоимость
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
