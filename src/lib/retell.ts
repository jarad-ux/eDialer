import Retell from 'retell-sdk'

const apiKey = process.env.RETELL_API_KEY

if (!apiKey) {
  console.warn('Retell API key not configured')
}

export const retellClient = apiKey ? new Retell({ apiKey }) : null

export async function createRetellCall(options: {
  fromNumber: string
  toNumber: string
  agentId?: string
  metadata?: Record<string, unknown>
}) {
  if (!retellClient) {
    throw new Error('Retell not configured')
  }

  const agentId = options.agentId || process.env.RETELL_AGENT_ID
  if (!agentId) {
    throw new Error('No Retell agent ID configured')
  }

  return retellClient.call.createPhoneCall({
    from_number: options.fromNumber,
    to_number: options.toNumber,
    override_agent_id: agentId,
    metadata: options.metadata,
  })
}

export async function getRetellCall(callId: string) {
  if (!retellClient) {
    throw new Error('Retell not configured')
  }

  return retellClient.call.retrieve(callId)
}

export async function listRetellAgents() {
  if (!retellClient) {
    throw new Error('Retell not configured')
  }

  return retellClient.agent.list()
}
