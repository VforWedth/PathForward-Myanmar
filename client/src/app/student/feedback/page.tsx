'use client'

import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Building2, MapPin, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getMyFeedback } from '@/lib/studentApi'

function Stars({ rating }: { rating: number }) {
  const arr = [1, 2, 3, 4, 5]
  return (
    <div className="flex items-center gap-1">
      {arr.map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
      ))}
      <span className="text-xs text-gray-600 ml-2">{rating}/5</span>
    </div>
  )
}

export default function StudentFeedbackPage() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<any[]>([])

  const load = async () => {
    try {
      setLoading(true)
      const res = await getMyFeedback()
      setItems(res.data || [])
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to load feedback')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

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
                  <BreadcrumbPage>Feedback</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback from Companies</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {items.length === 0 && (
                    <div className="text-sm text-gray-500">No feedback received yet.</div>
                  )}

                  {items.map((fb) => (
                    <div key={fb.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            <Building2 className="h-4 w-4" /> {fb.Company?.name}
                          </div>
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {fb.Company?.industry} • {fb.Company?.location}
                          </div>
                          {fb.Job && (
                            <div className="text-xs text-gray-600 mt-1">Job: {fb.Job.title} • {fb.Job.location}</div>
                          )}
                        </div>
                        <Stars rating={fb.rating} />
                      </div>

                      {fb.overallComment && (
                        <div>
                          <div className="text-sm font-medium">Overall Comment</div>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap">{fb.overallComment}</div>
                        </div>
                      )}

                      <div className="grid gap-3 md:grid-cols-2">
                        {fb.strengths && (
                          <div>
                            <div className="text-sm font-medium">Strengths</div>
                            <div className="text-sm text-gray-700 whitespace-pre-wrap">{fb.strengths}</div>
                          </div>
                        )}
                        {fb.areasForImprovement && (
                          <div>
                            <div className="text-sm font-medium">Areas for Improvement</div>
                            <div className="text-sm text-gray-700 whitespace-pre-wrap">{fb.areasForImprovement}</div>
                          </div>
                        )}
                      </div>

                      <div className="pt-1">
                        <Badge variant="outline">{new Date(fb.createdAt).toLocaleDateString()}</Badge>
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
