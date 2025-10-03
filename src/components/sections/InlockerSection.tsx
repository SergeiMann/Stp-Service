'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function InlockerSection() {
  return (
    <section className="snap-section snap-start relative h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Левая часть - текст и статистика */}
          <div className="fade-in-left">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-green-600/20 backdrop-blur-sm rounded-full text-green-700 text-sm font-medium border border-green-400/30">
                Инновационное решение
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800">
              <span className="text-green-600">Инлокер+</span> — ремонт
              <br />
              в интеграции со
              <br />
              шкафами Инлокер
            </h2>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Инлокер+ — это услуга по ремонту сломанных устройств, 
              включающая все преимущества сервисного контракта 
              и дополнительный контроль за оборудованием.
            </p>
            
            <div className="mb-8">
              <p className="text-slate-700 font-medium mb-4">
                Шкаф Инлокер — <span className="text-green-600">возможна поставка как самих шкафов</span>, 
                так и в комплексе с решением Инлокер+. В поставку 
                входит внедрение и обучение сотрудников.
              </p>
              
              <p className="text-slate-600">
                Наша работа по обслуживанию и ремонту 
                начинается сразу, как только ваш персонал 
                положит в шкаф сломанное устройство!
              </p>
            </div>

            {/* Статистические блоки */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-500 text-white p-6 rounded-lg text-center">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-sm uppercase tracking-wide">контроль за устройствами</div>
              </div>
              
              <div className="bg-green-500 text-white p-6 rounded-lg text-center">
                <div className="text-3xl font-bold mb-2">до 20%</div>
                <div className="text-sm uppercase tracking-wide">снижение поломок устройств</div>
              </div>
              
              <div className="bg-green-500 text-white p-6 rounded-lg text-center">
                <div className="text-3xl font-bold mb-2">до 95%</div>
                <div className="text-sm uppercase tracking-wide">рабочих устройств в наличии</div>
              </div>
            </div>

            {/* Информационный блок */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Для кого?</h3>
              <p className="text-slate-600">
                Использование шкафа Инлокер актуально для компаний с парком 
                <span className="font-semibold text-green-600"> от 100 единиц оборудования</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Узнать подробнее
              </Button>
              <Link href="/services">
                <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
                  Все услуги
                </Button>
              </Link>
            </div>
          </div>

          {/* Правая часть - изображение */}
          <div className="fade-in-right relative flex items-center justify-center">
            <img 
              src="/images/equipment/trade-and-warehouse-equipment-1.webp" 
              alt="Модульная система хранения Инлокер"
              className="w-full h-auto max-w-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
