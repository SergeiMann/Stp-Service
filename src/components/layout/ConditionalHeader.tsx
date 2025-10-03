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
    '/catalog'
  ]
  
  // Проверяем точное совпадение или начало пути для каталога
  const hasBuiltInHeader = pagesWithBuiltInHeader.some(page => 
    pathname === page || (page === '/catalog' && pathname.startsWith('/catalog'))
  )
  
  // Не показываем хедер на страницах с встроенным хедером
  if (hasBuiltInHeader) {
    return null
  }
  
  return <Header />
}
