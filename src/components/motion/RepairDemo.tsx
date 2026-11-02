'use client'

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'
import { Tilt } from './Tilt'
import { prefersReducedMotion } from './utils'

// Этапы ремонта (раньше — раздел «Как мы работаем» на странице услуг)
const STEPS = [
  { title: 'Диагностика', text: 'Бесплатная диагностика оборудования и оценка стоимости ремонта' },
  { title: 'Согласование', text: 'Согласование стоимости работ и сроков выполнения с клиентом' },
  { title: 'Ремонт', text: 'Выполнение ремонтных работ с использованием оригинальных запчастей' },
  { title: 'Тестирование', text: 'Полное тестирование устройства и предоставление гарантии' },
]

const STEP_MS = 4800

function Row({ i, children, className = '' }: { i: number; children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ${className}`} style={{ '--i': i } as CSSProperties}>
      {children}
    </div>
  )
}

function Check({ i }: { i: number }) {
  return (
    <span className="mx-check ml-auto" style={{ '--i': i } as CSSProperties}>
      <i className="fas fa-check" />
    </span>
  )
}

function Scene({ step }: { step: number }) {
  switch (step) {
    case 0:
      return (
        <>
          <Row i={0}>
            <i className="fas fa-inbox text-slate-400" />
            <span className="text-sm">Заявка принята</span>
            <Check i={0} />
          </Row>
          <Row i={1}>
            <i className="fas fa-microchip text-slate-400" />
            <span className="text-sm">Проверка питания и системной платы</span>
            <span className="mx-typing ml-auto text-blue-500" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </Row>
          <Row i={2} className="!bg-amber-50 ring-1 ring-amber-200">
            <i className="fas fa-triangle-exclamation text-amber-500" />
            <span className="text-sm">
              Найдено: <b>износ разъема зарядки</b>
            </span>
          </Row>
          <div className="flex justify-end" style={{ '--i': 3 } as CSSProperties}>
            <span className="rounded-full bg-[#cbf23d] px-3 py-1.5 text-xs font-bold">Диагностика — бесплатно</span>
          </div>
        </>
      )
    case 1:
      return (
        <>
          <Row i={0}>
            <i className="fas fa-file-invoice text-slate-400" />
            <span className="text-sm">Смета и сроки отправлены клиенту</span>
            <Check i={0} />
          </Row>
          <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2 text-sm" style={{ '--i': 1 } as CSSProperties}>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Работы</span>
              <span className="font-medium text-right">Замена разъема зарядки</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Запчасти</span>
              <span className="font-medium text-right">Оригинальные</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Срок</span>
              <span className="font-medium text-right">24–48 часов</span>
            </div>
          </div>
          <Row i={2}>
            <i className="fas fa-user-check text-slate-400" />
            <span className="text-sm">Клиент подтвердил</span>
            <Check i={2} />
          </Row>
        </>
      )
    case 2:
      return (
        <>
          <Row i={0}>
            <i className="fas fa-screwdriver-wrench text-slate-400" />
            <span className="text-sm">Замена разъема зарядки</span>
            <span className="ml-auto text-xs font-semibold text-blue-600">в работе</span>
          </Row>
          <div className="rounded-2xl bg-white p-4 shadow-sm" style={{ '--i': 1 } as CSSProperties}>
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Прогресс</span>
              <span>оригинальная запчасть</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="mx-bar-fill" />
            </div>
          </div>
          <Row i={2}>
            <i className="fas fa-broom text-slate-400" />
            <span className="text-sm">Чистка и обновление ПО</span>
            <Check i={2} />
          </Row>
        </>
      )
    default:
      return (
        <>
          <div className="grid grid-cols-2 gap-2" style={{ '--i': 0 } as CSSProperties}>
            {['Зарядка', 'Экран и тач', 'Сканер', 'Wi‑Fi и Bluetooth'].map((t, i) => (
              <div key={t} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm shadow-sm">
                <span>{t}</span>
                <Check i={i} />
              </div>
            ))}
          </div>
          <div
            className="rounded-2xl bg-[#0b1324] text-white p-4 flex items-center gap-3"
            style={{ '--i': 2 } as CSSProperties}
          >
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#cbf23d] text-[#0b1324]">
              <i className="fas fa-shield-halved" />
            </span>
            <div>
              <div className="font-semibold">Готово к выдаче</div>
              <div className="text-xs text-white/60">Гарантия на работы и запчасти — до 12 месяцев</div>
            </div>
          </div>
        </>
      )
  }
}

/** Пошаговая сценка ремонта: этапы слева, «окно заявки» в 3D справа */
export function RepairDemo() {
  const [step, setStep] = useState(0)
  const [on, setOn] = useState(false)
  const [inView, setInView] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Каждая смена этапа заново проигрывает появление строк
  useEffect(() => {
    setOn(false)
    const id = window.setTimeout(() => setOn(true), 60)
    return () => window.clearTimeout(id)
  }, [step])

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return
    const id = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS)
    return () => window.clearTimeout(id)
  }, [inView, step])

  return (
    <div ref={rootRef} className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <div className="lg:col-span-5">
        <ol className="mx-steps space-y-1.5" data-reveal="left">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                className={`${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}
                onClick={() => setStep(i)}
              >
                <span className="mx-step-num">{i < step ? <i className="fas fa-check text-sm" /> : String(i + 1).padStart(2, '0')}</span>
                <span className="pt-1.5">
                  <span className="block text-lg md:text-xl font-semibold tracking-tight">{s.title}</span>
                  <span className="mx-step-desc">
                    <div>
                      <span className="block pt-1.5 text-sm leading-relaxed text-white/75">{s.text}</span>
                    </div>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="lg:col-span-7" data-reveal="tilt">
        <Tilt max={6} className="rounded-[26px]">
          <div className="mx-window">
            <div className="mx-window-bar">
              <i />
              <i />
              <i />
              <span className="ml-3 text-xs font-medium text-slate-500">Пример заявки на ремонт</span>
              <span className="ml-auto text-xs font-semibold text-slate-500 tabular-nums">
                Этап {step + 1} из {STEPS.length}
              </span>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-4 rounded-2xl bg-white p-3 md:p-4 shadow-sm mb-4">
                <div className="grid place-items-center w-16 h-16 md:w-20 md:h-20 rounded-xl bg-slate-100 shrink-0">
                  <img src="/images/equipment/honeywell-eda52-500x500.png" alt="" className="max-h-14 md:max-h-16 w-auto object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-500">Терминал сбора данных</div>
                  <div className="font-semibold truncate">Honeywell EDA52</div>
                  <div className="text-xs text-slate-500">Не заряжается</div>
                </div>
                <div className="ml-auto hidden sm:flex gap-1">
                  {STEPS.map((s, i) => (
                    <span
                      key={s.title}
                      className={`h-1.5 w-6 rounded-full transition-colors duration-500 ${i <= step ? 'bg-blue-600' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
              </div>
              <div key={step} className={`mx-feed space-y-2.5 min-h-[230px] ${on ? 'is-on' : ''}`}>
                <Scene step={step} />
              </div>
            </div>
          </div>
        </Tilt>
      </div>
    </div>
  )
}
