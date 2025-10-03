import { Metadata } from 'next'
import { generateSEO } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  ...generateSEO({
    title: '3D сканеры для определения ВГХ',
    description: '3D системы измерения габаритов, веса и объема для логистических центров. Автоматизация процессов приемки и отгрузки товаров.',
  })
}

export default function ThreeDScanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-indigo-400/40 rounded-lg transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border border-purple-400/40 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                3D scan определение ВГХ
              </h1>
              <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                Автоматические системы измерения веса, габаритов и объема для 
                оптимизации логистических процессов и складского учета.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
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
                src="/images/equipment/caml-05.png" 
                alt="3D сканер"
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
            Преимущества 3D сканирования
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Быстрое измерение</h3>
              <p className="text-slate-600">Автоматическое определение ВГХ за секунды</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bullseye text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Высокая точность</h3>
              <p className="text-slate-600">Погрешность измерения менее 1%</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Экономия затрат</h3>
              <p className="text-slate-600">Снижение расходов на логистику до 30%</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-robot text-2xl text-orange-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Автоматизация</h3>
              <p className="text-slate-600">Полная автоматизация процесса измерения</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-database text-2xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Интеграция с WMS</h3>
              <p className="text-slate-600">Прямая передача данных в систему управления</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-2xl text-indigo-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Надежность</h3>
              <p className="text-slate-600">Работа 24/7 в любых условиях</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Области применения
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Складская логистика</h3>
              <ul className="space-y-4 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Автоматическое определение габаритов поступающих товаров</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Оптимизация размещения товаров на складе</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Контроль соответствия заявленных и фактических размеров</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Автоматическое обновление данных в WMS</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Транспортная логистика</h3>
              <ul className="space-y-4 text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Расчет стоимости доставки по фактическим габаритам</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Оптимизация загрузки транспортных средств</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Контроль веса для соблюдения норм перевозки</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Автоматическое формирование документов</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-800">
            Технические характеристики
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">±1мм</div>
              <div className="text-slate-600">Точность измерения габаритов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">±5г</div>
              <div className="text-slate-600">Точность измерения веса</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">&lt;3сек</div>
              <div className="text-slate-600">Время измерения</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-slate-600">Режим работы</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Автоматизируйте измерение ВГХ уже сегодня
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Получите расчет ROI и техническое предложение для вашего склада
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
              Рассчитать эффект
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Заказать демонстрацию
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
