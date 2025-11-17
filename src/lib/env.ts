import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXTAUTH_SECRET: z.string().min(16, 'NEXTAUTH_SECRET слишком короткий').optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().optional(),
  ADMIN_API_KEY: z.string().optional(),
  PORT: z.string().optional(),
  BITRIX24_WEBHOOK_URL: z.string().url().optional(),
  BITRIX24_RESPONSIBLE_ID: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z
    .string()
    .transform((v) => (v ? Number(v) : undefined))
    .pipe(z.number().optional()),
  SMTP_SECURE: z
    .string()
    .transform((v) => (v ? v === 'true' || v === '1' : undefined))
    .pipe(z.boolean().optional()),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().default('site@stp-service.com'),
  CONTACT_TO: z.string().email().default('info@stp-service.com'),
})

export type AppEnv = z.infer<typeof envSchema>

export const env: AppEnv = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_API_KEY: process.env.ADMIN_API_KEY,
  PORT: process.env.PORT,
  BITRIX24_WEBHOOK_URL: process.env.BITRIX24_WEBHOOK_URL,
  BITRIX24_RESPONSIBLE_ID: process.env.BITRIX24_RESPONSIBLE_ID,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
  CONTACT_TO: process.env.CONTACT_TO,
})

export const isProd = env.NODE_ENV === 'production'


