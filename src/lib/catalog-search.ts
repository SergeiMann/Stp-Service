import { Prisma } from '@prisma/client'
import { prisma } from './prisma'

// Поиск по каталогу: запрос делится на слова, и каждое слово должно найтись
// в названии, артикуле, бренде или категории товара — в любом порядке.

// Как покупатели называют товары и бренды по-русски
const SYNONYMS: Record<string, string[]> = {
  тсд: ['терминал'],
  термопринтер: ['принтер'],
  штрихкод: ['штрих'],
  шк: ['штрих'],
  ибп: ['ибп', 'бесперебойн'],
  зебра: ['zebra'],
  // Symbol — прежняя марка сканеров Zebra (DS2208 и др.)
  zebra: ['zebra', 'symbol'],
  хонейвел: ['honeywell'],
  хонейвелл: ['honeywell'],
  ханивел: ['honeywell'],
  ханивелл: ['honeywell'],
  даталоджик: ['datalogic'],
  датаоджик: ['datalogic'],
  урово: ['urovo'],
  циско: ['cisco'],
  ньюленд: ['newland'],
  биксолон: ['bixolon'],
  сато: ['sato'],
  мертех: ['mertech'],
  санми: ['sunmi'],
  сунми: ['sunmi'],
  годекс: ['godex'],
  ципхерлаб: ['cipherlab'],
  сайферлаб: ['cipherlab'],
}

// Окончания русских слов: «принтеры», «сканеров», «этикетки» ищутся по основе
const ENDINGS = ['ами', 'ями', 'ого', 'его', 'ому', 'ему', 'ов', 'ев', 'ей', 'ам', 'ям', 'ах', 'ях', 'ой', 'ый', 'ий', 'ая', 'яя', 'ое', 'ее', 'ые', 'ие', 'ую', 'юю', 'ом', 'ем', 'а', 'я', 'ы', 'и', 'у', 'ю', 'е', 'о', 'ь']

function stem(word: string) {
  if (!/^[а-яё]+$/.test(word) || word.length < 5) return word
  for (const ending of ENDINGS) {
    if (word.endsWith(ending) && word.length - ending.length >= 4) return word.slice(0, -ending.length)
  }
  return word
}

// % и _ в запросе — обычные символы, а не шаблоны LIKE
export const escapeLike = (value: string) => value.replace(/[\\%_]/g, '\\$&')

/** Название бренда из запроса: «зебра» → «zebra»; null — запрос не похож на бренд */
export function brandQuery(query: string): string | null {
  const q = query.trim().toLowerCase().replace(/ё/g, 'е')
  if (!/[\p{L}\p{N}]/u.test(q)) return null
  const latin = SYNONYMS[q]?.[0]
  return latin && /^[a-z]/.test(latin) ? latin : q
}

function variants(token: string) {
  const plain = token.replace(/ё/g, 'е')
  const list = new Set([stem(plain), ...(SYNONYMS[plain] ?? [])])
  // В названиях встречается и «ё», и «е»
  for (const v of [...list]) if (v.includes('е')) list.add(v.replace(/е/g, 'ё'))
  return [...list]
}

function fieldsContain(value: string): Prisma.ProductWhereInput[] {
  const contains = { contains: escapeLike(value), mode: 'insensitive' as const }
  return [
    { name: contains },
    { sku: contains },
    { manufacturerPartNumber: contains },
    { brand: { name: contains } },
    { category: { name: contains } },
  ]
}

const compact = (value: string) => value.toLowerCase().replace(/[^a-z0-9а-яё]/g, '')

// Артикулы пишут по-разному: «DS2208SR», «ds2208-sr», «DS2208 SR».
// Сравниваем без пробелов, дефисов и точек.
async function codeMatches(code: string): Promise<string[]> {
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM products
    WHERE regexp_replace(lower(name || ' ' || sku || ' ' || coalesce("manufacturerPartNumber", '')), '[^a-z0-9а-яё]', '', 'g')
      LIKE ${'%' + escapeLike(code) + '%'}
    LIMIT 2000`
  return rows.map(row => row.id)
}

export function searchTokens(query: string) {
  return query
    .toLowerCase()
    .split(/[\s,;/]+/)
    .map(t => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter(t => t.length > 1 || /\d/.test(t))
}

/** Условие поиска для Prisma; null — в запросе нет слов, по которым можно искать */
export async function searchWhere(query: string): Promise<Prisma.ProductWhereInput | null> {
  const tokens = searchTokens(query)
  if (!tokens.length) return null

  const parts: Prisma.ProductWhereInput[] = []
  // Весь запрос целиком — артикул, написанный с пробелами («DS2208 SR»)
  const whole = compact(query)
  const wholeIds = tokens.length > 1 && /\d/.test(whole) && whole.length >= 5 ? await codeMatches(whole) : []

  for (const token of tokens) {
    const or = variants(token).flatMap(fieldsContain)
    const code = compact(token)
    if (/\d/.test(code) && /[a-zа-я]/.test(code) && code.length >= 4) {
      const ids = await codeMatches(code)
      if (ids.length) or.push({ id: { in: ids } })
    }
    parts.push({ OR: or })
  }

  const byWords: Prisma.ProductWhereInput = { AND: parts }
  return wholeIds.length ? { OR: [byWords, { id: { in: wholeIds } }] } : byWords
}
