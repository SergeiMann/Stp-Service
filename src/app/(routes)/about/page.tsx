import { Metadata } from 'next'
import { generateSEO } from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/constants'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'О компании',
    description: 'STP-Service - профессиональная компания по ремонту и продаже торгового оборудования.',
  })
}

export default function AboutPage() {
  return (
    <PageLayout
      title="О компании СТП-Сервис"
      subtitle="Мы специализируемся на профессиональном ремонте и продаже торгового оборудования с 2010 года"
      badge="Профессиональный сервис"
      backgroundImage="/images/equipment/Datalogic-Memor-11-Review-featured-image.png"
    >
      <div className="container mx-auto px-4 py-16">
        {/* Основная информация */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="text-white fade-in-left">
            <h2 className="text-3xl font-bold mb-6 text-blue-300">Наша миссия</h2>
            <div className="space-y-4 text-gray-300 text-lg">
              <p>
                Обеспечить бесперебойную работу торгового оборудования наших клиентов 
                через качественный сервис, профессиональный ремонт и надежные решения.
              </p>
              <p>
                Мы понимаем, что каждая минута простоя оборудования — это потерянная прибыль, 
                поэтому работаем быстро, качественно и с полной ответственностью.
              </p>
            </div>
          </div>

          <div className="fade-in-right">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">Ключевые цифры</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
                  <div className="text-gray-300 text-sm">лет опыта</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">5000+</div>
                  <div className="text-gray-300 text-sm">отремонтированных устройств</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">98%</div>
                  <div className="text-gray-300 text-sm">успешных ремонтов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">24ч</div>
                  <div className="text-gray-300 text-sm">средний срок ремонта</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Преимущества */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Почему выбирают нас</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'fas fa-tools',
                title: 'Профессиональный ремонт',
                description: 'Сертифицированные специалисты с многолетним опытом работы с торговым оборудованием'
              },
              {
                icon: 'fas fa-clock',
                title: 'Быстрые сроки',
                description: 'Большинство ремонтов выполняем в течение 24 часов благодаря наличию запчастей на складе'
              },
              {
                icon: 'fas fa-shield-alt',
                title: 'Гарантия качества',
                description: 'Предоставляем гарантию на все виды работ и используемые запчасти'
              },
              {
                icon: 'fas fa-handshake',
                title: 'Индивидуальный подход',
                description: 'Разрабатываем персональные решения для каждого клиента и типа оборудования'
              },
              {
                icon: 'fas fa-warehouse',
                title: 'Собственный склад',
                description: 'Большой ассортимент оригинальных запчастей всегда в наличии'
              },
              {
                icon: 'fas fa-phone-alt',
                title: 'Техподдержка 24/7',
                description: 'Круглосуточная консультационная поддержка по всем техническим вопросам'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <i className={`${item.icon} text-white text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Сертификации и партнерства */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Сертификации и партнерства</h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-blue-300 mb-4">Авторизованный сервис</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Zebra Technologies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Datalogic</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Honeywell</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>TSC Printers</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-300 mb-4">Сертификаты качества</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>ISO 9001:2015</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Сертификат соответствия ГОСТ</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Лицензия на ремонт оборудования</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA секция */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 backdrop-blur-sm rounded-xl p-8 border border-blue-400/30">
            <h2 className="text-3xl font-bold text-white mb-4">Готовы начать сотрудничество?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Свяжитесь с нами для обсуждения ваших потребностей
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacts">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Связаться с нами
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                  Посмотреть услуги
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}