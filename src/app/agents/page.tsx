import { Topbar } from '@/components/layout/Topbar'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

// TODO: In the future, we may want to create an Agent model in Prisma
// to properly store agent configurations. For now, we use environment variables.

function maskValue(value: string | undefined): string {
  if (!value) return 'Not configured'
  if (value.length <= 8) return '****'
  return `${value.slice(0, 4)}...${value.slice(-4)}`
}

export default function AgentsPage() {
  // Read environment variables server-side
  const retellAgentId = process.env.RETELL_AGENT_ID
  const retellInboundAgentId = process.env.RETELL_INBOUND_AGENT_ID
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

  const agents = [
    {
      name: 'Primary Outbound Agent',
      type: 'Outbound',
      retellAgentId: retellAgentId,
      phoneNumber: twilioPhoneNumber,
      description: 'Default agent for outbound sales and follow-up calls',
    },
    {
      name: 'Inbound Support Agent',
      type: 'Inbound',
      retellAgentId: retellInboundAgentId,
      phoneNumber: twilioPhoneNumber,
      description: 'Handles incoming customer calls and inquiries',
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Agents" subtitle="Manage AI voice agent configurations" />

      <div className="flex-1 p-6 space-y-6">
        <Card>
          <CardHeader
            title="Voice Agents"
            subtitle="AI agents powered by Retell for automated conversations"
          />

          <div className="space-y-4">
            {agents.map((agent, index) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg border border-zinc-200 p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
                    <BotIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-zinc-900">{agent.name}</h3>
                      <Badge variant={agent.type === 'Outbound' ? 'default' : 'info'}>
                        {agent.type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-zinc-500">{agent.description}</p>
                    <div className="mt-3 space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">Retell Agent ID:</span>
                        <code className="rounded bg-zinc-100 px-2 py-0.5 text-xs">
                          {maskValue(agent.retellAgentId)}
                        </code>
                        {agent.retellAgentId ? (
                          <Badge variant="success">Configured</Badge>
                        ) : (
                          <Badge variant="error">Missing</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">Phone Number:</span>
                        <code className="rounded bg-zinc-100 px-2 py-0.5 text-xs">
                          {agent.phoneNumber || 'Not configured'}
                        </code>
                        {agent.phoneNumber ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="error">Missing</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Agent Configuration"
            subtitle="How to configure your AI voice agents"
          />
          <div className="prose prose-sm max-w-none text-zinc-600">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Create voice agents in your <strong>Retell AI dashboard</strong></li>
              <li>Copy the agent IDs and add them to your environment variables:
                <ul className="list-disc pl-5 mt-1">
                  <li><code>RETELL_AGENT_ID</code> - Primary outbound agent</li>
                  <li><code>RETELL_INBOUND_AGENT_ID</code> - Inbound agent (optional)</li>
                </ul>
              </li>
              <li>Configure your Twilio phone numbers to point to Retell webhooks</li>
              <li>Restart the application to apply changes</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  )
}

function BotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}
