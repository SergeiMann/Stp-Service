'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

interface FormData {
  name: string
  phone: string
  email: string
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
    message: '',
    equipment: ''
  })
  
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    
    if (!validateForm()) return

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
          ;(['name','phone','email','message','equipment'] as (keyof FormData)[]).forEach((k) => {
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
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Имя *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ваше имя"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+7 (999) 123-45-67"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Equipment */}
        <div>
          <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-1">
            Тип оборудования *
          </label>
          <select
            id="equipment"
            value={formData.equipment}
            onChange={(e) => handleChange('equipment', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.equipment ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Выберите тип оборудования</option>
            <option value="scanner">Сканер штрих-кодов</option>
            <option value="printer">Термопринтер</option>
            <option value="terminal">ТСД/Терминал</option>
            <option value="tablet">Планшет</option>
            <option value="other">Другое</option>
          </select>
          {errors.equipment && <p className="text-red-500 text-sm mt-1">{errors.equipment}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Сообщение *
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Опишите проблему с оборудованием или ваш вопрос"
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
        </Button>
      </div>
    </form>
  )
}
