'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/lib/utils'

interface ProductGridProps {
  searchQuery?: string
  selectedCategory?: string | string[]
  selectedBrand?: string | string[]
  priceRange?: { min: number; max: number }
}

interface ApiResponse {
  success: boolean
  data: {
    products: Product[]
    pagination: {
      currentPage: number
      totalPages: number
      totalProducts: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

export function ProductGrid({ searchQuery, selectedCategory, selectedBrand, priceRange }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<ApiResponse['data']['pagination'] | null>(null)
  
  const { addItem } = useCart()
  const { addToast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, selectedCategory, selectedBrand, priceRange, currentPage])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      
      if (searchQuery) params.append('search', searchQuery)
      
      // Обработка множественного выбора категорий
      if (selectedCategory && selectedCategory !== 'all') {
        const categoryIds = Array.isArray(selectedCategory) 
          ? selectedCategory.join(',') 
          : selectedCategory
        params.append('category', categoryIds)
      }
      
      // Обработка множественного выбора брендов
      if (selectedBrand && selectedBrand !== 'all') {
        const brandIds = Array.isArray(selectedBrand) 
          ? selectedBrand.join(',') 
          : selectedBrand
        params.append('brand', brandIds)
      }
      
      // Добавляем фильтр по цене
      if (priceRange && priceRange.min !== undefined && priceRange.max !== undefined) {
        params.append('minPrice', priceRange.min.toString())
        params.append('maxPrice', priceRange.max.toString())
      }
      
      params.append('page', currentPage.toString())
      params.append('limit', '12')
      
      const response = await fetch(`/api/products?${params.toString()}`)
      const result: ApiResponse = await response.json()
      
      if (result.success) {
        setProducts(result.data.products)
        setPagination(result.data.pagination)
      } else {
        setError('Ошибка при загрузке товаров')
      }
    } catch (err) {
      setError('Ошибка сети при загрузке товаров')
      console.error('Products fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem(product)
    addToast(`${product.name} добавлен в корзину`, 'success', 3000)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse h-full">
            <CardHeader className="p-4">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-5 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-6 bg-gray-200 rounded mb-3 w-1/2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="flex gap-2 w-full">
                <div className="h-9 bg-gray-200 rounded flex-1"></div>
                <div className="h-9 w-12 bg-gray-200 rounded"></div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={fetchProducts}>Попробовать снова</Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">Товары не найдены</div>
        <p className="text-sm text-gray-500">
          Попробуйте изменить параметры поиска или фильтры
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
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
              <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            </CardHeader>
            
            <CardContent className="flex-1 p-4 pt-0">
              <div className="mb-3">
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
              
              {product.specifications && product.specifications.length > 0 && (
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
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="flex-1"
                  size="sm"
                >
                  <i className="fas fa-cart-plus mr-2"></i>
                  В корзину
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="px-3"
                >
                  <i className="fas fa-eye"></i>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasPrevPage}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            <i className="fas fa-chevron-left mr-2"></i>
            Назад
          </Button>
          
          <span className="text-sm text-gray-600">
            Страница {pagination.currentPage} из {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasNextPage}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Далее
            <i className="fas fa-chevron-right ml-2"></i>
          </Button>
        </div>
      )}
      
      {pagination && (
        <div className="text-center mt-4 text-sm text-gray-500">
          Найдено товаров: {pagination.totalProducts}
        </div>
      )}
    </div>
  )
}
