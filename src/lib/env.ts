import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXTAUTH_SECRET: z.string().min(16, 'NEXTAUTH_SECRET слишком короткий').optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().optional(),
  ADMIN_API_KEY: z.string().optional(),
  PORT: z.string().optional(),
})

export type AppEnv = z.infer<typeof envSchema>

export const env: AppEnv = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_API_KEY: process.env.ADMIN_API_KEY,
  PORT: process.env.PORT,
})

export const isProd = env.NODE_ENV === 'production'


