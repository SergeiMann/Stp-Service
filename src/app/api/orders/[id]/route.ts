import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: {
    id: string
  }
}

// Получение конкретного заказа
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                images: true,
                category: {
                  select: { name: true }
                },
                brand: {
                  select: { name: true }
                }
              }
            }
          }
        }
      }
    })
    
    if (!order) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Заказ не найден' 
        },
        { status: 404 }
      )
    }
    
    const formattedOrder = {
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
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
        total: parseFloat(item.total.toString()),
        product: item.product
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: formattedOrder
    })
    
  } catch (error) {
    console.error('Order GET API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при получении заказа' 
      },
      { status: 500 }
    )
  }
}

// Обновление статуса заказа
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    const { status, notes } = body
    
    // Валидация статуса
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Некорректный статус заказа' 
        },
        { status: 400 }
      )
    }
    
    // Проверка существования заказа
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id }
    })
    
    if (!existingOrder) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Заказ не найден' 
        },
        { status: 404 }
      )
    }
    
    // Обновление заказа
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes: notes?.trim() || null })
      }
    })
    
    console.log('Заказ обновлен:', {
      id: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      newStatus: updatedOrder.status
    })
    
    return NextResponse.json({
      success: true,
      message: 'Заказ успешно обновлен',
      data: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        notes: updatedOrder.notes
      }
    })
    
  } catch (error) {
    console.error('Order PATCH API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при обновлении заказа' 
      },
      { status: 500 }
    )
  }
}

// Отмена заказа
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Проверка существования заказа
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          select: {
            productId: true,
            quantity: true
          }
        }
      }
    })
    
    if (!existingOrder) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Заказ не найден' 
        },
        { status: 404 }
      )
    }
    
    // Проверка возможности отмены
    if (['SHIPPED', 'DELIVERED'].includes(existingOrder.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Нельзя отменить отправленный или доставленный заказ' 
        },
        { status: 400 }
      )
    }
    
    // Отмена заказа в транзакции
    await prisma.$transaction(async (tx) => {
      // Возвращаем товары на склад
      for (const item of existingOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })
      }
      
      // Обновляем статус заказа
      await tx.order.update({
        where: { id: params.id },
        data: {
          status: 'CANCELLED'
        }
      })
    })
    
    console.log('Заказ отменен:', {
      id: existingOrder.id,
      orderNumber: existingOrder.orderNumber
    })
    
    return NextResponse.json({
      success: true,
      message: 'Заказ успешно отменен'
    })
    
  } catch (error) {
    console.error('Order DELETE API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при отмене заказа' 
      },
      { status: 500 }
    )
  }
}
