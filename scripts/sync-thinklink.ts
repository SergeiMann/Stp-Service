import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production')

async function main() {
  const { syncThinkLinkToDb, ThinkLinkApiError } = await import('../src/lib/thinklink')
  const { prisma } = await import('../src/lib/prisma')
  const watch = process.argv.includes('--watch')
  try {
    do {
      try {
        const result = await syncThinkLinkToDb(message => console.log(message))
        console.log(new Date().toISOString(), JSON.stringify(result))
      } catch (error) {
        console.error(error instanceof ThinkLinkApiError ? error.message : 'Синхронизация не выполнена. Проверьте подключение к базе, настройки API и формат данных.')
        if (error instanceof Error) {
          // Only controlled validation text and machine codes, never request URLs or credentials.
          if (/^(Invalid|Incomplete|Empty) ThinkLink/.test(error.message)) console.error(error.message)
          const code = (error as Error & { code?: string }).code
          if (code && /^P\d{4}$/.test(code)) console.error('Database error:', code)
          if (error.name === 'PrismaClientValidationError') {
            console.error('Database validation:', error.message.split('\n').filter(line => /^(Argument|Unknown argument|Invalid value|Invalid argument|Expected)/.test(line.trim())).join('\n'))
          }
          const location = error.stack?.split('\n').find(line => /src[\\/]lib[\\/]thinklink\.ts:\d+/.test(line))
          if (location) console.error(location.trim())
        }
        if (!watch) process.exitCode = 1
      }
      if (watch) await new Promise(resolve => setTimeout(resolve, 60 * 60 * 1000))
    } while (watch)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(() => {
  console.error('Ошибка конфигурации ThinkLink или базы данных.')
  process.exitCode = 1
})
