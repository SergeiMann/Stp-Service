'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Вход для сотрудников</h1>
      <form className="space-y-4" onSubmit={async event => {
        event.preventDefault()
        setBusy(true)
        setError('')
        try {
          if (!await login(email.trim(), undefined, undefined, password)) {
            setError('Не удалось войти. Проверьте email и пароль.')
            return
          }
          const response = await fetch('/api/auth/me')
          const result = await response.json()
          if (!['ADMIN', 'MANAGER'].includes(result.data?.user?.role)) {
            setError('Для доступа нужна учётная запись сотрудника.')
            return
          }
          router.replace('/admin')
        } catch {
          setError('Не удалось войти. Попробуйте ещё раз.')
        } finally {
          setBusy(false)
        }
      }}>
        <label className="block">Email
          <input type="email" required autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} className="w-full border rounded p-2 mt-1" />
        </label>
        <label className="block">Пароль
          <input type="password" required autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="w-full border rounded p-2 mt-1" />
        </label>
        {error && <p role="alert" className="text-red-700">{error}</p>}
        <Button type="submit" disabled={busy}>{busy ? 'Вход…' : 'Войти'}</Button>
      </form>
    </div>
  )
}
