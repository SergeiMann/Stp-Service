'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageLayout } from '@/components/layout/PageLayout'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams?.get('orderNumber')


  useEffect(() => {
    if (!orderNumber) {
      router.push('/')
      return
    }


  }, [orderNumber, router])

  if (!orderNumber) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="p-6 sm:p-8 bg-white/10 backdrop-blur-sm rounded-xl border-white/20">
          {/* Иконка успеха */}
          <div className="w-16 h-16 bg-green-500/15 border border-green-400/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-8 h-8 text-green-300" 
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

          <p className="text-lg text-gray-300 mb-6">
            Ваша заявка <span className="font-semibold text-blue-300 break-words">#{orderNumber}</span> принята в обработку
          </p>
          
          <div className="bg-blue-600/10 border border-blue-400/20 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-blue-300 mb-3">Что дальше?</h2>
            <div className="text-left space-y-2 text-gray-300">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-200 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">1</span>
                <p>Менеджер свяжется с вами по указанным контактам</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-200 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">2</span>
                <p>Проверим наличие выбранных товаров и нужного количества</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-200 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">3</span>
                <p>Согласуем стоимость, сроки поставки и дальнейшее оформление</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push('/catalog')}
                variant="outline"
                className="border-blue-400 text-blue-300 hover:bg-blue-600 hover:text-white"
              >
                Продолжить покупки
              </Button>
              <Button 
                onClick={() => router.push('/contacts')}
              >
                Связаться с нами
              </Button>
            </div>
            

          </div>
          
          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="font-semibold text-white mb-3">Контактная информация</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>📞 +7 (495) 255-08-54</p>
              <p>📧 info@stp-service.com</p>
              <p>🕒 пн-пт 10:00-19:00; сб, вс — выходной день</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <PageLayout title="Заявка отправлена!">
      <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-gray-300" role="status">Загрузка...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </PageLayout>
  )
}
