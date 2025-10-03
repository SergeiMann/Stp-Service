'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { Modal } from './Modal'
import { Button } from './Button'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const router = useRouter()
  const { items, total, updateQuantity, removeItem } = useCart()

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Корзина"
      className="max-w-2xl"
    >
      {items.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-shopping-cart text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Корзина пуста</h3>
          <p className="text-gray-500 mb-6">Добавьте товары из каталога</p>
          <Button onClick={() => {
            onClose()
            router.push('/catalog')
          }}>
            Перейти в каталог
          </Button>
        </div>
      ) : (
        <div>
          {/* Список товаров */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                {/* Изображение товара */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  {item.product.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="fas fa-image text-gray-400"></i>
                    </div>
                  )}
                </div>

                {/* Информация о товаре */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {item.product.sku}
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    {item.product.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>

                {/* Количество */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-minus text-xs text-gray-600"></i>
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-plus text-xs text-gray-600"></i>
                  </button>
                </div>

                {/* Сумма за товар */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                  </p>
                </div>

                {/* Кнопка удаления */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Удалить из корзины"
                >
                  <i className="fas fa-trash text-sm"></i>
                </button>
              </div>
            ))}
          </div>

          {/* Итого */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Итого:</span>
              <span className="text-xl font-bold text-blue-600">
                {total.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            {/* Кнопки действий */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  onClose()
                  router.push('/catalog')
                }}
                className="flex-1"
              >
                Продолжить покупки
              </Button>
              <Button
                onClick={handleCheckout}
                className="flex-1"
              >
                Оформить заказ
              </Button>
            </div>
          </div>

          {/* Информация */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              <i className="fas fa-info-circle mr-1"></i>
              Товары резервируются на 30 минут. Для оформления заказа заполните контактную информацию.
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}
