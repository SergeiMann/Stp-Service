// Server-protected wrapper for Admin page
import { requireAdmin } from '@/lib/auth'
import AdminPageClient from './AdminPageClient'

export const dynamic = 'force-dynamic'

export default function AdminProtectedPage() {
  // Throws if not admin
  requireAdmin()
  // Render client component
  return <AdminPageClient />
}

// client UI moved to AdminPageClient
