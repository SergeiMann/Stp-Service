'use client'

import { useEffect } from 'react'
import { clamp, hasFinePointer, prefersReducedMotion } from './utils'

/**
 * Общий «двигатель» страницы: подключается один раз и оживляет разметку по data-атрибутам.
 *  data-reveal  — появление при попадании в экран (атрибут data-in)
 *  data-panel   — панель-раздел: въезжает снизу и заваливается назад, уходя вверх (--enter, --exit)
 *  data-spot    — пятно света под курсором (--sx, --sy)
 *  data-magnet  — кнопка тянется к курсору (--bx, --by для блика)
 */
export function MotionRuntime() {
  useEffect(() => {
    const reduced = prefersReducedMotion()
    const fine = hasFinePointer()
    const cleanups: Array<() => void> = []

    // ---------- Появление ----------
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (reduced || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.setAttribute('data-in', ''))
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              // Атрибут, а не класс: className элемента принадлежит React и при перерисовке
              // перезаписывается, а чужие data-атрибуты React не трогает
              e.target.setAttribute('data-in', '')
              io.unobserve(e.target)
            }
          })
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
      )
      revealEls.forEach((el) => io.observe(el))
      cleanups.push(() => io.disconnect())
    }

    // ---------- Панели ----------
    const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-panel]'))
    if (panels.length && !reduced) {
      let frame = 0
      const update = () => {
        frame = 0
        const vh = window.innerHeight
        for (const p of panels) {
          const r = p.getBoundingClientRect()
          if (r.bottom < -50 || r.top > vh + 50) continue
          const enter = clamp((r.top - vh * 0.3) / (vh * 0.7))
          // Заваливаться начинает, когда нижний край панели поднимается выше низа экрана
          const exit = p.dataset.panel === 'last' ? 0 : clamp(1 - r.bottom / vh) * 0.9
          p.style.setProperty('--enter', enter.toFixed(4))
          p.style.setProperty('--exit', exit.toFixed(4))
        }
      }
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(update)
      }
      update()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
      cleanups.push(() => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
        cancelAnimationFrame(frame)
      })
    }

    // ---------- Пятно света ----------
    if (fine) {
      document.querySelectorAll<HTMLElement>('[data-spot]').forEach((el) => {
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          el.style.setProperty('--sx', `${e.clientX - r.left}px`)
          el.style.setProperty('--sy', `${e.clientY - r.top}px`)
        }
        el.addEventListener('pointermove', onMove)
        cleanups.push(() => el.removeEventListener('pointermove', onMove))
      })
    }

    // ---------- Магнитные кнопки ----------
    if (fine && !reduced) {
      document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((el) => {
        const strength = Number(el.dataset.magnet) || 0.25
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          const x = e.clientX - r.left
          const y = e.clientY - r.top
          el.style.setProperty('--bx', `${x}px`)
          el.style.setProperty('--by', `${y}px`)
          el.style.transform = `translate3d(${(x - r.width / 2) * strength}px, ${(y - r.height / 2) * strength}px, 0)`
        }
        const onLeave = () => {
          el.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)'
          el.style.transform = ''
          window.setTimeout(() => (el.style.transition = ''), 500)
        }
        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerleave', onLeave)
        cleanups.push(() => {
          el.removeEventListener('pointermove', onMove)
          el.removeEventListener('pointerleave', onLeave)
        })
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return null
}
