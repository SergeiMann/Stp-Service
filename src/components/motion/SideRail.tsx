'use client'

import { useEffect, useState } from 'react'

export interface RailSection {
  id: string
  label: string
  icon: string
}

/** Левое меню разделов страницы: подсвечивает раздел, который сейчас на экране */
export function SideRail({ sections }: { sections: RailSection[] }) {
  const [active, setActive] = useState(sections[0]?.id)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Раздел считается текущим, когда пересекает середину экрана
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [sections])

  return (
    <nav className={`mx-rail ${visible ? 'is-visible' : ''}`} aria-label="Разделы страницы">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={active === s.id ? 'is-active' : ''}
          aria-current={active === s.id ? 'true' : undefined}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            history.replaceState(null, '', `#${s.id}`)
          }}
        >
          <i className={s.icon} />
          <span>{s.label}</span>
        </a>
      ))}
    </nav>
  )
}
