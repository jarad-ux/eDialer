import { Topbar } from '@/components/layout/Topbar'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

// TODO: Future settings to implement:
// - Webhook URL configuration
// - Call recording settings
// - Call outcome customization
// - Notification preferences
// - Team member management
// - API key management

function checkEnvVar(name: string): boolean {
  return !!process.env[name]
}

export default function SettingsPage() {
  const integrations = [
    {
      name: 'Telephony (Twilio)',
      description: 'Voice calls, SMS, and phone number management',
      icon: PhoneIcon,
      envVars: [
        { name: 'TWILIO_ACCOUNT_SID', present: checkEnvVar('TWILIO_ACCOUNT_SID') },
        { name: 'TWILIO_AUTH_TOKEN', present: checkEnvVar('TWILIO_AUTH_TOKEN') },
        { name: 'TWILIO_PHONE_NUMBER', present: checkEnvVar('TWILIO_PHONE_NUMBER') },
      ],
    },
    {
      name: 'Voice AI (Retell)',
      description: 'AI-powered voice agents for natural conversations',
      icon: BotIcon,
      envVars: [
        { name: 'RETELL_API_KEY', present: checkEnvVar('RETELL_API_KEY') },
        { name: 'RETELL_AGENT_ID', present: checkEnvVar('RETELL_AGENT_ID') },
      ],
    },
    {
      name: 'LLM (Anthropic)',
      description: 'Claude AI for call analysis and script generation',
      icon: SparklesIcon,
      envVars: [
        { name: 'ANTHROPIC_API_KEY', present: checkEnvVar('ANTHROPIC_API_KEY') },
      ],
    },
    {
      name: 'Database',
      description: 'PostgreSQL database for storing all application data',
      icon: DatabaseIcon,
      envVars: [
        { name: 'DATABASE_URL', present: checkEnvVar('DATABASE_URL') },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Settings" subtitle="Configure your eDialer instance" />

      <div className="flex-1 p-6 space-y-6">
        <Card>
          <CardHeader
            title="Integration Status"
            subtitle="Check the configuration status of external services"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {integrations.map((integration) => {
              const allConfigured = integration.envVars.every((v) => v.present)
              const someConfigured = integration.envVars.some((v) => v.present)

              return (
                <div
                  key={integration.name}
                  className="rounded-lg border border-zinc-200 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                      <integration.icon className="h-5 w-5 text-zinc-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-zinc-900">{integration.name}</h3>
                        {allConfigured ? (
                          <Badge variant="success">Configured</Badge>
                        ) : someConfigured ? (
                          <Badge variant="warning">Partial</Badge>
                        ) : (
                          <Badge variant="error">Not Configured</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">{integration.description}</p>
                      <div className="mt-3 space-y-1">
                        {integration.envVars.map((envVar) => (
                          <div key={envVar.name} className="flex items-center gap-2 text-xs">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                envVar.present ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            />
                            <code className="text-zinc-600">{envVar.name}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Application Info" />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Version</span>
              <span className="font-medium text-zinc-900">0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Environment</span>
              <Badge variant={process.env.NODE_ENV === 'production' ? 'success' : 'info'}>
                {process.env.NODE_ENV || 'development'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Next.js</span>
              <span className="font-medium text-zinc-900">16.0</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Coming Soon" subtitle="Features planned for future releases" />
          <ul className="space-y-2 text-sm text-zinc-600">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Webhook URL configuration panel
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Call recording and transcript settings
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Custom call outcome definitions
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Team member and role management
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              API key management and usage stats
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}

function BotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  )
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  )
}
