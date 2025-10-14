'use client'

import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, MapPin, Briefcase, XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getMyApplications, withdrawApplication } from '@/lib/studentApi'

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Reviewing', value: 'reviewing' },
  { label: 'Shortlisted', value: 'shortlisted' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
]

function statusBadge(status: string) {
  const variants: any = {
    pending: 'secondary',
    reviewing: 'outline',
    shortlisted: 'outline',
    accepted: 'default',
    rejected: 'destructive',
  }
  return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
}

export default function ApplicationsPage() {
  const [loading, setLoading] = useState(true)
  const [apps, setApps] = useState<any[]>([])
  const [status, setStatus] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      const res = await getMyApplications(status || undefined)
      setApps(res.data || [])
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const canWithdraw = (s: string) => ['pending', 'reviewing'].includes(s)

  const doWithdraw = async (id: string) => {
    if (!confirm('Withdraw this application?')) return
    try {
      await withdrawApplication(id)
      toast.success('Application withdrawn')
      load()
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to withdraw')
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/student/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>My Applications</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status || undefined} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {apps.length === 0 && (
                    <div className="text-sm text-gray-500">No applications found.</div>
                  )}
                  {apps.map((app) => (
                    <div key={app.id} className="border rounded-lg p-3 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate flex items-center gap-2">
                          <Briefcase className="h-4 w-4" /> {app.Job?.title}
                        </div>
                        <div className="text-sm text-gray-600 truncate">{app.Job?.Company?.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {app.Job?.location || '—'}</div>
                        <div className="mt-2">{statusBadge(app.status)}</div>
                      </div>
                      <div className="flex gap-2">
                        {canWithdraw(app.status) && (
                          <Button size="sm" variant="destructive" onClick={() => doWithdraw(app.id)}>
                            <XCircle className="h-4 w-4 mr-1" /> Withdraw
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
