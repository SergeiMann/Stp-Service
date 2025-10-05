// Server-protected wrapper for Admin page
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default function AdminProtectedPage() {
  // Throws if not admin
  requireAdmin()
  // Render client component
  return <AdminPageClient />
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

interface ContactRequest {
  id: string
  name: string
  phone: string
  email?: string
  company?: string
  message: string
  equipment?: string
  status: string
  createdAt: string
}

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  isAvailable: boolean
  category: {
    name: string
  }
  brand?: {
    name: string
  }
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  total: number
  status: string
  createdAt: string
  items: {
    id: string
    quantity: number
    price: number
    product: {
      name: string
    }
  }[]
}

function AdminPageClient() {
  const router = useRouter()
  const { user, loading: authLoading, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState<'requests' | 'products' | 'orders'>('requests')
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.push('/')
        return
      }
      loadData()
    }
  }, [authLoading, user, isAdmin, router])

  const loadData = async () => {
    setLoading(true)
    try {
      // Загружаем заявки
      const requestsRes = await fetch('/api/contact')
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json()
        setRequests(requestsData.data || [])
      }

      // Загружаем товары
      const productsRes = await fetch('/api/products?limit=50')
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.data?.products || [])
      }

      // Загружаем заказы
      const ordersRes = await fetch('/api/orders?limit=50')
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.data?.orders || [])
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const result = await response.json()
      
      if (result.success) {
        addToast('Статус заказа обновлен', 'success')
        // Обновляем локальное состояние
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        ))
      } else {
        addToast(result.error, 'error')
      }
    } catch (error) {
      addToast('Ошибка при обновлении статуса', 'error')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'PENDING': return 'bg-orange-100 text-orange-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800'
      case 'SHIPPED': return 'bg-purple-100 text-purple-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Ожидает'
      case 'CONFIRMED': return 'Подтвержден'
      case 'PROCESSING': return 'Обрабатывается'
      case 'SHIPPED': return 'Отправлен'
      case 'DELIVERED': return 'Доставлен'
      case 'CANCELLED': return 'Отменен'
      case 'NEW': return 'Новая'
      case 'IN_PROGRESS': return 'В работе'
      case 'COMPLETED': return 'Завершена'
      default: return status
    }
  }

  // Показываем загрузку авторизации
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Проверка доступа...</p>
          </div>
        </div>
      </div>
    )
  }

  // Проверяем права доступа
  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Доступ запрещен</h1>
          <p className="text-gray-600 mb-6">У вас нет прав для доступа к админ панели</p>
          <Button onClick={() => router.push('/')}>
            На главную
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка данных...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Админ панель</h1>
        <p className="text-gray-600">Управление заявками и товарами</p>
      </div>

      {/* Табы */}
      <div className="flex space-x-1 mb-8">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Заявки ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Товары ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Заказы ({orders.length})
        </button>
      </div>

      {/* Заявки */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Заявки обратной связи</h2>
            <Button onClick={loadData} variant="outline">
              Обновить
            </Button>
          </div>

          {requests.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Заявок пока нет</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {requests.map((request) => (
                <Card key={request.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{request.name}</h3>
                      <p className="text-gray-600">{request.phone}</p>
                      {request.email && (
                        <p className="text-gray-600">{request.email}</p>
                      )}
                      {request.company && (
                        <p className="text-sm text-gray-500">Компания: {request.company}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-800">{request.message}</p>
                    {request.equipment && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Оборудование:</span> {request.equipment}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Связаться
                    </Button>
                    <Button size="sm" variant="outline">
                      Отметить как обработанную
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Товары */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Управление товарами</h2>
            <div className="space-x-2">
              <Button onClick={loadData} variant="outline">
                Обновить
              </Button>
              <Button>
                Добавить товар
              </Button>
            </div>
          </div>

          {products.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Товаров пока нет</p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Товар
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Цена
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Остаток
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.category.name}
                            {product.brand && ` • ${product.brand.name}`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`${product.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isAvailable ? 'Доступен' : 'Недоступен'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button size="sm" variant="outline">
                          Редактировать
                        </Button>
                        <Button size="sm" variant="outline">
                          {product.isAvailable ? 'Скрыть' : 'Показать'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Заказы */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Управление заказами</h2>
            <Button onClick={loadData} variant="outline">
              Обновить
            </Button>
          </div>

          {orders.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Заказов пока нет</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Заказ #{order.orderNumber}</h3>
                      <p className="text-gray-600">{order.customerName}</p>
                      <p className="text-gray-600">{order.customerPhone}</p>
                      <p className="text-gray-600">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="text-lg font-bold text-blue-600 mt-1">
                        {order.total.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>

                  {/* Товары в заказе */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Товары:</h4>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.product.name}</span>
                          <span>{item.quantity} × {item.price.toLocaleString('ru-RU')} ₽</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Управление статусом */}
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'PENDING' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                        >
                          Подтвердить
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                        >
                          Отменить
                        </Button>
                      </>
                    )}
                    {order.status === 'CONFIRMED' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                      >
                        В обработку
                      </Button>
                    )}
                    {order.status === 'PROCESSING' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                      >
                        Отправить
                      </Button>
                    )}
                    {order.status === 'SHIPPED' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                      >
                        Доставлен
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
