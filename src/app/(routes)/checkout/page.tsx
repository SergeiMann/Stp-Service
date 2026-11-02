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
      <div className="mx-auto max-w-[1440px] px-4 pb-12 text-white md:px-8">
      <div className="mx-auto max-w-5xl">

        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Форма заказа */}
          <div>
            <Card className="mx-card !border-0 !bg-white/[0.04] p-6 md:p-8 !rounded-[28px] !shadow-none">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Контактная информация</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mx-label">
                    Имя и фамилия *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleInputChange}
                    className="mx-field"
                    placeholder="Иван Иванов"
                    required
                  />
                </div>
                
                <div>
                  <label className="mx-label">
                    Email (необязательно)
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={form.customerEmail}
                    onChange={handleInputChange}
                    className="mx-field"
                    placeholder="ivan@example.com"
                  />
                </div>
                
                <div>
                  <label className="mx-label">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={form.customerPhone}
                    onChange={handleInputChange}
                    className="mx-field"
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>
                
                <div>
                  <label className="mx-label">
                    Компания
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleInputChange}
                    className="mx-field"
                    placeholder="ООО &quot;Ваша компания&quot;"
                  />
                </div>
                
                <div>
                  <label className="mx-label">
                    Комментарий к заявке
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="mx-field"
                    placeholder="Дополнительная информация..."
                  />
                </div>
                
                <label className="flex items-start gap-3 text-sm text-[#a9b4cf]">
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
            <Card className="mx-card !border-0 !bg-white/[0.04] p-6 md:p-8 !rounded-[28px] !shadow-none lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Выбранные товары</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1 break-words">
                      <h3 className="font-medium text-white">{item.product.name}</h3>
                      <p className="text-sm text-[#8e9ab6]">
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
              
              <div className="border-t border-white/10 pt-4">
                <div className="flex flex-wrap justify-between items-center gap-2 text-lg font-semibold">
                  <span>Предварительная сумма:</span>
                  <span>{total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
              
              <div className="mt-6 rounded-2xl bg-[#3d6bff]/10 p-5 ring-1 ring-[#3d6bff]/25">
                <h3 className="font-semibold text-[#9db4ff] mb-2">Как обрабатывается заявка</h3>
                <ul className="text-sm text-[#c9d3ee] space-y-1.5">
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
