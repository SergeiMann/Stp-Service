import { Metadata } from 'next'
import { CSSProperties } from 'react'
import { generateSEO } from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/constants'
import { ContactForm } from '@/components/forms/ContactForm'
import { PageLayout, PagePanel } from '@/components/layout/PageLayout'
import { Tilt } from '@/components/motion/Tilt'
import { LiveClock } from '@/components/motion/LiveClock'

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Контакты',
    description: `Контакты ${SITE_CONFIG.name}. Телефон: ${SITE_CONFIG.phone}, email: ${SITE_CONFIG.email}`,
  })
}

const reasons = [
  {
    icon: 'fas fa-clock',
    title: 'Быстрый ответ',
    description: 'Отвечаем на звонки и сообщения в течение 15 минут в рабочее время',
  },
  {
    icon: 'fas fa-user-tie',
    title: 'Персональный менеджер',
    description: 'За каждым клиентом закрепляется персональный менеджер',
  },
  {
    icon: 'fas fa-handshake',
    title: 'Индивидуальный подход',
    description: 'Разрабатываем решения под конкретные потребности вашего бизнеса',
  },
]

const faq = [
  {
    question: 'Сколько времени занимает ремонт?',
    answer: 'Большинство ремонтов выполняем в течение 24-48 часов. Сложные случаи могут занять до 5 рабочих дней.',
  },
  {
    question: 'Предоставляете ли вы гарантию на ремонт?',
    answer: 'Да, мы предоставляем гарантию от 3 до 12 месяцев в зависимости от типа выполненных работ.',
  },
  {
    question: 'Можно ли получить консультацию по телефону?',
    answer: 'Конечно! Наши специалисты готовы проконсультировать вас по любым техническим вопросам.',
  },
  {
    question: 'Работаете ли вы с юридическими лицами?',
    answer: 'Да, мы работаем как с физическими, так и с юридическими лицами. Предоставляем все необходимые документы.',
  },
]

function Heading({ kicker, lines }: { kicker: string; lines: string[] }) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="mx-kicker mb-5" data-reveal>
        {kicker}
      </div>
      <h2 className="mx-h2" data-reveal="lines">
        {lines.map((l, i) => (
          <span key={l} className="mx-ln" style={{ '--i': i } as CSSProperties}>
            <span>{l}</span>
          </span>
        ))}
      </h2>
    </div>
  )
}

export default function ContactsPage() {
  const tel = SITE_CONFIG.phone.replace(/[^+\d]/g, '')
  const channels = [
    {
      icon: 'fas fa-phone',
      tone: 'bg-[#3d6bff]',
      title: 'Телефон',
      note: 'Звоните в рабочее время',
      value: SITE_CONFIG.phone,
      href: `tel:${tel}`,
      extra: 'пн-пт 10:00-19:00',
    },
    {
      icon: 'fas fa-envelope',
      tone: 'bg-[#2ad67c] text-[#062414]',
      title: 'Email',
      note: 'Отвечаем в течение часа',
      value: SITE_CONFIG.email,
      href: `mailto:${SITE_CONFIG.email}`,
    },
    {
      icon: 'fas fa-map-marker-alt',
      tone: 'bg-[#7b5cff]',
      title: 'Адрес',
      note: 'Приезжайте к нам в офис',
      value: SITE_CONFIG.address,
      extra: 'сб, вс — выходной день',
    },
  ]

  return (
    <PageLayout
      title="Контакты"
      subtitle="Свяжитесь с нами любым удобным способом"
      badge="Связаться с нами"
      heroImage="/images/equipment/zebra_mc3300ax.png"
      heroChips={['Ответим за 15 минут', SITE_CONFIG.phone]}
    >
      <div className="mx-panels">
        {/* ---------- Каналы связи и форма ---------- */}
        <PagePanel tone="dark">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-5">
              <div className="mx-kicker mb-5" data-reveal>
                Как с нами связаться
              </div>
              <div className="mb-6" data-reveal>
                <span className="mx-badge">
                  <LiveClock />
                </span>
              </div>
              <div className="space-y-3">
                {channels.map((c, i) => (
                  <div key={c.title} data-reveal="left" style={{ '--d': `${i * 100}ms` } as CSSProperties}>
                    <Tilt max={5} className="rounded-[28px]">
                      <div className="mx-card flex items-start gap-4 p-5 md:p-6">
                        <span className={`mx-icon ${c.tone}`}>
                          <i className={c.icon} />
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm text-[#8e9ab6]">
                            {c.title} · {c.note}
                          </div>
                          {c.href ? (
                            <a href={c.href} className="mt-1 block break-words text-lg font-semibold text-white hover:text-[#cbf23d] md:text-xl">
                              {c.value}
                            </a>
                          ) : (
                            <div className="mt-1 text-lg font-semibold text-white md:text-xl">{c.value}</div>
                          )}
                          {c.extra && <div className="mt-1 text-sm text-[#8e9ab6]">{c.extra}</div>}
                        </div>
                      </div>
                    </Tilt>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 lg:col-span-7" data-reveal="tilt">
              <div className="mx-card h-full p-6 md:p-10">
                <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">Отправить сообщение</h2>
                <p className="mb-8 text-[#8e9ab6]">Опишите задачу — менеджер свяжется с вами в рабочее время.</p>
                <ContactForm />
              </div>
            </div>
          </div>
        </PagePanel>

        {/* ---------- Почему к нам ---------- */}
        <PagePanel tone="blue">
          <div className="mx-grid-bg opacity-60" />
          <div className="relative">
            <div className="mb-10 md:mb-14">
              <div className="mx-kicker mb-5 !text-white/70" data-reveal>
                Сервис
              </div>
              <h2 className="mx-h2" data-reveal="lines">
                <span className="mx-ln">
                  <span>Почему стоит</span>
                </span>
                <span className="mx-ln" style={{ '--i': 1 } as CSSProperties}>
                  <span>обратиться к нам</span>
                </span>
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {reasons.map((r, i) => (
                <div
                  key={r.title}
                  className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/15 md:p-8"
                  data-reveal="tilt"
                  style={{ '--d': `${i * 120}ms` } as CSSProperties}
                >
                  <span className="mx-icon mb-6 bg-white text-[#3d6bff]">
                    <i className={r.icon} />
                  </span>
                  <h3 className="mb-2 text-xl font-bold tracking-tight">{r.title}</h3>
                  <p className="text-white/75">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        </PagePanel>

        {/* ---------- Вопросы ---------- */}
        <PagePanel tone="ink">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Heading kicker="FAQ" lines={['Часто задаваемые', 'вопросы']} />
            </div>
            <div className="space-y-3 lg:col-span-7">
              {faq.map((item, i) => (
                <details key={item.question} className="mx-faq mx-card" data-reveal style={{ '--d': `${i * 80}ms` } as CSSProperties} open={i === 0}>
                  <summary className="flex items-center gap-4 p-5 text-lg font-semibold md:p-6">
                    <span className="flex-1">{item.question}</span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10">
                      <i className="fas fa-plus text-sm" />
                    </span>
                  </summary>
                  <div className="mx-faq-body px-5 pb-6 text-[#a9b4cf] md:px-6">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </PagePanel>

        {/* ---------- Связаться ---------- */}
        <PagePanel tone="lime">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <h2 className="mx-h2 lg:col-span-7" data-reveal="lines">
              <span className="mx-ln">
                <span>Готовы решить</span>
              </span>
              <span className="mx-ln" style={{ '--i': 1 } as CSSProperties}>
                <span>вашу проблему?</span>
              </span>
            </h2>
            <div className="lg:col-span-5" data-reveal="right">
              <p className="mb-6 text-lg text-[#0b1324]/75">Свяжитесь с нами прямо сейчас для получения консультации</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={`tel:${tel}`} className="mx-btn mx-btn-dark" data-magnet>
                  <i className="fas fa-phone text-sm" /> Позвонить
                </a>
                <a href={`mailto:${SITE_CONFIG.email}`} className="mx-btn bg-white text-[#0b1324]" data-magnet>
                  Написать email
                </a>
              </div>
            </div>
          </div>
        </PagePanel>
      </div>
    </PageLayout>
  )
}
