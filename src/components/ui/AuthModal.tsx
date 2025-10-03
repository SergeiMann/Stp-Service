'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Modal } from './Modal'
import { Button } from './Button'
import { useToast } from './Toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.email.trim()) {
      addToast('Введите email', 'error')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      addToast('Некорректный формат email', 'error')
      return
    }
    
    setLoading(true)
    
    try {
      const success = await login(
        form.email.trim(),
        form.name.trim() || undefined,
        form.phone.trim() || undefined,
        form.password.trim() || undefined
      )
      
      if (success) {
        addToast('Успешная авторизация!', 'success')
        setTimeout(() => {
          onClose()
          setForm({ email: '', password: '', name: '', phone: '' })
        }, 1000)
      } else {
        addToast('Ошибка авторизации', 'error')
      }
    } catch (error) {
      addToast('Ошибка при авторизации', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Вход в личный кабинет"
      className="max-w-md"
    >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Если у вас нет аккаунта, он будет создан автоматически
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите пароль (для админа/менеджера)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Оставьте пустым для автоматической регистрации
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя и фамилия
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Иван Иванов"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+7 (999) 123-45-67"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Преимущества регистрации:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• История ваших заказов</li>
            <li>• Быстрое оформление повторных заказов</li>
            <li>• Персональные скидки и предложения</li>
            <li>• Уведомления о статусе заказа</li>
          </ul>
        </div>
    </Modal>
  )
}
