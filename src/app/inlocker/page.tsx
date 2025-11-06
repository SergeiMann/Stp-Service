import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Инлокер — автоматизированная система ячеек',
  description: 'Инлокер — система ячеек для хранения и учёта оборудования: контроль, безопасность, аналитика и интеграции. Подходит для складов, производств, офисов и сервисных центров.'
}

export default function InlockerPage() {
  const brand = {
    primary: '#2AD67C', // основной зелёный Инлокера (по макету)
    primaryDark: '#16B455',
    tint: '#E9FBF1'
  }
  return (
    <PageLayout 
      title="Инлокер — система ячеек хранения и учёта"
      subtitle="Исключает человеческий фактор, контролирует состояние оборудования удалённо, снижает расходы и ускоряет учёт"
      badge="Инлокер+"
      backgroundImage="/images/inlocker/front.jpg"
      variant="light"
      className=""
    >
      {/* Intro */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
                style={{
                  backgroundColor: brand.tint,
                  color: brand.primaryDark,
                  border: `1px solid ${brand.primary}40`
                }}
              >
                Простое и технологичное решение
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                Сократите простои и потери за счёт автоматизации хранения и выдачи
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Благодаря удобному личному кабинету процессы контроля, учёта и аналитики происходят автоматически. Решение
                быстро интегрируется в внутренние процессы и масштабируется под ваши задачи.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#elements">
                  <Button className="text-white" style={{ backgroundColor: brand.primaryDark }}>
                    Элементы системы
                  </Button>
                </Link>
                <Link href="/contacts">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">Заказать демонстрацию</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full max-w-xl mx-auto">
                <Image
                  src="/images/inlocker/6.jpg"
                  alt="Шкаф Инлокер — система ячеек"
                  width={960}
                  height={720}
                  className="rounded-xl shadow-2xl ring-1 ring-white/10 object-cover"
                  priority
                />
                <div className="absolute -bottom-5 -left-5 text-white rounded-lg px-4 py-3 shadow-lg" style={{ backgroundColor: brand.primary }}>
                  <div className="text-2xl font-bold">480+</div>
                  <div className="text-xs uppercase tracking-wide opacity-90">ячеек в одной системе</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      

      {/* Benefits as circular items */}
      <section className="py-14" style={{ background: `linear-gradient(to bottom, ${brand.tint}, #ffffff)` }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { emoji: '🧑‍🔧', title: 'Исключает человеческий фактор', desc: 'Выдача/возврат через ячейки и роли доступа' },
              { emoji: '📡', title: 'Контроль состояния удалённо', desc: 'Статусы, проблемы, медосмотр, сервис' },
              { emoji: '💸', title: 'Снижает расходы', desc: 'Меньше потерь, меньше внепланового ремонта' },
              { emoji: '⚡', title: 'Ускоряет учёт', desc: 'Автоматические отчёты и аналитика' },
            ].map((b) => (
              <div key={b.title} className="flex flex-col items-center">
                <div
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/80 flex items-center justify-center text-3xl shadow-sm transition-transform duration-300 hover:scale-105"
                  style={{ border: `1px solid ${brand.primary}33` }}
                >
                  <span role="img" aria-label={b.title}>{b.emoji}</span>
                </div>
                <div className="mt-4 text-gray-900 font-semibold leading-snug">{b.title}</div>
                <div className="mt-1 text-gray-600 text-sm">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Elements */}
      <section id="elements" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Всего 3 элемента</h3>
          <div className="grid lg:grid-cols-3 gap-6">
            <Link href="#lockers" className="rounded-xl bg-white/80 p-6 shadow-sm block hover:shadow-md transition-shadow" style={{ border: `1px solid ${brand.primary}33` }}>
              <div className="text-sm font-medium mb-2" style={{ color: brand.primaryDark }}>Система ячеек</div>
              <div className="text-gray-900 font-semibold mb-2">4 типоразмера, USB для зарядки</div>
              <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
                <li>Цветовая индикация, считыватель, экран</li>
                <li>Питание, Wi‑Fi, до 480 ячеек на систему</li>
              </ul>
            </Link>
            <Link href="#module" className="rounded-xl bg-white/80 p-6 shadow-sm block hover:shadow-md transition-shadow" style={{ border: `1px solid ${brand.primary}33` }}>
              <div className="text-sm font-medium mb-2" style={{ color: brand.primaryDark }}>Модуль управления</div>
              <div className="text-gray-900 font-semibold mb-2">Отвечает за весь функционал</div>
              <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
                <li>Поддержка объектов, пользователей, прав доступа</li>
                <li>Интеграция с вашей системой</li>
              </ul>
            </Link>
            <Link href="#dashboard" className="rounded-xl bg-white/80 p-6 shadow-sm block hover:shadow-md transition-shadow" style={{ border: `1px solid ${brand.primary}33` }}>
              <div className="text-sm font-medium mb-2" style={{ color: brand.primaryDark }}>Личный кабинет</div>
              <div className="text-gray-900 font-semibold mb-2">Учёт, распределение, статистика</div>
              <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
                <li>Управление ролями и правами</li>
                <li>Отчёты, проблемы, ремонт, расходники</li>
              </ul>
            </Link>
          </div>
        </div>
      </section>

      {/* Система ячеек — рядом с модулем */}
      <section id="lockers" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Система ячеек</h3>
              <p className="text-gray-700 mb-6">С возможностью установки USB для зарядки. Доступны 4 типоразмера — от S до XL.</p>
              <ul className="text-gray-700 space-y-2 list-disc pl-5">
                <li>Цветовая индикация, считыватель, экран</li>
                <li>Питание, Wi‑Fi, до 480 ячеек на систему</li>
                <li>Индивидуальная компоновка под задачи и помещение</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center justify-center gap-6">
                <div className="group relative w-28 md:w-36 aspect-[4/3] transition-transform duration-300 ease-out">
                  <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1">
                    <Image src="/images/inlocker/1_shkaf.png" alt="Ячейка S" fill className="object-contain pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)] group-hover:drop-shadow-[0_12px_28px_rgba(22,180,85,0.35)]" sizes="120px" />
                  </div>
                </div>
                <div className="group relative w-32 md:w-44 aspect-[4/3] transition-transform duration-300 ease-out">
                  <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1">
                    <Image src="/images/inlocker/2_shkaf.png" alt="Ячейки M/L" fill className="object-contain pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)] group-hover:drop-shadow-[0_12px_28px_rgba(22,180,85,0.35)]" sizes="160px" />
                  </div>
                </div>
                <div className="group relative w-40 md:w-56 aspect-[4/3] transition-transform duration-300 ease-out">
                  <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1">
                    <Image src="/images/inlocker/4_shkaf.png" alt="Ячейки XL" fill className="object-contain pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)] group-hover:drop-shadow-[0_12px_28px_rgba(22,180,85,0.35)]" sizes="220px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Личный кабинет — рядом с модулем */}
      <section id="dashboard" className="py-16" style={{ background: `linear-gradient(to right, ${brand.tint}, #ffffff)` }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Личный кабинет администратора</h3>
              <p className="text-gray-700 mb-6">Контролирует работу всех параметров с доступом с любого устройства.</p>
              <div className="flex flex-wrap gap-3 mb-6">
                {['Пользователи','Шкафы','Проблемы','Сервис','Объекты','Оборудование','Медосмотр','Ремонт','Расходники'].map(x => (
                  <span
                    key={x}
                    className="px-6 py-3 rounded-full text-base font-semibold cursor-default select-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      background: `linear-gradient(180deg, #FFFFFF 0%, ${brand.tint} 100%)`,
                      color: brand.primaryDark,
                      border: `1px solid ${brand.primary}55`,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                    }}
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="group transition-all duration-300 relative w-full max-w-3xl mx-auto">
                <Image
                  src="/images/inlocker/adminka.png"
                  alt="Личный кабинет — экран"
                  width={1600}
                  height={900}
                  className="w-full h-auto rounded-3xl pointer-events-none transition-transform duration-300 ease-out drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)] group-hover:scale-105 group-hover:-translate-y-1 group-hover:drop-shadow-[0_12px_28px_rgba(22,180,85,0.35)]"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Модуль управления — рядом с предыдущими */}
      <section id="module" className="py-16" style={{ background: `linear-gradient(to bottom, #ffffff, ${brand.tint})` }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Модуль управления</h3>
              <p className="text-gray-700 mb-6">Отвечает за весь функционал и поддерживает до 480 ячеек в работе.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 content-start">
                {[{ label: 'WI‑FI', tip: 'Диапазоны 2,4 и 5 ГГц' },{ label: 'Экран', tip: '10″ антивандальный проекционно‑емкостный сенсорный монитор' },{ label: 'ОС', tip: 'Linux ARM' },{ label: 'ПО', tip: 'ПО Инлокер: мониторинг, аналитика, управление' },{ label: 'Считыватель', tip: 'Считыватель карт 6‑в‑1 R15‑Multi: 2.4 ГГц, 13.56 МГц, 125 КГц, NFC' },{ label: 'Питание', tip: 'Вход 200–240 VAC. Выход: 12V, 17A, 204W. Встроенный PFC > 0.5' },{ label: 'Цветовая индикация', tip: 'Светодиодная адресная подсветка' }].map((item) => (
                  <div key={item.label} className="relative group">
                    <span className="px-6 py-3 rounded-full text-base font-semibold cursor-default select-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md" style={{ background: `linear-gradient(180deg, #FFFFFF 0%, ${brand.tint} 100%)`, color: brand.primaryDark, border: `1px solid ${brand.primary}55`, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>{item.label}</span>
                    <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 w-max max-w-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
                      <div className="rounded-2xl px-4 py-3 text-white text-sm shadow-xl" style={{ backgroundColor: brand.primaryDark }}>{item.tip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="group transition-all duration-300 relative">
                <div className="relative w-full max-w-md mx-auto aspect-[3/4] overflow-visible rounded-md transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1">
                  <Image src={'/images/inlocker/экран авторизации.png'} alt={'Модуль управления'} fill className="object-contain pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)] group-hover:drop-shadow-[0_12px_28px_rgba(22,180,85,0.35)]" sizes="(max-width: 1024px) 80vw, 35vw" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-white" style={{ background: `linear-gradient(90deg, ${brand.primaryDark}, ${brand.primary})` }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-2xl md:text-3xl font-bold mb-3">Готовы внедрить Инлокер?</h4>
              <p className="text-emerald-50/90 mb-6">Оставьте контакты — пришлём чек‑лист как начать экономить и подготовим демо.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contacts"><Button size="lg" className="text-emerald-700 hover:bg-emerald-50" style={{ backgroundColor: '#ffffff' }}>Связаться с нами</Button></Link>
                <Link href="/catalog"><Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">Сопутствующее оборудование</Button></Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-xl bg-white/10 border border-white/20 p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">14</div>
                    <div className="text-xs opacity-90">дней бесплатного теста</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-xs opacity-90">мониторинг и контроль</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </PageLayout>
  )
}


