// Основные типы продуктов
export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  sku: string
  price: number
  oldPrice?: number
  isNew: boolean
  isFeatured: boolean
  isAvailable: boolean
  stock: number
  minOrder: number
  weight?: number
  dimensions?: ProductDimensions
  images: string[]
  category: Category
  brand?: Brand
  specifications: ProductSpecification[]
  tags: ProductTag[]
  seoTitle?: string
  seoDescription?: string
  seoKeywords: string[]
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface ProductDimensions {
  length: number
  width: number
  height: number
}

export interface ProductSpecification {
  id: string
  name: string
  value: string
  group?: string
  sortOrder: number
}

export interface ProductTag {
  id: string
  name: string
  slug: string
  color?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  parent?: Category
  children?: Category[]
  productsCount?: number
  sortOrder: number
  isActive: boolean
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
  description?: string
  website?: string
  productsCount?: number
  isActive: boolean
}

// Корзина
export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemsCount: number
}

// Заказы
export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  company?: string
  total: number
  status: OrderStatus
  paymentMethod?: string
  deliveryMethod?: string
  deliveryAddress?: string
  notes?: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  product: Product
  quantity: number
  price: number
  total: number
}

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

// Формы
export interface ContactFormData {
  name: string
  email: string
  phone: string
  company?: string
  message: string
}

export interface CallbackFormData {
  name: string
  phone: string
  message?: string
}

// SEO и общие типы
export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
}

export interface CompanyInfo {
  name: string
  description: string
  phone: string
  email: string
  address: string
  workingHours: string
  socialLinks: {
    vk?: string
    telegram?: string
    whatsapp?: string
  }
}
