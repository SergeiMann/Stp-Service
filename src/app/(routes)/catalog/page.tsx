'use client'

import { useState } from 'react'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { CatalogSidebar } from '@/components/catalog/CatalogSidebar'
import { Button } from '@/components/ui/Button'
import { PageLayout } from '@/components/layout/PageLayout'

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | string[]>('all')
  const [selectedBrand, setSelectedBrand] = useState<string | string[]>('all')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleReset = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedBrand('all')
    setPriceRange({ min: 0, max: 200000 })
  }

  return (
    <PageLayout
      title="Каталог товаров"
      subtitle="Широкий ассортимент терминалов сбора данных, сканеров штрих-кода и принтеров этикеток"
      badge="Каталог оборудования"
      backgroundImage="/images/equipment/zebra_ds2208-hc.png"
    >
      <div className="container mx-auto px-4 py-16">
        {/* Mobile Search Bar */}
        <div className="lg:hidden bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-4"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="fas fa-filter mr-2"></i>
              Фильтры
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex gap-8">
          {/* Sidebar - только один */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <CatalogSidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onReset={handleReset}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
              <ProductGrid
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
                priceRange={priceRange}
              />
            </div>
          </div>
        </div>

        {/* Mobile Sidebar - отдельно */}
        {sidebarOpen && (
          <CatalogSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onReset={handleReset}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </PageLayout>
  )
}