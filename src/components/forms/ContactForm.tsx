'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

interface FormData {
  name: string
  phone: string
  email: string
  company?: string
  message: string
  equipment: string
}

interface ContactFormProps {
  onSubmit?: (data: FormData) => void
  className?: string
}

export function ContactForm({ onSubmit, className }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: '',
    equipment: ''
  })
  
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [personalDataConsent, setPersonalDataConsent] = useState(false)
  const { addToast } = useToast()

  // Форматирование телефона под маску +7 (xxx) xxx-xx-xx с автозаменой 8→+7
  const formatPhone = (raw: string): string => {
    const digitsOnly = raw.replace(/\D/g, '')

    // Определяем базовые 11 цифр, всегда приводим к ведущей 7
    let normalized = digitsOnly
    if (normalized.startsWith('8')) {
      normalized = '7' + normalized.slice(1)
    } else if (!normalized.startsWith('7')) {
      normalized = '7' + normalized
    }

    // Берём максимум 11 цифр (1 префикс + 10 национальный номер)
    normalized = normalized.slice(0, 11)

    // Национальная часть без первой 7
    const n = normalized.slice(1)
    const p1 = n.slice(0, 3)
    const p2 = n.slice(3, 6)
    const p3 = n.slice(6, 8)
    const p4 = n.slice(8, 10)

    let formatted = '+7'
    if (n.length > 0) formatted += ' (' + p1
    if (n.length >= 3) formatted += ')'
    if (n.length > 3) formatted += ' ' + p2
    if (n.length > 6) formatted += '-' + p3
    if (n.length > 8) formatted += '-' + p4

    // Если пользователь ещё не ввёл ни одной цифры после +7
    if (n.length === 0) formatted += ' '

    return formatted
  }

  const getDigits = (value: string): string => value.replace(/\D/g, '')

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен для заполнения'
    } else {
      const digits = getDigits(formData.phone)
      if (!(digits.length === 11 && digits.startsWith('7'))) {
        newErrors.phone = 'Введите телефон в формате +7 (xxx) xxx-xx-xx'
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Сообщение обязательно для заполнения'
    } else if (formData.message.trim().length < 5) {
      newErrors.message = 'Сообщение: минимум 5 символов'
    }

    if (!formData.equipment.trim()) {
      newErrors.equipment = 'Выберите тип оборудования'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !personalDataConsent) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Reset form after successful submission
        setFormData({
          name: '',
          phone: '',
          email: '',
          company: '',
          message: '',
          equipment: ''
        })
        
        addToast(result.message || 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success')
        
        // Call optional onSubmit callback
        if (onSubmit) {
          await onSubmit(formData)
        }
      } else {
        // Если сервер прислал детали валидации — покажем под полями и тостом
        if (result?.details?.fieldErrors) {
          const fieldErrors = result.details.fieldErrors as Record<string, string[]>
          const mapped: Partial<FormData> = {}
          ;(['name','phone','email','company','message','equipment'] as (keyof FormData)[]).forEach((k) => {
            const msg = fieldErrors[k as string]?.[0]
            if (msg) mapped[k] = msg
          })
          if (Object.keys(mapped).length) setErrors(mapped)
          const first = Object.values(mapped)[0]
          addToast(first || result.error || 'Произошла ошибка при отправке заявки.', 'error')
        } else {
          addToast(result.error || 'Произошла ошибка при отправке заявки.', 'error')
        }
      }
    } catch (error) {
      console.error('Form submission error:', error)
      addToast('Произошла ошибка при отправке заявки. Попробуйте еще раз.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    let nextValue = value
    if (field === 'phone') {
      nextValue = formatPhone(value)
    }
    setFormData(prev => ({ ...prev, [field]: nextValue }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="name" className="mx-label">
            Имя *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`mx-field ${errors.name ? 'is-invalid' : ''}`}
            placeholder="Ваше имя"
          />
          {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>}
        </div>

        {/* Company (optional) */}
        <div>
          <label htmlFor="company" className="mx-label">
            Компания
          </label>
          <input
            type="text"
            id="company"
            value={formData.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            className={`mx-field ${errors.company ? 'is-invalid' : ''}`}
            placeholder="Наименование компании (необязательно)"
          />
          {errors.company && <p className="mt-1.5 text-sm text-red-400">{errors.company}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="mx-label">
            Телефон *
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onFocus={() => {
              if (!formData.phone) {
                setFormData(prev => ({ ...prev, phone: '+7 ' }))
              }
            }}
            className={`mx-field ${errors.phone ? 'is-invalid' : ''}`}
            placeholder="+7 (999) 123-45-67"
          />
          {errors.phone && <p className="mt-1.5 text-sm text-red-400">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mx-label">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`mx-field ${errors.email ? 'is-invalid' : ''}`}
            placeholder="your@email.com"
          />
          {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>}
        </div>

        {/* Equipment */}
        <div className="sm:col-span-2">
          <label htmlFor="equipment" className="mx-label">
            Тип оборудования *
          </label>
          <select
            id="equipment"
            value={formData.equipment}
            onChange={(e) => handleChange('equipment', e.target.value)}
            className={`mx-field ${errors.equipment ? 'is-invalid' : ''}`}
          >
            <option value="">Выберите тип оборудования</option>
            <option value="scanner">Сканер штрих-кодов</option>
            <option value="printer">Термопринтер</option>
            <option value="terminal">ТСД/Терминал</option>
            <option value="tablet">Планшет</option>
            <option value="other">Другое</option>
          </select>
          {errors.equipment && <p className="mt-1.5 text-sm text-red-400">{errors.equipment}</p>}
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mx-label">
            Сообщение *
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className={`mx-field ${errors.message ? 'is-invalid' : ''}`}
            placeholder="Опишите проблему с оборудованием или ваш вопрос"
          />
          {errors.message && <p className="mt-1.5 text-sm text-red-400">{errors.message}</p>}
        </div>

        {/* Submit Button */}
        <label className="flex items-start gap-3 text-sm text-[#a9b4cf] sm:col-span-2">
          <input
            type="checkbox"
            checked={personalDataConsent}
            onChange={(e) => setPersonalDataConsent(e.target.checked)}
            required
            className="mx-check-input"
          />
          <span>
            Согласен(на) на обработку персональных данных в соответствии с{' '}
            <Link href="/privacy" className="text-[#cbf23d] underline underline-offset-2 hover:text-white">
              Политикой обработки персональных данных
            </Link>
            .
          </span>
        </label>

        <Button
          type="submit"
          disabled={isSubmitting || !personalDataConsent}
          className="w-full sm:col-span-2"
        >
          {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
        </Button>
      </div>
    </form>
  )
}
