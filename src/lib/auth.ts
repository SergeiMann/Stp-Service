import jwt from 'jsonwebtoken'
import type { SignOptions, Secret } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

export type JwtPayload = {
  uid: string
  role: 'USER' | 'ADMIN' | 'MANAGER'
  email: string
}

const getSecret = (): Secret => (env.NEXTAUTH_SECRET || 'CHANGE_ME_STRONG_SECRET') as Secret

export function signJwt(payload: JwtPayload, expiresIn: string | number = '7d') {
  const options: SignOptions = {}
  ;(options as any).expiresIn = expiresIn as any
  return jwt.sign(payload, getSecret(), options)
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


