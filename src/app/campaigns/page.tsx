import { Topbar } from '@/components/layout/Topbar'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getCampaigns } from '@/lib/campaigns'
import { format } from 'date-fns'
import { NewCampaignButton } from './NewCampaignButton'

function getStatusBadgeVariant(status: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (status) {
    case 'ACTIVE': return 'success'
    case 'PAUSED': return 'warning'
    case 'COMPLETED': return 'info'
    case 'DRAFT': return 'default'
    case 'ARCHIVED': return 'error'
    default: return 'default'
  }
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Campaigns" subtitle="Manage your outbound calling campaigns" />

      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div />
          <NewCampaignButton />
        </div>

        <Card>
          <CardHeader title="All Campaigns" subtitle={`${campaigns.length} campaigns`} />

          {campaigns.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              <p>No campaigns yet. Create your first campaign to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Target Size</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Calls Made</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Completion</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-zinc-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium text-zinc-900">{campaign.name}</p>
                          {campaign.description && (
                            <p className="text-zinc-500 truncate max-w-xs">{campaign.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <Badge variant={getStatusBadgeVariant(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">
                        {campaign.targetSize} contacts
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">
                        {campaign.callsMade}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 rounded-full bg-zinc-200">
                            <div
                              className="h-2 rounded-full bg-indigo-600"
                              style={{ width: `${campaign.completionPercent}%` }}
                            />
                          </div>
                          <span className="text-zinc-500">{campaign.completionPercent}%</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-500">
                        {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
