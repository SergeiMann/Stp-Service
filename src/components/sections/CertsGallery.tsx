'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
// local lightbox; avoiding external modal to prevent click-race issues

interface CertsGalleryProps {
  images: string[]
}

export function CertsGallery({ images }: CertsGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSrc, setActiveSrc] = useState<string | null>(null)
  const [isBrowser, setIsBrowser] = useState(false)
  const [allowCloseAt, setAllowCloseAt] = useState<number>(0)
  const [isVisible, setIsVisible] = useState(false)
  const closeTimeoutRef = useRef<number | null>(null)

  useEffect(() => { setIsBrowser(true) }, [])

  const open = (src: string) => {
    setActiveSrc(src)
    setAllowCloseAt(Date.now() + 200)
    setIsOpen(true)
    // стартуем анимацию появления на следующий кадр
    setIsVisible(false)
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => setIsVisible(true))
    }
  }

  const close = () => {
    if (Date.now() < allowCloseAt) return
    setIsVisible(false)
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false)
      setActiveSrc(null)
      closeTimeoutRef.current = null
    }, 300) // совпадает с duration-300
  }

  // UX: Esc закрывает и скролл блокируется пока открыт лайтбокс
  useEffect(() => {
    if (!isBrowser) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    if (isOpen) {
      document.addEventListener('keydown', onKey)
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', onKey)
        document.body.style.overflow = prev
      }
    }
  }, [isOpen, isBrowser])

  const getLabel = (file: string) => {
    const name = file.replace(/\.[^.]+$/, '')
    const map: Record<string, string> = {
      astra: 'Astra Linux',
      cipher: 'CipherLab',
      godex: 'GoDEX',
      m3: 'M3 Mobile',
      tsc: 'TSC Printers',
      urovo_reseller: 'UROVO',
      urovo_service: 'UROVO',
      urovo2024: 'UROVO',
      zebra: 'Zebra Technologies',
    }
    return map[name] ?? name.replace(/_/g, ' ')
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {images.map((file) => {
          const src = `/images/certs/${file}`
          const label = getLabel(file)
          return (
            <div
              key={file}
              role="button"
              tabIndex={0}
              onClick={() => open(src)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') open(src) }}
              className="group relative overflow-hidden rounded-xl ring-1 ring-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-transform duration-300 hover:scale-[1.01] cursor-zoom-in"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={src}
                  alt={`Сертификат ${label}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain rounded-xl"
                />
              </div>

              {/* overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* zoom button */}
              <button
                type="button"
                aria-label="Увеличить"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); open(src) }}
                className="absolute top-2 right-2 z-40 pointer-events-auto inline-flex items-center justify-center rounded-lg bg-black/60 text-white p-2 shadow ring-1 ring-white/20 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <i className="fas fa-magnifying-glass-plus"></i>
              </button>

              {/* caption */}
              <div className="px-3 py-2 text-center text-sm text-gray-200/90">
                {label}
              </div>
            </div>
          )
        })}
      </div>

      {isOpen && isBrowser && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={close}
          />
          <div className={`relative p-0 transform transition-all duration-300 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <button
              aria-label="Закрыть"
              onClick={close}
              className="absolute -top-12 right-0 rounded-full bg-black/60 text-white p-2 hover:bg-black/80"
            >
              <i className="fas fa-times"></i>
            </button>
            {activeSrc && (
              <img
                src={activeSrc}
                alt="Сертификат"
                className="max-w-[90vw] max-h-[90vh] object-contain"
              />
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}


