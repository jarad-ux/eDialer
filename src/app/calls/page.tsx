import { Topbar } from '@/components/layout/Topbar'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getCalls } from '@/lib/calls'
import { format } from 'date-fns'
import { TestCallPanel } from './TestCallPanel'

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—'
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
    case 'CANCELED': return 'error'
    default: return 'default'
  }
}

function getDirectionBadgeVariant(direction: string): 'info' | 'default' {
  return direction === 'INBOUND' ? 'info' : 'default'
}

export default async function CallsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 25
  const offset = (page - 1) * limit

  const { calls, total } = await getCalls({ limit, offset })
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Calls" subtitle="Call history and manual dialing" />

      <div className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Test Call Panel */}
          <Card>
            <CardHeader title="Start Test Call" subtitle="Manually trigger an outbound call" />
            <TestCallPanel />
          </Card>

          {/* Call History */}
          <Card className="lg:col-span-2">
            <CardHeader title="Call History" subtitle={`${total} calls`} />

            {calls.length === 0 ? (
              <div className="py-12 text-center text-zinc-500">
                <p>No calls yet. Start a test call or run a campaign.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Direction</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">To / From</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Duration</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Campaign</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white">
                      {calls.map((call) => (
                        <tr key={call.id} className="hover:bg-zinc-50">
                          <td className="whitespace-nowrap px-4 py-3 text-sm">
                            <Badge variant={getDirectionBadgeVariant(call.direction)}>
                              {call.direction}
                            </Badge>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm">
                            <div>
                              <p className="font-medium text-zinc-900">{call.toNumber}</p>
                              <p className="text-zinc-500 text-xs">from {call.fromNumber}</p>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm">
                            <Badge variant={getStatusBadgeVariant(call.status)}>
                              {call.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">
                            {formatDuration(call.duration)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-500">
                            {call.campaign?.name || '—'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-500">
                            {format(new Date(call.createdAt), 'MMM d, h:mm a')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
                    <p className="text-sm text-zinc-500">
                      Showing {offset + 1} to {Math.min(offset + limit, total)} of {total}
                    </p>
                    <div className="flex gap-2">
                      {page > 1 && (
                        <a
                          href={`/calls?page=${page - 1}`}
                          className="rounded-lg border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-50"
                        >
                          Previous
                        </a>
                      )}
                      {page < totalPages && (
                        <a
                          href={`/calls?page=${page + 1}`}
                          className="rounded-lg border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-50"
                        >
                          Next
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
