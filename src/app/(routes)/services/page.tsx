import { Metadata } from 'next'
import { generateSEO } from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/constants'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Услуги',
    description: 'Ремонт терминалов сбора данных, техническая поддержка, обслуживание торгового оборудования.',
  })
}

export default function ServicesPage() {
  const services = [
    {
      icon: 'fas fa-wrench',
      title: 'Ремонт ТСД',
      description: 'Профессиональный ремонт терминалов сбора данных всех популярных брендов',
      features: ['Диагностика', 'Замена экранов', 'Ремонт плат', 'Восстановление ПО'],
      price: 'от 2 500 ₽',
      color: 'blue'
    },
    {
      icon: 'fas fa-barcode',
      title: 'Ремонт сканеров',
      description: 'Восстановление работоспособности сканеров штрих-кодов любой сложности',
      features: ['Чистка оптики', 'Замена лазера', 'Ремонт корпуса', 'Настройка'],
      price: 'от 1 800 ₽',
      color: 'green'
    },
    {
      icon: 'fas fa-print',
      title: 'Ремонт принтеров',
      description: 'Обслуживание термо- и термотрансферных принтеров этикеток',
      features: ['Замена головки', 'Чистка механизма', 'Настройка печати', 'Профилактика'],
      price: 'от 3 200 ₽',
      color: 'purple'
    },
    {
      icon: 'fas fa-tablet-alt',
      title: 'Ремонт планшетов',
      description: 'Восстановление защищенных планшетов для промышленного использования',
      features: ['Замена дисплеев', 'Ремонт разъемов', 'Восстановление корпуса', 'Обновление ПО'],
      price: 'от 4 500 ₽',
      color: 'yellow'
    },
    {
      icon: 'fas fa-tools',
      title: 'Техническое обслуживание',
      description: 'Регулярное профилактическое обслуживание торгового оборудования',
      features: ['Плановая диагностика', 'Чистка и смазка', 'Обновление ПО', 'Калибровка'],
      price: 'от 1 200 ₽',
      color: 'indigo'
    },
    {
      icon: 'fas fa-headset',
      title: 'Техническая поддержка',
      description: 'Консультации и удаленная помощь по настройке оборудования',
      features: ['Консультации 24/7', 'Удаленная диагностика', 'Настройка ПО', 'Обучение персонала'],
      price: 'от 800 ₽/час',
      color: 'red'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-600/20 to-blue-800/20 border-blue-400/30 text-blue-300',
      green: 'from-green-600/20 to-green-800/20 border-green-400/30 text-green-300',
      purple: 'from-purple-600/20 to-purple-800/20 border-purple-400/30 text-purple-300',
      yellow: 'from-yellow-600/20 to-yellow-800/20 border-yellow-400/30 text-yellow-300',
      indigo: 'from-indigo-600/20 to-indigo-800/20 border-indigo-400/30 text-indigo-300',
      red: 'from-red-600/20 to-red-800/20 border-red-400/30 text-red-300'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <PageLayout
      title="Наши услуги"
      subtitle="Профессиональное обслуживание и ремонт торгового оборудования с гарантией качества"
      badge="Сервисный центр"
      backgroundImage="/images/equipment/zebra_mc3300ax.png"
    >
      <div className="container mx-auto px-4 py-16">
        {/* Основные услуги */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className={`bg-gradient-to-br ${getColorClasses(service.color)} backdrop-blur-sm rounded-xl p-6 border hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <i className={`${service.icon} text-white text-xl`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{service.title}</h3>
                  <div className={`text-sm font-semibold ${service.color === 'yellow' ? 'text-yellow-200' : `text-${service.color}-200`}`}>
                    {service.price}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{service.description}</p>
              
              <div className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Процесс работы */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Как мы работаем</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Диагностика',
                description: 'Бесплатная диагностика оборудования и оценка стоимости ремонта'
              },
              {
                step: '02',
                title: 'Согласование',
                description: 'Согласование стоимости работ и сроков выполнения с клиентом'
              },
              {
                step: '03',
                title: 'Ремонт',
                description: 'Выполнение ремонтных работ с использованием оригинальных запчастей'
              },
              {
                step: '04',
                title: 'Тестирование',
                description: 'Полное тестирование устройства и предоставление гарантии'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Гарантии */}
        <div className="mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-center text-white mb-8">Наши гарантии</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-shield-alt text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Гарантия качества</h3>
                <p className="text-gray-300">До 12 месяцев гарантии на выполненные работы и установленные запчасти</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-clock text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Быстрые сроки</h3>
                <p className="text-gray-300">Большинство ремонтов выполняем в течение 24-48 часов</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-undo text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Возврат средств</h3>
                <p className="text-gray-300">Если ремонт невозможен — возвращаем 100% предоплаты</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA секция */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-8 border border-blue-400/30">
            <h2 className="text-3xl font-bold text-white mb-4">Нужна помощь с оборудованием?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Свяжитесь с нами для получения профессиональной консультации
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${SITE_CONFIG.phone}`}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Позвонить: {SITE_CONFIG.phone}
                </Button>
              </a>
              <Link href="/contacts">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                  Заказать звонок
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}