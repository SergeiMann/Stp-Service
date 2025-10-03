'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams?.get('orderNumber')
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (!orderNumber) {
      router.push('/')
      return
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [orderNumber, router])

  if (!orderNumber) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="p-8">
          {/* Иконка успеха */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-8 h-8 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Заказ успешно оформлен!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Ваш заказ <span className="font-semibold text-blue-600">#{orderNumber}</span> принят в обработку
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-blue-900 mb-3">Что дальше?</h2>
            <div className="text-left space-y-2 text-blue-800">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">1</span>
                <p>Мы свяжемся с вами в течение 30 минут для подтверждения заказа</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">2</span>
                <p>Уточним детали доставки и способ оплаты</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">3</span>
                <p>Подготовим ваш заказ и отправим или передадим для самовывоза</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push('/catalog')}
                variant="outline"
              >
                Продолжить покупки
              </Button>
              <Button 
                onClick={() => router.push('/contacts')}
              >
                Связаться с нами
              </Button>
            </div>
            
            <p className="text-sm text-gray-500">
              Автоматическое перенаправление через {countdown} сек.
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Контактная информация</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📞 +7 (495) 123-45-67</p>
              <p>📧 info@stp-service.ru</p>
              <p>🕒 Пн-Пт: 9:00-18:00, Сб: 10:00-16:00</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
