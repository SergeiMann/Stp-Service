import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { inquirySchema, mergeInquiryItems } from '@/lib/order-inquiry'
import { randomUUID } from 'node:crypto'
import { sendPurchaseEmail } from '@/lib/mailer'

export const dynamic = 'force-dynamic'

// A callback inquiry records interest; it does not reserve supplier stock.
export async function POST(request: NextRequest) {
  const parsed = inquirySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message || 'Проверьте данные заявки' }, { status: 400 })
  }
  const body = parsed.data
  const items = mergeInquiryItems(body.items)
  if (items.some(item => item.quantity > 1000000)) {
    return NextResponse.json({ success: false, error: 'Слишком большое количество товара' }, { status: 400 })
  }
  try {
    const order = await prisma.$transaction(async tx => {
      const products = await tx.product.findMany({ where: { id: { in: items.map(item => item.productId) } } })
      if (products.length !== items.length) throw new Error('PRODUCT_NOT_FOUND')
      const rows = items.map(item => {
        const product = products.find(product => product.id === item.productId)!
        if (!Number.isFinite(product.price) || product.price <= 0) throw new Error('INVALID_PRICE')
        return { ...item, price: product.price, total: Math.round(product.price * item.quantity * 100) / 100 }
      })
      const total = Math.round(rows.reduce((sum, item) => sum + item.total, 0) * 100) / 100
      return tx.order.create({ data: {
        orderNumber: 'REQ-' + randomUUID().toUpperCase(),
        isInquiry: true,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail,
        company: body.company || null,
        notes: body.notes || null,
        total,
        status: 'PENDING',
        items: { create: rows },
      }, include: { items: { include: { product: { select: { name: true, sku: true } } } } } })
    })
    let emailSent = false
    try {
      await sendPurchaseEmail(order)
      emailSent = true
    } catch {
      console.error('Purchase email notification failed', { orderId: order.id })
    }
    return NextResponse.json({
      success: true,
      message: emailSent
        ? 'Заявка отправлена. Менеджер свяжется с вами по выбранным позициям.'
        : 'Заявка сохранена. Почтовое уведомление не отправлено, но заявка доступна менеджеру. Повторная отправка не требуется.',
      data: { orderId: order.id, orderNumber: order.orderNumber, total: order.total, status: order.status },
    })
  } catch (error) {
    if (error instanceof Error && ['PRODUCT_NOT_FOUND', 'INVALID_PRICE'].includes(error.message)) {
      return NextResponse.json({ success: false, error: 'Данные товаров изменились. Обновите корзину.' }, { status: 400 })
    }
    console.error('Inquiry save failed')
    return NextResponse.json({ success: false, error: 'Не удалось сохранить заявку. Попробуйте ещё раз.' }, { status: 500 })
  }
}

// Получение заказов (для админки и пользователей)
export async function GET(request: NextRequest) {
  const session = getSession()
  if (!session || !['ADMIN', 'MANAGER'].includes(session.role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const customerEmail = searchParams.get('customerEmail')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const where: any = {}
    
    // Фильтр по email клиента
    if (customerEmail) {
      where.customerEmail = customerEmail
    }
    
    // Фильтр по статусу
    if (status && status !== 'all') {
      where.status = status
    }
    
    // Подсчет общего количества заказов
    const totalOrders = await prisma.order.count({ where })
    
    // Получение заказов с позициями
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit,
    })
    
    // Форматирование данных
    const formattedOrders = orders.map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      isInquiry: order.isInquiry,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      company: order.company,
      total: parseFloat(order.total.toString()),
      status: order.status,
      deliveryMethod: order.deliveryMethod,
      deliveryAddress: order.deliveryAddress,
      paymentMethod: order.paymentMethod,
      notes: order.notes,
      items: order.items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
        total: parseFloat(item.total.toString()),
        product: item.product
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }))
    
    // Статистика пагинации
    const totalPages = Math.ceil(totalOrders / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return NextResponse.json({
      success: true,
      data: {
        orders: formattedOrders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          hasNextPage,
          hasPrevPage,
          limit
        }
      }
    })
    
  } catch (error) {
    console.error('Orders GET API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при получении заказов' 
      },
      { status: 500 }
    )
  }
}
