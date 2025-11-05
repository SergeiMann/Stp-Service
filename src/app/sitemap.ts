import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

// Генерируем в рантайме, чтобы не требовать БД на этапе build
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url

  // Статические страницы
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Динамические страницы категорий (пропускаем на build, если нет DATABASE_URL)
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    if (process.env.DATABASE_URL) {
      const categories = await prisma.category.findMany({
        select: { slug: true, updatedAt: true, isActive: true },
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      })
      categoryPages = categories.map((c) => ({
        url: `${baseUrl}/catalog/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch {
    // тихо игнорируем ошибки БД при генерации sitemap
  }

  return [
    ...staticPages,
    ...categoryPages,
  ]
}
