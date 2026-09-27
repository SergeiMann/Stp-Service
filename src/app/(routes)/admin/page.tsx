// Server-protected wrapper for Admin page
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminPageClient from './AdminPageClient'

export const dynamic = 'force-dynamic'

export default function AdminProtectedPage() {
  if (!['ADMIN', 'MANAGER'].includes(getSession()?.role || '')) redirect('/admin/login')
  // Render client component
  return <AdminPageClient />
}

// client UI moved to AdminPageClient
