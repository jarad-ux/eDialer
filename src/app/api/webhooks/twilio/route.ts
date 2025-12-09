import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const payload = Object.fromEntries(formData.entries())

    // Log the webhook
    await prisma.webhookLog.create({
      data: {
        source: 'twilio',
        eventType: (payload.CallStatus as string) || 'status_callback',
        payload: payload as Record<string, unknown>,
      },
    })

    const callSid = payload.CallSid as string
    const callStatus = payload.CallStatus as string

    if (callSid && callStatus) {
      const statusMap: Record<string, string> = {
        'queued': 'INITIATED',
        'ringing': 'RINGING',
        'in-progress': 'IN_PROGRESS',
        'completed': 'COMPLETED',
        'busy': 'BUSY',
        'no-answer': 'NO_ANSWER',
        'canceled': 'CANCELED',
        'failed': 'FAILED',
      }

      const status = statusMap[callStatus] || 'INITIATED'

      await prisma.call.updateMany({
        where: { callSid },
        data: {
          status: status as 'INITIATED' | 'RINGING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'BUSY' | 'NO_ANSWER' | 'CANCELED',
          ...(callStatus === 'completed' && {
            endedAt: new Date(),
            duration: parseInt(payload.CallDuration as string) || undefined,
          }),
        },
      })
    }

    // Return TwiML response (empty for status callbacks)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        headers: { 'Content-Type': 'application/xml' },
      }
    )
  } catch (error) {
    console.error('Twilio webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
