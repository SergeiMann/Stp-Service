export const SITE_CONFIG = {
  name: 'STP-Service',
  tagline: 'Ремонт торгового оборудования',
  description: 'Профессиональный ремонт и обслуживание торгового оборудования',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000',
  phone: '+7 (495) 255-08-54',
  email: 'info@stp-service.com',
  address: 'г. Москва',
  workingHours: 'Пн-Пт: 9:00-18:00',
} as const

export const API_ROUTES = {
  products: '/api/products',
  categories: '/api/categories',
  brands: '/api/brands',
  orders: '/api/orders',
  contact: '/api/contact',
  callback: '/api/callback',
  repair: '/api/repair',
  rental: '/api/rental',
  search: '/api/search',
} as const

export const ROUTES = {
  home: '/',
  products: '/products',
  catalog: '/catalog',
  software: '/software',
  parts: '/parts',
  repair: '/repair',
  rental: '/rental',
  services: '/services',
  about: '/about',
  contacts: '/contacts',
} as const

export const PAGINATION = {
  defaultLimit: 12,
  maxLimit: 48,
} as const

export const PRODUCT_STATUS = {
  available: 'В наличии',
  outOfStock: 'Нет в наличии',
  onOrder: 'Под заказ',
  discontinued: 'Снят с производства',
} as const

export const ORDER_STATUSES = {
  PENDING: 'Ожидает обработки',
  CONFIRMED: 'Подтвержден',
  PROCESSING: 'В обработке',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменен',
} as const