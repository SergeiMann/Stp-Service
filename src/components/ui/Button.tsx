import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  className?: string
}

const buttonVariants = {
  primary: 'bg-[#cbf23d] text-[#0b1324] hover:bg-[#d9ff52] hover:shadow-[0_10px_30px_-10px_rgba(203,242,61,0.7)] focus:ring-[#cbf23d]',
  secondary: 'bg-[#0b1324] text-white hover:bg-[#1a2647] focus:ring-[#3d6bff]',
  outline: 'border-2 border-[#3d6bff] text-[#3d6bff] hover:bg-[#3d6bff] hover:text-white focus:ring-[#3d6bff]',
  ghost: 'text-[#3d6bff] hover:bg-[#3d6bff]/10 focus:ring-[#3d6bff]'
}

const buttonSizes = {
  sm: 'min-h-10 px-4 py-2 text-sm',
  md: 'min-h-12 px-6 py-3 text-base',
  lg: 'min-h-14 px-8 py-4 text-lg'
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
