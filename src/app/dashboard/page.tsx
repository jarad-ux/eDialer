import { Topbar } from '@/components/layout/Topbar'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getDashboardData } from '@/lib/dashboard'
import { formatDistanceToNow } from 'date-fns'

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

function getStatusBadgeVariant(status: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (status) {
    case 'COMPLETED': return 'success'
    case 'IN_PROGRESS': return 'info'
    case 'FAILED': return 'error'
    case 'NO_ANSWER': return 'warning'
    case 'BUSY': return 'warning'
    default: return 'default'
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Dashboard" subtitle="Overview of your dialer performance" />

      <div className="flex-1 p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Calls Today"
            value={data.totalCallsToday}
            icon={<PhoneIcon className="h-6 w-6" />}
          />
          <KpiCard
            title="Connected Calls"
            value={data.connectedCallsToday}
            subtitle={`${data.totalCallsToday > 0 ? Math.round((data.connectedCallsToday / data.totalCallsToday) * 100) : 0}% connection rate`}
            icon={<CheckIcon className="h-6 w-6" />}
          />
          <KpiCard
            title="Avg. Call Duration"
            value={formatDuration(data.avgDuration)}
            icon={<ClockIcon className="h-6 w-6" />}
          />
          <KpiCard
            title="Active Campaigns"
            value={data.activeCampaigns}
            icon={<MegaphoneIcon className="h-6 w-6" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Calls */}
          <Card className="lg:col-span-2">
            <CardHeader title="Recent Calls" subtitle="Last 10 calls across all campaigns" />
            {data.recentCalls.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">
                <p>No calls yet. Start a campaign to see activity here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Campaign</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {data.recentCalls.map((call) => (
                      <tr key={call.id} className="hover:bg-zinc-50">
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <div>
                            <p className="font-medium text-zinc-900">
                              {call.contact ? `${call.contact.firstName} ${call.contact.lastName}` : 'Unknown'}
                            </p>
                            <p className="text-zinc-500">{call.toNumber}</p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">
                          {call.campaign?.name || '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <Badge variant={getStatusBadgeVariant(call.status)}>
                            {call.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-500">
                          {formatDistanceToNow(new Date(call.createdAt), { addSuffix: true })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Top Campaigns */}
          <Card>
            <CardHeader title="Top Campaigns" subtitle="By call volume (last 7 days)" />
            {data.topCampaigns.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">
                <p>No campaign activity yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-200">
                {data.topCampaigns.map((campaign, index) => (
                  <li key={campaign.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-zinc-900">{campaign.name}</p>
                        <p className="text-sm text-zinc-500">{campaign._count.calls} calls</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function MegaphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
    </svg>
  )
}
