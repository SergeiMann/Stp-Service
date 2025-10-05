import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { env, isProd } from '@/lib/env'

export type JwtPayload = {
  uid: string
  role: 'USER' | 'ADMIN' | 'MANAGER'
  email: string
}

const getSecret = () => env.NEXTAUTH_SECRET || 'CHANGE_ME_STRONG_SECRET'

export function signJwt(payload: JwtPayload, expiresIn: string | number = '7d') {
  return jwt.sign(payload, getSecret(), { expiresIn })
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getSecret()) as JwtPayload
  } catch {
    return null
  }
}

export function getSession(): JwtPayload | null {
  const cookieStore = cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null
  return verifyJwt(token)
}

export function requireAdmin(): JwtPayload {
  const session = getSession()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('FORBIDDEN')
  }
  return session
}


