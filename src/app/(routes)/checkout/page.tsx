'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { Card } from '@/components/ui/Card'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

interface OrderForm {
  customerName: string
  customerEmail: string
  customerPhone: string
  company: string
  notes: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [personalDataConsent, setPersonalDataConsent] = useState(false)
  
  const [form, setForm] = useState<OrderForm>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    company: '',
    notes: ''
  })

  // Перенаправление если корзина пуста
  useEffect(() => {
    if (items.length === 0 && !submitted) {
      router.push('/catalog')
    }
  }, [items, router, submitted])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!form.customerName.trim()) {
      addToast('Введите ваше имя', 'error')
      return false
    }
    

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (form.customerEmail.trim() && !emailRegex.test(form.customerEmail.trim())) {
      addToast('Некорректный формат email', 'error')
      return false
    }
    
    if (!form.customerPhone.trim()) {
      addToast('Введите номер телефона', 'error')
      return false
    }
    
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
    if (!phoneRegex.test(form.customerPhone)) {
      addToast('Некорректный формат телефона', 'error')
      return false
    }
    

    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !personalDataConsent) return
    
    setLoading(true)
    
    try {
      const orderData = {
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim(),
        company: form.company.trim() || undefined,
        notes: form.notes.trim() || undefined,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      }
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        addToast(result.message, 'success')
        setSubmitted(true)
        clearCart()
        
        router.replace(`/order-success?orderNumber=${encodeURIComponent(result.data.orderNumber)}`)
      } else {
        addToast(result.error, 'error')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      addToast('Ошибка при отправке заявки', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return null // Компонент перенаправит на каталог
  }

  return (
    <PageLayout
      title="Заявка на покупку"
    >
      <div className="container mx-auto px-4 py-12 text-white">
      <div className="max-w-4xl mx-auto">

        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Форма заказа */}
          <div>
            <Card className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border-white/20">
              <h2 className="text-xl font-semibold mb-6">Контактная информация</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Имя и фамилия *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-900/50 text-white placeholder:text-gray-400 border border-white/20 rounded-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="Иван Иванов"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email (необязательно)
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={form.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-900/50 text-white placeholder:text-gray-400 border border-white/20 rounded-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="ivan@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={form.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-900/50 text-white placeholder:text-gray-400 border border-white/20 rounded-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Компания
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-900/50 text-white placeholder:text-gray-400 border border-white/20 rounded-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="ООО &quot;Ваша компания&quot;"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Комментарий к заявке
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-900/50 text-white placeholder:text-gray-400 border border-white/20 rounded-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                    placeholder="Дополнительная информация..."
                  />
                </div>
                
                <label className="flex items-start gap-3 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={personalDataConsent}
                    onChange={(e) => setPersonalDataConsent(e.target.checked)}
                    required
                    className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 accent-blue-600 [color-scheme:dark] focus:ring-blue-500"
                  />
                  <span>
                    Согласен(на) на обработку персональных данных в соответствии с{' '}
                    <Link href="/privacy" className="text-blue-300 underline hover:text-blue-200">
                      Политикой обработки персональных данных
                    </Link>
                    .
                  </span>
                </label>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || submitted || !personalDataConsent}
                >
                  {loading ? 'Отправка...' : 'Отправить заявку на покупку'}
                </Button>
              </form>
            </Card>
          </div>
          
          {/* Сводка заказа */}
          <div>
            <Card className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border-white/20">
              <h2 className="text-xl font-semibold mb-6">Выбранные товары</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1 break-words">
                      <h3 className="font-medium text-white">{item.product.name}</h3>
                      <p className="text-sm text-gray-400">
                        {item.quantity} × {item.product.price.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-medium">
                        {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <div className="flex flex-wrap justify-between items-center gap-2 text-lg font-semibold">
                  <span>Предварительная сумма:</span>
                  <span>{total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-600/10 border border-blue-400/20 rounded-lg">
                <h3 className="font-medium text-blue-300 mb-2">Как обрабатывается заявка</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Менеджер свяжется с вами по выбранным позициям</li>
                  <li>• Наличие и окончательную стоимость подтвердит менеджер</li>
                  <li>• Отправка заявки не резервирует товары и не требует оплаты</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  )
}
