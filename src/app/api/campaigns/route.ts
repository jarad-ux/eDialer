import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const CreateCampaignSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  retellAgentId: z.string().optional(),
  userId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = CreateCampaignSchema.parse(body)

    const campaign = await prisma.campaign.create({
      data: {
        name: data.name,
        description: data.description,
        retellAgentId: data.retellAgentId,
        userId: data.userId,
        status: 'DRAFT',
      },
    })

    return NextResponse.json({ success: true, campaign })
  } catch (error) {
    console.error('Create campaign error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { calls: true, campaignContacts: true },
        },
      },
    })

    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error('List campaigns error:', error)
    return NextResponse.json(
      { error: 'Failed to list campaigns' },
      { status: 500 }
    )
  }
}
