import { prisma } from '@/lib/prisma'

export async function getCalls(options?: {
  limit?: number
  offset?: number
}) {
  const { limit = 50, offset = 0 } = options || {}

  try {
    const [calls, total] = await Promise.all([
      prisma.call.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          contact: true,
          campaign: true,
        },
      }),
      prisma.call.count(),
    ])

    return { calls, total }
  } catch (error) {
    console.error('Error fetching calls:', error)
    return { calls: [], total: 0 }
  }
}
