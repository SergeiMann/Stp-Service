import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface OrderData {
  customerName: string
  customerEmail: string
  customerPhone: string
  company?: string
  deliveryMethod?: string
  deliveryAddress?: string
  paymentMethod?: string
  notes?: string
  items: {
    productId: string
    quantity: number
    price: number
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderData = await request.json()
    
    // Валидация обязательных полей
    if (!body.customerName || !body.customerEmail || !body.customerPhone || !body.items?.length) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Заполните все обязательные поля и добавьте товары в заказ' 
        },
        { status: 400 }
      )
    }
    
    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.customerEmail)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Некорректный формат email' 
        },
        { status: 400 }
      )
    }
    
    // Валидация телефона
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
    if (!phoneRegex.test(body.customerPhone)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Некорректный формат телефона' 
        },
        { status: 400 }
      )
    }
    
    // Проверка существования товаров и расчет общей суммы
    let totalAmount = 0
    const validatedItems: Array<{
      productId: string
      quantity: number
      price: number
      total: number
    }> = []
    
    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true, price: true, stock: true, isAvailable: true }
      })
      
      if (!product || !product.isAvailable) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Товар с ID ${item.productId} недоступен` 
          },
          { status: 400 }
        )
      }
      
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Недостаточно товара "${product.name}" на складе. Доступно: ${product.stock}` 
          },
          { status: 400 }
        )
      }
      
      const itemTotal = parseFloat(product.price.toString()) * item.quantity
      totalAmount += itemTotal
      
      validatedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: parseFloat(product.price.toString()),
        total: itemTotal
      })
    }
    
    // Генерация номера заказа
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    
    // Создание заказа в транзакции
    const order = await prisma.$transaction(async (tx: any) => {
      // Создаем заказ
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: body.customerName.trim(),
          customerEmail: body.customerEmail.trim(),
          customerPhone: body.customerPhone.trim(),
          company: body.company?.trim() || null,
          total: totalAmount,
          deliveryMethod: body.deliveryMethod || null,
          deliveryAddress: body.deliveryAddress?.trim() || null,
          paymentMethod: body.paymentMethod || null,
          notes: body.notes?.trim() || null,
          status: 'PENDING'
        }
      })
      
      // Создаем позиции заказа
      for (const item of validatedItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.total
          }
        })
        
        // Уменьшаем остаток товара
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }
      
      return newOrder
    })
    
    // Логирование
    console.log('Новый заказ создан:', {
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.customerName,
      total: order.total,
      itemsCount: validatedItems.length
    })
    
    return NextResponse.json({
      success: true,
      message: 'Заказ успешно оформлен! Мы свяжемся с вами для подтверждения.',
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: totalAmount,
        status: 'PENDING'
      }
    })
    
  } catch (error) {
    console.error('Orders API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при создании заказа. Попробуйте еще раз.' 
      },
      { status: 500 }
    )
  }
}

// Получение заказов (для админки и пользователей)
export async function GET(request: NextRequest) {
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
