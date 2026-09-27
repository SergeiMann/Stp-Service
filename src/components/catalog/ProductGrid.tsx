'use client'

import Image from 'next/image'
import { Product } from '@/types'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/lib/utils'

export function ProductGrid({ products }: { products: Product[] }) {
  const { items, addItem, updateQuantity } = useCart()
  const { addToast } = useToast()

  const handleAddToCart = (product: Product) => {
    addItem(product)
    addToast(`${product.name} добавлен в корзину`, 'success', 3000)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-100 mb-4">Товары не найдены</div>
        <p className="text-sm text-slate-300">
          Попробуйте изменить параметры поиска или фильтры
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
        {products.map(product => {
          const quantity =
            items.find(item => item.product.id === product.id)?.quantity ?? 0
          return (
            <Card key={product.id} hover className="h-full flex flex-col">
              <CardHeader className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="text-gray-400">
                      <i className="fas fa-image text-4xl"></i>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              </CardHeader>

              <CardContent className="flex-1 p-4 pt-0">
                <p className="text-sm text-green-700 mb-2">
                  Остаток: {product.stock} шт.
                </p>
                <div className="mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-slate-300 line-through ml-2">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </div>

                {product.specifications &&
                  product.specifications.length > 0 && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {product.specifications.slice(0, 3).map((spec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-1">✓</span>
                          {spec.name}: {spec.value}
                        </li>
                      ))}
                    </ul>
                  )}
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <div className="flex gap-2 w-full">
                  {quantity > 0 ? (
                    <div
                      role="group"
                      aria-label={`Количество в корзине: ${product.name}`}
                      className="flex flex-1 items-center justify-between gap-2"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-11 w-11 shrink-0 px-0"
                        aria-label={`Уменьшить количество: ${product.name}`}
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                      >
                        −
                      </Button>
                      <span
                        aria-live="polite"
                        aria-atomic="true"
                        className="text-center text-sm text-gray-900"
                      >
                        В корзине{' '}
                        <strong className="block tabular-nums">
                          {quantity} шт.
                        </strong>
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-11 w-11 shrink-0 px-0"
                        aria-label={`Увеличить количество: ${product.name}`}
                        onClick={() => addItem(product)}
                      >
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 min-h-11"
                      size="sm"
                    >
                      <i className="fas fa-cart-plus mr-2"></i>В корзину
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="px-3">
                    <i className="fas fa-eye"></i>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
