import { prisma } from '@/lib/prisma'

export async function getContacts(options?: {
  limit?: number
  offset?: number
  search?: string
}) {
  const { limit = 50, offset = 0, search } = options || {}

  try {
    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          calls: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true },
          },
        },
      }),
      prisma.contact.count({ where }),
    ])

    return { contacts, total }
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return { contacts: [], total: 0 }
  }
}
