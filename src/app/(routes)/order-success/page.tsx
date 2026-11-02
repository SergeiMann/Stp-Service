'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageLayout } from '@/components/layout/PageLayout'
import { SITE_CONFIG } from '@/lib/constants'

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
    <div className="mx-auto max-w-[1440px] px-4 pb-12 text-white md:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="mx-card !border-0 !bg-white/[0.04] !shadow-none !rounded-[28px] p-6 sm:p-10">
          {/* Иконка успеха */}
          <div className="w-20 h-20 bg-[#cbf23d] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_60px_-10px_rgba(203,242,61,0.7)]">
            <svg 
              className="w-9 h-9 text-[#0b1324]" 
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

          <p className="text-lg text-[#c9d3ee] mb-8">
            Ваша заявка <span className="font-semibold text-[#cbf23d] break-words">#{orderNumber}</span> принята в обработку
          </p>
          
          <div className="rounded-2xl bg-[#3d6bff]/10 p-6 mb-8 ring-1 ring-[#3d6bff]/25">
            <h2 className="font-semibold text-[#9db4ff] mb-3">Что дальше?</h2>
            <div className="text-left space-y-3 text-[#c9d3ee]">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-[#3d6bff]/25 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">1</span>
                <p>Менеджер свяжется с вами по указанным контактам</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-[#3d6bff]/25 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">2</span>
                <p>Проверим наличие выбранных товаров и нужного количества</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-[#3d6bff]/25 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">3</span>
                <p>Согласуем стоимость, сроки поставки и дальнейшее оформление</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push('/catalog')}
                variant="outline"
                className="!border-white/25 !text-white hover:!bg-white/10"
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
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="font-semibold text-white mb-3">Контактная информация</h3>
            <div className="text-sm text-[#a9b4cf] space-y-1.5">
              <p><i className="fas fa-phone mr-2 text-[#cbf23d]" />{SITE_CONFIG.phone}</p>
              <p><i className="fas fa-envelope mr-2 text-[#cbf23d]" />{SITE_CONFIG.email}</p>
              <p><i className="fas fa-clock mr-2 text-[#cbf23d]" />{SITE_CONFIG.workingHours}</p>
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
      <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-[#a9b4cf]" role="status">Загрузка...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </PageLayout>
  )
}
