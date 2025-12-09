import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createRetellCall } from '@/lib/retell'
import { z } from 'zod'

const CreateCallSchema = z.object({
  contactId: z.string().optional(),
  toNumber: z.string(),
  campaignId: z.string().optional(),
  agentId: z.string().optional(),
  userId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = CreateCallSchema.parse(body)

    const fromNumber = process.env.TWILIO_PHONE_NUMBER
    if (!fromNumber) {
      return NextResponse.json(
        { error: 'Phone number not configured' },
        { status: 500 }
      )
    }

    // Create call record
    const call = await prisma.call.create({
      data: {
        userId: data.userId,
        contactId: data.contactId,
        campaignId: data.campaignId,
        direction: 'OUTBOUND',
        status: 'INITIATED',
        fromNumber,
        toNumber: data.toNumber,
      },
    })

    // Initiate call via Retell
    const retellCall = await createRetellCall({
      fromNumber,
      toNumber: data.toNumber,
      agentId: data.agentId,
      metadata: {
        callId: call.id,
        contactId: data.contactId,
        campaignId: data.campaignId,
      },
    })

    // Update with Retell call ID
    await prisma.call.update({
      where: { id: call.id },
      data: { retellCallId: retellCall.call_id },
    })

    return NextResponse.json({
      success: true,
      callId: call.id,
      retellCallId: retellCall.call_id,
    })
  } catch (error) {
    console.error('Create call error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create call' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: Record<string, unknown> = {}
    if (userId) where.userId = userId
    if (status) where.status = status

    const [calls, total] = await Promise.all([
      prisma.call.findMany({
        where,
        include: {
          contact: true,
          campaign: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.call.count({ where }),
    ])

    return NextResponse.json({
      calls,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('List calls error:', error)
    return NextResponse.json(
      { error: 'Failed to list calls' },
      { status: 500 }
    )
  }
}
