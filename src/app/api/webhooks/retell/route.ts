import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    // Log the webhook
    await prisma.webhookLog.create({
      data: {
        source: 'retell',
        eventType: payload.event || 'unknown',
        payload,
      },
    })

    // Handle different event types
    switch (payload.event) {
      case 'call_started':
        await handleCallStarted(payload)
        break
      case 'call_ended':
        await handleCallEnded(payload)
        break
      case 'call_analyzed':
        await handleCallAnalyzed(payload)
        break
      default:
        console.log('Unhandled Retell event:', payload.event)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Retell webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCallStarted(payload: Record<string, unknown>) {
  const callId = payload.call_id as string
  if (!callId) return

  await prisma.call.updateMany({
    where: { retellCallId: callId },
    data: {
      status: 'IN_PROGRESS',
      startedAt: new Date(),
    },
  })
}

async function handleCallEnded(payload: Record<string, unknown>) {
  const callId = payload.call_id as string
  const call = payload.call as Record<string, unknown> | undefined
  if (!callId) return

  await prisma.call.updateMany({
    where: { retellCallId: callId },
    data: {
      status: 'COMPLETED',
      endedAt: new Date(),
      duration: call?.duration as number | undefined,
      transcript: call?.transcript as string | undefined,
      recordingUrl: call?.recording_url as string | undefined,
    },
  })
}

async function handleCallAnalyzed(payload: Record<string, unknown>) {
  const callId = payload.call_id as string
  const analysis = payload.call_analysis as Record<string, unknown> | undefined
  if (!callId || !analysis) return

  await prisma.call.updateMany({
    where: { retellCallId: callId },
    data: {
      summary: analysis.call_summary as string | undefined,
      sentiment: analysis.user_sentiment as string | undefined,
    },
  })
}
