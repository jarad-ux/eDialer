'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function TestCallPanel() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const [toNumber, setToNumber] = useState('')
  const [userId, setUserId] = useState('demo-user')
  const [campaignId, setCampaignId] = useState('')
  const [agentId, setAgentId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toNumber,
          userId,
          campaignId: campaignId || undefined,
          agentId: agentId || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate call')
      }

      setResult({
        success: true,
        message: `Call initiated! ID: ${data.callId}`,
      })
      setToNumber('')
      router.refresh()
    } catch (err) {
      setResult({
        success: false,
        message: err instanceof Error ? err.message : 'Something went wrong',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="To Number"
        placeholder="+1234567890"
        value={toNumber}
        onChange={(e) => setToNumber(e.target.value)}
        required
      />

      <Input
        label="User ID"
        placeholder="User ID for attribution"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
      />

      <Input
        label="Campaign ID (optional)"
        placeholder="campaign_..."
        value={campaignId}
        onChange={(e) => setCampaignId(e.target.value)}
      />

      <Input
        label="Agent ID (optional)"
        placeholder="Override Retell agent"
        value={agentId}
        onChange={(e) => setAgentId(e.target.value)}
      />

      {result && (
        <div
          className={`rounded-lg p-3 text-sm ${
            result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}
        >
          {result.message}
        </div>
      )}

      <Button type="submit" disabled={isLoading || !toNumber} className="w-full">
        {isLoading ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Initiating...
          </>
        ) : (
          <>
            <PhoneIcon className="mr-2 h-4 w-4" />
            Start Call
          </>
        )}
      </Button>
    </form>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}
