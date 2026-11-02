'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  className?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, className = '', children }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !isOpen) return null

  const modal = (
    <div className="fixed inset-0 z-[1000]">
      <div
        className="absolute inset-0 bg-[#060a14]/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`relative w-full max-w-lg overflow-hidden rounded-[28px] bg-white shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] ring-1 ring-black/5 ${className}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold tracking-tight text-gray-900">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

 