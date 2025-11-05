import { Metadata } from 'next'
import { generateSEO } from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/constants'
import { ContactForm } from '@/components/forms/ContactForm'
import { PageLayout } from '@/components/layout/PageLayout'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Контакты',
    description: `Контакты ${SITE_CONFIG.name}. Телефон: ${SITE_CONFIG.phone}, email: ${SITE_CONFIG.email}`,
  })
}

export default function ContactsPage() {
  return (
    <PageLayout
      title="Контакты"
      subtitle="Свяжитесь с нами любым удобным способом"
      badge="Связаться с нами"
      backgroundImage="/images/equipment/Cisco_Access-Point.png"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Контактная информация */}
          <div className="text-white fade-in-left">
            <h2 className="text-3xl font-bold mb-8 text-blue-300">Как с нами связаться</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-phone text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-white">Телефон</h3>
                    <p className="text-gray-300 mb-3">Звоните в рабочее время</p>
                    <a href={`tel:${SITE_CONFIG.phone}`} className="text-blue-300 hover:text-blue-200 font-medium text-lg transition-colors">
                      {SITE_CONFIG.phone}
                    </a>
                    <div className="text-sm text-gray-400 mt-1">пн-пт 10:00-19:00</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-envelope text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-white">Email</h3>
                    <p className="text-gray-300 mb-3">Отвечаем в течение часа</p>
                    <a href={`mailto:${SITE_CONFIG.email}`} className="text-green-300 hover:text-green-200 font-medium transition-colors">
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-map-marker-alt text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-white">Адрес</h3>
                    <p className="text-gray-300 mb-3">Приезжайте к нам в офис</p>
                    <div className="text-purple-300">
                      {SITE_CONFIG.address}
                    </div>
                    <div className="text-sm text-gray-400 mt-2">сб, вс — выходной день</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-comments text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-white">Мессенджеры</h3>
                    <p className="text-gray-300 mb-3">Пишите в удобное время</p>
                    <div className="flex space-x-4">
                      <a href="https://t.me/stp_sc_bot" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-200 transition-colors">
                        <i className="fab fa-telegram text-2xl"></i>
                      </a>
                      <a href="#" className="text-yellow-300 hover:text-yellow-200 transition-colors">
                        <i className="fab fa-whatsapp text-2xl"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div className="fade-in-right h-full">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 h-full flex flex-col">
              <h2 className="text-3xl font-bold mb-6 text-white">Отправить сообщение</h2>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Наши соцсети */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Наши соцсети</h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-sky-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-sky-400/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 border border-sky-300/30">
                  <i className="fab fa-telegram text-sky-300 text-2xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Телеграм‑канал «Катрич и Склад»</h3>
                  <p className="text-gray-200/90">
                    Живое сообщество про ремонт ТСД и складскую технику: реальные кейсы, советы без воды,
                    дружелюбная атмосфера. Заходите — будем рады!
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="https://t.me/sklad_remont_tsd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-6 py-3 text-base bg-blue-600 text-white hover:bg-blue-700 w-full"
                  >
                    Открыть в Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Дополнительная информация */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Почему стоит обратиться к нам</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'fas fa-clock',
                title: 'Быстрый ответ',
                description: 'Отвечаем на звонки и сообщения в течение 15 минут в рабочее время'
              },
              {
                icon: 'fas fa-user-tie',
                title: 'Персональный менеджер',
                description: 'За каждым клиентом закрепляется персональный менеджер'
              },
              {
                icon: 'fas fa-handshake',
                title: 'Индивидуальный подход',
                description: 'Разрабатываем решения под конкретные потребности вашего бизнеса'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${item.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Часто задаваемые вопросы */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Часто задаваемые вопросы</h2>
          <div className="space-y-4">
            {[
              {
                question: 'Сколько времени занимает ремонт?',
                answer: 'Большинство ремонтов выполняем в течение 24-48 часов. Сложные случаи могут занять до 5 рабочих дней.'
              },
              {
                question: 'Предоставляете ли вы гарантию на ремонт?',
                answer: 'Да, мы предоставляем гарантию от 3 до 12 месяцев в зависимости от типа выполненных работ.'
              },
              {
                question: 'Можно ли получить консультацию по телефону?',
                answer: 'Конечно! Наши специалисты готовы проконсультировать вас по любым техническим вопросам.'
              },
              {
                question: 'Работаете ли вы с юридическими лицами?',
                answer: 'Да, мы работаем как с физическими, так и с юридическими лицами. Предоставляем все необходимые документы.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-3">{item.question}</h3>
                <p className="text-gray-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA секция */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 backdrop-blur-sm rounded-xl p-8 border border-blue-400/30">
            <h2 className="text-3xl font-bold text-white mb-4">Готовы решить вашу проблему?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Свяжитесь с нами прямо сейчас для получения консультации
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`mailto:${SITE_CONFIG.email}`} className="border-2 border-white text-white hover:bg-white hover:text-slate-700 px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
                Написать email
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}