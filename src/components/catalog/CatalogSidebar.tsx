'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'

interface Category {
  id: string
  name: string
  slug: string
  children?: Category[]
}

interface Brand {
  id: string
  name: string
  logo: string
}

interface CatalogSidebarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string | string[]
  setSelectedCategory: (category: string | string[]) => void
  selectedBrand: string | string[]
  setSelectedBrand: (brand: string | string[]) => void
  priceRange?: { min: number; max: number }
  setPriceRange?: (range: { min: number; max: number }) => void
  onReset: () => void
  isOpen?: boolean
  onClose?: () => void
}

export function CatalogSidebar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  priceRange: externalPriceRange,
  setPriceRange: setExternalPriceRange,
  onReset,
  isOpen = true,
  onClose
}: CatalogSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [localPriceRange, setLocalPriceRange] = useState({ min: 0, max: 200000 })
  const [actualPriceRange, setActualPriceRange] = useState({ min: 0, max: 200000 })
  const [tempSearchQuery, setTempSearchQuery] = useState(searchQuery)
  
  // Используем внешний priceRange если передан, иначе локальный
  const priceRange = externalPriceRange || localPriceRange
  const setPriceRange = setExternalPriceRange || setLocalPriceRange
  const [inStock, setInStock] = useState(false)
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    fetchFilters()
  }, [])

  useEffect(() => {
    setTempSearchQuery(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    fetchPriceRange()
  }, [selectedCategory, selectedBrand, searchQuery])

  const fetchFilters = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/brands')
      ])
      
      const categoriesData = await categoriesRes.json()
      const brandsData = await brandsRes.json()
      
      if (categoriesData.success) setCategories(categoriesData.data)
      if (brandsData.success) setBrands(brandsData.data)
    } catch (error) {
      console.error('Error fetching filters:', error)
    }
  }

  const fetchPriceRange = async () => {
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
      
      const response = await fetch(`/api/products/price-range?${params.toString()}`)
      const result = await response.json()
      
      if (result.success) {
        const newRange = {
          min: result.data.minPrice || 0,
          max: result.data.maxPrice || 200000
        }
        setActualPriceRange(newRange)
        
        // Устанавливаем диапазон цен в границы найденных товаров
        setPriceRange({
          min: newRange.min,
          max: newRange.max
        })
      }
    } catch (error) {
      console.error('Error fetching price range:', error)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleReset = () => {
    setPriceRange({ min: actualPriceRange.min, max: actualPriceRange.max })
    setInStock(false)
    setIsNew(false)
    setTempSearchQuery('')
    onReset()
  }

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSearchQuery(tempSearchQuery)
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    if (Array.isArray(selectedCategory)) {
      const newSelection = selectedCategory.includes(categoryId)
        ? selectedCategory.filter(id => id !== categoryId)
        : [...selectedCategory, categoryId]
      setSelectedCategory(newSelection.length === 0 ? 'all' : newSelection)
    } else {
      setSelectedCategory(categoryId === selectedCategory ? 'all' : [categoryId])
    }
  }

  const handleBrandChange = (brandId: string) => {
    if (Array.isArray(selectedBrand)) {
      const newSelection = selectedBrand.includes(brandId)
        ? selectedBrand.filter(id => id !== brandId)
        : [...selectedBrand, brandId]
      setSelectedBrand(newSelection.length === 0 ? 'all' : newSelection)
    } else {
      setSelectedBrand(brandId === selectedBrand ? 'all' : [brandId])
    }
  }

  const isCategorySelected = (categoryId: string) => {
    return Array.isArray(selectedCategory) 
      ? selectedCategory.includes(categoryId)
      : selectedCategory === categoryId
  }

  const isBrandSelected = (brandId: string) => {
    return Array.isArray(selectedBrand) 
      ? selectedBrand.includes(brandId)
      : selectedBrand === brandId
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 bg-white/10 backdrop-blur-sm border-r border-white/20 z-50 lg:z-auto
        transform transition-transform duration-300 lg:transform-none overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Фильтры</h2>
            {onClose && (
              <button 
                onClick={onClose}
                className="lg:hidden text-white hover:text-gray-300"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Поиск товаров
            </label>
            <form onSubmit={handleSearchSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Введите название..."
                  value={tempSearchQuery}
                  onChange={(e) => setTempSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full px-4 py-2 pl-10 pr-12 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300 backdrop-blur-sm"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"></i>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                >
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Категории</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategory === 'all'}
                  onChange={() => setSelectedCategory('all')}
                  className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-300">Все категории</span>
              </label>
              
              {categories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isCategorySelected(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-gray-300">{category.name}</span>
                    </label>
                    {category.children && category.children.length > 0 && (
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-2 text-gray-300 hover:text-white"
                      >
                        <i className={`fas fa-chevron-${expandedCategories.includes(category.id) ? 'down' : 'right'} text-sm`}></i>
                      </button>
                    )}
                  </div>
                  
                  {/* Subcategories */}
                  {category.children && expandedCategories.includes(category.id) && (
                    <div className="ml-6 mt-2 space-y-2">
                      {category.children.map((subcategory) => (
                        <label key={subcategory.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isCategorySelected(subcategory.id)}
                            onChange={() => handleCategoryChange(subcategory.id)}
                            className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-gray-400 text-sm">{subcategory.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Бренды</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrand === 'all'}
                  onChange={() => setSelectedBrand('all')}
                  className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-300">Все бренды</span>
              </label>
              
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBrandSelected(brand.id)}
                    onChange={() => handleBrandChange(brand.id)}
                    className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center flex-shrink-0">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm text-gray-300">{brand.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Цена, ₽</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-300">
                <span>{priceRange.min.toLocaleString()} ₽</span>
                <span>{priceRange.max.toLocaleString()} ₽</span>
              </div>
              
              <div className="relative h-8">
                {/* Background track */}
                <div className="absolute top-3 w-full h-2 bg-gray-600 rounded-lg"></div>
                
                {/* Active range */}
                <div 
                  className="absolute top-3 h-2 bg-blue-500 rounded-lg"
                  style={{
                    left: actualPriceRange.max > actualPriceRange.min 
                      ? `${((priceRange.min - actualPriceRange.min) / (actualPriceRange.max - actualPriceRange.min)) * 100}%`
                      : '0%',
                    width: actualPriceRange.max > actualPriceRange.min 
                      ? `${((priceRange.max - priceRange.min) / (actualPriceRange.max - actualPriceRange.min)) * 100}%`
                      : '100%'
                  }}
                />
                
                {/* Min range slider */}
                <input
                  type="range"
                  min={actualPriceRange.min}
                  max={actualPriceRange.max}
                  step="1000"
                  value={priceRange.min}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value)
                    if (newMin <= priceRange.max) {
                      setPriceRange({ ...priceRange, min: newMin })
                    }
                  }}
                  className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer slider-thumb z-10"
                  style={{ top: '12px' }}
                />
                
                {/* Max range slider */}
                <input
                  type="range"
                  min={actualPriceRange.min}
                  max={actualPriceRange.max}
                  step="1000"
                  value={priceRange.max}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value)
                    if (newMax >= priceRange.min) {
                      setPriceRange({ ...priceRange, max: newMax })
                    }
                  }}
                  className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer slider-thumb z-10"
                  style={{ top: '12px' }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="От"
                  min={actualPriceRange.min}
                  max={actualPriceRange.max}
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || actualPriceRange.min })}
                  className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300 backdrop-blur-sm text-sm"
                />
                <input
                  type="number"
                  placeholder="До"
                  min={actualPriceRange.min}
                  max={actualPriceRange.max}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || actualPriceRange.max })}
                  className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300 backdrop-blur-sm text-sm"
                />
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Дополнительно</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-300">В наличии</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-300">Новинки</span>
              </label>
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4 border-t border-white/20">
            <Button
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              onClick={handleReset}
            >
              <i className="fas fa-undo mr-2"></i>
              Сбросить все фильтры
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
