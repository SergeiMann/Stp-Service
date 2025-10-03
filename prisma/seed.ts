import { PrismaClient } from '@prisma/client'
import { productCategories as categories } from '../src/data/categories'
import { popularBrands as brands } from '../src/data/brands'
import { sampleProducts as products } from '../src/data/products'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Очистка существующих данных
  console.log('🧹 Очистка существующих данных...')
  await prisma.productTagRelation.deleteMany()
  await prisma.productSpecification.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.contactRequest.deleteMany()
  await prisma.product.deleteMany()
  await prisma.productTag.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Создание категорий
  console.log('📂 Создание категорий...')
  const categoryMap = new Map<string, string>()
  
  for (const category of categories) {
    const created = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
      },
    })
    categoryMap.set(category.id, created.id)
  }

  // Создание брендов
  console.log('🏷️ Создание брендов...')
  const brandMap = new Map<string, string>()
  
  for (const brand of brands) {
    const created = await prisma.brand.create({
      data: {
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brand.description,
        website: brand.website,
        isActive: brand.isActive,
      },
    })
    brandMap.set(brand.id, created.id)
  }

  // Создание товаров
  console.log('📦 Создание товаров...')
  
  for (const product of products) {
    const categoryId = categoryMap.get(product.category.id)
    const brandId = product.brand ? brandMap.get(product.brand.id) : null

    if (!categoryId) {
      console.warn(`⚠️ Категория не найдена для товара ${product.name}`)
      continue
    }

    const created = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        sku: product.sku,
        price: product.price,
        oldPrice: product.oldPrice,
        isNew: product.isNew,
        isFeatured: product.isFeatured,
        isAvailable: product.isAvailable,
        stock: product.stock,
        minOrder: product.minOrder,
        weight: product.weight,
        dimensions: product.dimensions as any,
        images: JSON.stringify(product.images),
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        seoKeywords: Array.isArray(product.seoKeywords) ? product.seoKeywords.join(', ') : product.seoKeywords,
        viewCount: product.viewCount,
        categoryId,
        brandId,
      },
    })

    // Создание характеристик товара
    if (product.specifications?.length > 0) {
      await prisma.productSpecification.createMany({
        data: product.specifications.map((spec: any) => ({
          name: spec.name,
          value: spec.value,
          group: spec.group,
          sortOrder: spec.sortOrder,
          productId: created.id,
        })),
      })
    }
  }

  // Создание тестовых тегов
  console.log('🏷️ Создание тегов...')
  const tags = [
    { name: 'Новинка', slug: 'new', color: '#10B981' },
    { name: 'Хит продаж', slug: 'bestseller', color: '#F59E0B' },
    { name: 'Акция', slug: 'sale', color: '#EF4444' },
    { name: 'Рекомендуем', slug: 'recommended', color: '#8B5CF6' },
  ]

  for (const tag of tags) {
    await prisma.productTag.create({
      data: tag,
    })
  }

  // Создание тестовой заявки
  console.log('📞 Создание тестовой заявки...')
  await prisma.contactRequest.create({
    data: {
      name: 'Иван Петров',
      email: 'ivan@example.com',
      phone: '+7 (999) 123-45-67',
      company: 'ООО "Тест"',
      message: 'Интересует терминал сбора данных для склада',
      equipment: 'Терминал сбора данных',
    },
  })

  // Создание тестовых пользователей
  console.log('👤 Создание пользователей...')
  await prisma.user.create({
    data: {
      email: 'admin@stp-service.ru',
      name: 'Администратор',
      phone: '+7 (495) 255-08-54',
      password: 'admin123', // Простой пароль для демо
      role: 'ADMIN',
      isActive: true,
    },
  })

  await prisma.user.create({
    data: {
      email: 'manager@stp-service.ru', 
      name: 'Менеджер',
      phone: '+7 (495) 255-08-55',
      password: 'manager123', // Простой пароль для демо
      role: 'MANAGER',
      isActive: true,
    },
  })

  console.log('✅ База данных успешно заполнена!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
