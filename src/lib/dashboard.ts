import { prisma } from '@/lib/prisma'

export async function getDashboardData() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    const [
      totalCallsToday,
      connectedCallsToday,
      activeCampaigns,
      recentCalls,
      topCampaigns,
      avgDuration,
    ] = await Promise.all([
      // Total calls today
      prisma.call.count({
        where: { createdAt: { gte: today } },
      }),
      // Connected calls today
      prisma.call.count({
        where: {
          createdAt: { gte: today },
          status: { in: ['COMPLETED', 'IN_PROGRESS'] },
        },
      }),
      // Active campaigns
      prisma.campaign.count({
        where: { status: 'ACTIVE' },
      }),
      // Recent calls with relations
      prisma.call.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          contact: true,
          campaign: true,
        },
      }),
      // Top campaigns by calls (last 7 days)
      prisma.campaign.findMany({
        take: 5,
        where: {
          calls: {
            some: {
              createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            },
          },
        },
        include: {
          _count: { select: { calls: true } },
        },
        orderBy: { calls: { _count: 'desc' } },
      }),
      // Average call duration
      prisma.call.aggregate({
        where: {
          createdAt: { gte: today },
          duration: { not: null },
        },
        _avg: { duration: true },
      }),
    ])

    return {
      totalCallsToday,
      connectedCallsToday,
      activeCampaigns,
      avgDuration: Math.round(avgDuration._avg.duration || 0),
      recentCalls,
      topCampaigns,
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      totalCallsToday: 0,
      connectedCallsToday: 0,
      activeCampaigns: 0,
      avgDuration: 0,
      recentCalls: [],
      topCampaigns: [],
    }
  }
}
