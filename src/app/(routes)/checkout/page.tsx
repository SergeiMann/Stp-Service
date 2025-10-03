'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import type { CartItem } from '@/types'

interface OrderForm {
  customerName: string
  customerEmail: string
  customerPhone: string
  company: string
  deliveryMethod: string
  deliveryAddress: string
  paymentMethod: string
  notes: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [form, setForm] = useState<OrderForm>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    company: '',
    deliveryMethod: 'pickup',
    deliveryAddress: '',
    paymentMethod: 'cash',
    notes: ''
  })

  // Перенаправление если корзина пуста
  useEffect(() => {
    if (items.length === 0) {
      router.push('/catalog')
    }
  }, [items, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!form.customerName.trim()) {
      addToast('Введите ваше имя', 'error')
      return false
    }
    
    if (!form.customerEmail.trim()) {
      addToast('Введите email', 'error')
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.customerEmail)) {
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
    
    if (form.deliveryMethod === 'delivery' && !form.deliveryAddress.trim()) {
      addToast('Укажите адрес доставки', 'error')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const orderData = {
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim(),
        company: form.company.trim() || undefined,
        deliveryMethod: form.deliveryMethod,
        deliveryAddress: form.deliveryMethod === 'delivery' ? form.deliveryAddress.trim() : undefined,
        paymentMethod: form.paymentMethod,
        notes: form.notes.trim() || undefined,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
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
      
      if (result.success) {
        addToast(result.message, 'success')
        clearCart()
        
        // Перенаправление на страницу успеха
        setTimeout(() => {
          router.push(`/order-success?orderNumber=${result.data.orderNumber}`)
        }, 2000)
      } else {
        addToast(result.error, 'error')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      addToast('Ошибка при оформлении заказа', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return null // Компонент перенаправит на каталог
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Оформление заказа</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Форма заказа */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Контактная информация</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя и фамилия *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Иван Иванов"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={form.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ivan@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={form.customerPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Компания
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ООО &quot;Ваша компания&quot;"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Способ получения
                  </label>
                  <select
                    name="deliveryMethod"
                    value={form.deliveryMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pickup">Самовывоз</option>
                    <option value="delivery">Доставка</option>
                  </select>
                </div>
                
                {form.deliveryMethod === 'delivery' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Адрес доставки *
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={form.deliveryAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Способ оплаты
                  </label>
                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Наличными</option>
                    <option value="card">Банковской картой</option>
                    <option value="transfer">Безналичный расчет</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Комментарий к заказу
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Дополнительная информация..."
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Оформление...' : 'Оформить заказ'}
                </Button>
              </form>
            </Card>
          </div>
          
          {/* Сводка заказа */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Ваш заказ</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {item.product.price.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Итого:</span>
                  <span>{total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Информация о заказе</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Мы свяжемся с вами для подтверждения заказа</li>
                  <li>• Самовывоз из офиса или доставка по Москве</li>
                  <li>• Оплата наличными, картой или безналичным расчетом</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
