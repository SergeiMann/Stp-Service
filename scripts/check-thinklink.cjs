// Read-only connection check. Credentials and supplier response bodies are never logged.
const { loadEnvConfig } = require('@next/env')

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production')

const messages = {
  IP_FAILED: 'IP этой машины не разрешён в настройках API ThinkLink.',
  BAD_LOGIN: 'ThinkLink отклонил формат логина или токена.',
  AUTH_FAILED: 'ThinkLink отклонил логин или токен.',
  API_INACTIVE: 'API отключён в аккаунте ThinkLink.',
  MAX_REQUEST_MINUTE: 'Превышен минутный лимит запросов.',
  MAX_REQUEST_HOUR: 'Превышен часовой лимит запросов.',
  MAX_REQUEST_DAY: 'Превышен суточный лимит запросов.',
}

async function main() {
  const { THINKLINK_LOGIN: login, THINKLINK_TOKEN: token } = process.env
  if (!login || !token) {
    console.error('Задайте THINKLINK_LOGIN и THINKLINK_TOKEN в окружении приложения.')
    process.exitCode = 1
    return
  }

  const base = process.env.THINKLINK_API_BASE || 'https://thinklink.ru/api'
  const url = new URL(`${base.replace(/\/$/, '')}/catalog`)
  if (url.protocol !== 'https:') throw new Error('INSECURE_URL')
  url.search = new URLSearchParams({ login, token, page: '1' }).toString()
  const response = await fetch(url, { signal: AbortSignal.timeout(20000), redirect: 'error' })
  const data = await response.json()
  if (!response.ok || data.OperationStatus !== 'OK') {
    const message = messages[data.OperationStatus] || 'ThinkLink вернул ошибку или неожиданный ответ.'
    console.error(`HTTP ${response.status}. ${message}`)
    process.exitCode = 1
    return
  }
  if (!Array.isArray(data.Result?.data)) throw new Error('INVALID_RESPONSE')
  console.log(`Соединение с ThinkLink работает. Категорий на первой странице: ${data.Result.data.length}.`)
  console.log('Проверен только доступ к каталогу. Товары и заказы в базе не изменялись.')
}

main().catch(() => {
  console.error('Проверка не выполнена: проверьте HTTPS-адрес API, соединение и формат ответа ThinkLink.')
  process.exitCode = 1
})
