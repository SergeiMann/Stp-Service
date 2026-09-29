'use client'

import { useRef, type InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  value: string
  onClear: () => void
  clearLabel: string
  wrapperClassName?: string
}

export function ClearableInput({
  onClear,
  clearLabel,
  className,
  wrapperClassName,
  ...props
}: Props) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <span className={`relative block ${wrapperClassName ?? ''}`}>
      <input {...props} ref={input} className={`${className ?? ''} pr-9`} />
      {props.value !== '' && (
        <button
          type="button"
          aria-label={clearLabel}
          title={clearLabel}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded bg-transparent text-slate-400 hover:text-white focus:!outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400"
          onClick={event => {
            event.preventDefault()
            onClear()
            input.current?.focus()
          }}
        >
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      )}
    </span>
  )
}
