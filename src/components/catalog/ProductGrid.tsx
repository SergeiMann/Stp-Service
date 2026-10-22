'use client'

import { ProductImage } from './ProductImage'
import { useEffect, useRef, useState } from 'react'
import { Product } from '@/types'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/lib/utils'

export function ProductGrid({ products }: { products: Product[] }) {
  const { items, addItem, updateQuantity } = useCart()
  const { addToast } = useToast()
  const [preview, setPreview] = useState<Product | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [imageIndex, setImageIndex] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!preview) return
    setImageIndex(0)
    dialog.current?.showModal()
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = oldOverflow
    }
  }, [preview])

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
      <div className="flex justify-end gap-1 mb-4" role="group" aria-label="Вид каталога">
        {(['grid', 'list'] as const).map(mode => (
          <button key={mode} type="button" aria-pressed={view === mode} onClick={() => setView(mode)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${view === mode ? 'bg-white text-slate-900' : 'text-slate-200 hover:bg-white/10'}`}>
            {mode === 'grid' ? 'Карточки' : 'Список'}
          </button>
        ))}
      </div>
      <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8' : 'grid grid-cols-1 gap-3 mb-8'}>
        {products.map(product => {
          const quantity =
            items.find(item => item.product.id === product.id)?.quantity ?? 0
          return (
            <Card key={product.id} hover className={`h-full flex rounded-xl overflow-hidden text-slate-900 ${view === 'list' ? 'flex-col md:flex-row md:items-center' : 'flex-col'}`}>
              <CardHeader className={`p-5 ${view === 'list' ? 'md:flex-1 md:min-w-0' : ''}`}>
                <div className={`bg-white rounded-lg mb-4 flex items-center justify-center relative overflow-hidden ${view === 'list' ? 'h-20' : 'h-40'}`}>
                  <ProductImage
                    product={product}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <p className="text-xs font-medium text-slate-500 mb-2 truncate">{product.brand?.name || product.category.name}</p>
                <h3 className={`font-semibold text-base leading-6 break-words ${view === 'grid' ? 'min-h-[4.5rem]' : ''}`}>
                  <button type="button" className="text-left line-clamp-3 hover:text-blue-600 focus-visible:outline-blue-600" onClick={() => setPreview(product)} title={product.name}>{product.name}</button>
                </h3>
                <p className="text-xs text-slate-500 mt-3 break-all">{product.manufacturerPartNumber ? `Артикул: ${product.manufacturerPartNumber}` : `Код товара: ${product.sku}`}</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.shortDescription}
                </p>
              </CardHeader>

              <CardContent className={`p-5 pt-0 ${view === 'grid' ? 'flex-1' : 'md:w-56 md:pt-5 md:shrink-0'}`}>
                <p className={`text-xs font-medium mb-3 ${product.stock > 0 && product.isAvailable ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {product.stock > 0 && product.isAvailable ? `В наличии · ${product.stock} шт.` : 'Наличие уточняется'}
                </p>
                <div className="mb-3">
                  <span className="text-xl font-bold text-slate-900 tabular-nums">
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

              <CardFooter className={`p-4 bg-slate-50/70 ${view === 'list' ? 'md:w-64 md:shrink-0 md:border-t-0' : ''}`}>
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="px-3"
                    aria-label={`Просмотреть товар: ${product.name}`}
                    title="Просмотреть товар"
                    onClick={() => setPreview(product)}
                  >
                    <i aria-hidden="true" className="fas fa-arrow-right"></i>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
      {preview && (
        <dialog
          ref={dialog}
          aria-labelledby="product-preview-title"
          onCancel={() => setPreview(null)}
          onClick={event => {
            if (event.target === event.currentTarget) setPreview(null)
          }}
          className="w-[min(48rem,calc(100vw-2rem))] max-h-[90dvh] overflow-y-auto rounded-xl p-0 bg-white text-gray-900 backdrop:bg-black/60"
        >
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <h2
                id="product-preview-title"
                className="flex-1 text-xl font-semibold break-words"
              >
                {preview.name}
              </h2>
              <button
                type="button"
                autoFocus
                aria-label="Закрыть просмотр товара"
                onClick={() => setPreview(null)}
                className="shrink-0 h-10 w-10 rounded border border-gray-300 text-2xl hover:bg-gray-100"
              >
                ×
              </button>
            </div>
              <div className="relative h-64 mb-4 flex items-center justify-center">
                <ProductImage
                  product={preview}
                  imageIndex={imageIndex}
                  sizes="(max-width: 768px) 90vw, 720px"
                />
              </div>
            {preview.images.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Фотографии товара">
                {preview.images.map((src, index) => (
                  <button key={`${src}-${index}`} type="button" aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}
                    className={`px-3 py-2 rounded-lg border text-sm ${imageIndex === index ? 'border-blue-600 text-blue-600' : 'border-slate-200'}`}>Фото {index + 1}</button>
                ))}
              </div>
            )}
            <dl className="space-y-2 mb-4">
              <div><dt className="inline font-semibold">Категория: </dt><dd className="inline">{preview.category.name}</dd></div>
              <div>
                <dt className="inline font-semibold">Код товара: </dt>
                <dd className="inline break-words">{preview.sku}</dd>
              </div>
              {preview.manufacturerPartNumber && <div><dt className="inline font-semibold">Артикул производителя: </dt><dd className="inline break-all">{preview.manufacturerPartNumber}</dd></div>}
              {preview.brand && (
                <div>
                  <dt className="inline font-semibold">Бренд: </dt>
                  <dd className="inline">{preview.brand.name}</dd>
                </div>
              )}
              <div>
                <dt className="inline font-semibold">Наличие: </dt>
                <dd className="inline">{preview.stock > 0 && preview.isAvailable ? `${preview.stock} шт.` : 'Уточняется'}</dd>
              </div>
              {preview.minOrder > 1 && <div><dt className="inline font-semibold">Минимальный заказ: </dt><dd className="inline">{preview.minOrder} шт.</dd></div>}
            </dl>
            {preview.endUserRequired && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 mb-4">Для оформления заказа поставщику потребуются сведения о конечном покупателе.</p>}
            {preview.shortDescription && preview.shortDescription !== preview.description && <p className="text-slate-600 mb-4 whitespace-pre-wrap">{preview.shortDescription}</p>}
            {preview.description && (
              <p className="whitespace-pre-wrap break-words mb-4">
                {preview.description}
              </p>
            )}
            {preview.specifications.length > 0 && (
              <dl className="mb-6 divide-y rounded-lg bg-slate-50 px-4">
                {preview.specifications.map(spec => (
                  <div key={spec.id} className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4 text-sm">
                    <dt className="text-slate-500">{spec.group ? `${spec.group} · ` : ''}{spec.name}</dt>
                    <dd className="break-words">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {!preview.description && preview.specifications.length === 0 && <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-4 mb-6">Подробные характеристики пока не добавлены. Уточним совместимость и комплектацию при обработке заявки.</p>}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <strong className="text-2xl text-blue-600">
                {formatPrice(preview.price)}
              </strong>
              <Button onClick={() => handleAddToCart(preview)}>
                В корзину
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}
