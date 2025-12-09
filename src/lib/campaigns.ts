import { prisma } from '@/lib/prisma'

export async function getCampaigns() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            calls: true,
            campaignContacts: true,
          },
        },
        calls: {
          where: { status: 'COMPLETED' },
          select: { id: true },
        },
      },
    })

    return campaigns.map((campaign) => ({
      ...campaign,
      targetSize: campaign._count.campaignContacts,
      callsMade: campaign._count.calls,
      completedCalls: campaign.calls.length,
      completionPercent:
        campaign._count.campaignContacts > 0
          ? Math.round((campaign.calls.length / campaign._count.campaignContacts) * 100)
          : 0,
    }))
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return []
  }
}
