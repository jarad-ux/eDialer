import { Topbar } from '@/components/layout/Topbar'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getContacts } from '@/lib/contacts'
import { formatDistanceToNow } from 'date-fns'
import { ContactsSearch } from './ContactsSearch'

function getStatusBadgeVariant(status: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (status) {
    case 'CONVERTED': return 'success'
    case 'QUALIFIED': return 'info'
    case 'CONTACTED': return 'default'
    case 'UNQUALIFIED': return 'warning'
    case 'DO_NOT_CALL': return 'error'
    default: return 'default'
  }
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const params = await searchParams
  const search = params.search || ''
  const page = parseInt(params.page || '1')
  const limit = 20
  const offset = (page - 1) * limit

  const { contacts, total } = await getContacts({ limit, offset, search })
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Contacts" subtitle="Manage your contact database" />

      <div className="flex-1 p-6 space-y-6">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <ContactsSearch initialSearch={search} />
            <p className="text-sm text-zinc-500">{total} contacts</p>
          </div>

          {contacts.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              {search ? (
                <p>No contacts found matching &quot;{search}&quot;</p>
              ) : (
                <p>No contacts yet. Import contacts to get started.</p>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th className="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 bg-zinc-50">Name</th>
                      <th className="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 bg-zinc-50">Phone</th>
                      <th className="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 bg-zinc-50">Email</th>
                      <th className="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 bg-zinc-50">Status</th>
                      <th className="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 bg-zinc-50">Tags</th>
                      <th className="sticky top-0 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 bg-zinc-50">Last Call</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white">
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-zinc-50">
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <div>
                            <p className="font-medium text-zinc-900">
                              {contact.firstName} {contact.lastName}
                            </p>
                            {contact.company && (
                              <p className="text-zinc-500">{contact.company}</p>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">
                          {contact.phone}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-500">
                          {contact.email || '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <Badge variant={getStatusBadgeVariant(contact.status)}>
                            {contact.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="default">{tag}</Badge>
                            ))}
                            {contact.tags.length > 2 && (
                              <span className="text-xs text-zinc-500">+{contact.tags.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-500">
                          {contact.calls[0]
                            ? formatDistanceToNow(new Date(contact.calls[0].createdAt), { addSuffix: true })
                            : 'Never'}
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
                        href={`/contacts?page=${page - 1}${search ? `&search=${search}` : ''}`}
                        className="rounded-lg border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-50"
                      >
                        Previous
                      </a>
                    )}
                    {page < totalPages && (
                      <a
                        href={`/contacts?page=${page + 1}${search ? `&search=${search}` : ''}`}
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
  )
}
