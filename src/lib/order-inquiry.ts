import { z } from 'zod'

export const inquirySchema = z.object({
  customerName: z.string().trim().min(1, 'Введите имя').max(150),
  customerPhone: z.string().trim().regex(/^[+\d\s()\-]{10,30}$/, 'Некорректный номер телефона'),
  customerEmail: z.union([z.string().trim().email(), z.literal('')]).optional().default(''),
  company: z.string().trim().max(250).optional(),
  notes: z.string().trim().max(5000).optional(),
  items: z.array(z.object({
    productId: z.string().min(1).max(100),
    quantity: z.number().int().min(1).max(1000000),
  })).min(1, 'Добавьте товары в заявку').max(100),
})

export function mergeInquiryItems(items: { productId: string; quantity: number }[]) {
  const quantities = new Map<string, number>()
  for (const item of items) quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity)
  return [...quantities].map(([productId, quantity]) => ({ productId, quantity }))
}
