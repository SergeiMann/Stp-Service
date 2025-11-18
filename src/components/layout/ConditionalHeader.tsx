'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'

export function ConditionalHeader() {
  const pathname = usePathname()
  
  // Страницы, которые используют PageLayout со встроенным хедером
  const pagesWithBuiltInHeader = [
    '/',
    '/about',
    '/services', 
    '/contacts',
    '/catalog',
    '/inlocker',
    '/privacy',
  ]
  
  // Проверяем точное совпадение или начало пути для каталога (учитываем возможный null)
  const hasBuiltInHeader = pathname
    ? pagesWithBuiltInHeader.some(page => pathname === page || (page === '/catalog' && pathname.startsWith('/catalog')))
    : false
  
  // Не показываем хедер на страницах с встроенным хедером
  if (hasBuiltInHeader) {
    return null
  }
  
  return <Header />
}
