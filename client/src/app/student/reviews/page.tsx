'use client'

import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Loader2, Star, Building2, Trash2, Save, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { createReview, deleteReview, getMyReviews, updateReview } from '@/lib/studentApi'

interface ReviewForm {
  id?: string
  companyId: string
  rating: number | ''
  comment: string
  isAnonymous: boolean
  jobId?: string
}

function StarsInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const arr = [1, 2, 3, 4, 5]
  return (
    <div className="flex items-center gap-1">
      {arr.map((i) => (
        <Star
          key={i}
          className={`h-5 w-5 cursor-pointer ${i <= value ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`}
          onClick={() => onChange(i)}
        />
      ))}
      <span className="text-xs text-gray-600 ml-2">{value}/5</span>
    </div>
  )
}

function StarsView({ value }: { value: number }) {
  const arr = [1, 2, 3, 4, 5]
  return (
    <div className="flex items-center gap-1">
      {arr.map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= value ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState<ReviewForm>({ companyId: '', rating: 5, comment: '', isAnonymous: false, jobId: '' })

  const resetForm = () => setForm({ companyId: '', rating: 5, comment: '', isAnonymous: false, jobId: '' })

  const load = async () => {
    try {
      setLoading(true)
      const res = await getMyReviews()
      setItems(res.data || [])
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleEdit = (r: any) => {
    setForm({ id: r.id, companyId: r.companyId, rating: r.rating, comment: r.comment || '', isAnonymous: !!r.isAnonymous, jobId: r.jobId || '' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return
    try {
      await deleteReview(id)
      toast.success('Review deleted')
      load()
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to delete review')
    }
  }

  const handleSubmit = async () => {
    if (!form.companyId) {
      toast.error('Company ID is required')
      return
    }
    if (!form.rating || form.rating < 1 || form.rating > 5) {
      toast.error('Rating must be between 1 and 5')
      return
    }
    setSaving(true)
    try {
      const payload: any = {
        companyId: form.companyId,
        rating: form.rating,
        comment: form.comment || '',
        isAnonymous: !!form.isAnonymous,
      }
      if (form.jobId) payload.jobId = form.jobId

      if (form.id) {
        await updateReview(form.id, payload)
        toast.success('Review updated')
      } else {
        await createReview(payload)
        toast.success('Review created')
      }
      resetForm()
      load()
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to save review')
    } finally {
      setSaving(false)
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
                  <BreadcrumbPage>My Reviews</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{form.id ? 'Edit Review' : 'Write a Review'}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Company ID</Label>
                <Input value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} placeholder="UUID of company" />
                <div className="text-xs text-gray-500">Paste the target company's ID. (Future enhancement: searchable company list)</div>
              </div>
              <div className="space-y-2">
                <Label>Related Job ID (optional)</Label>
                <Input value={form.jobId} onChange={(e) => setForm({ ...form, jobId: e.target.value })} placeholder="UUID of job (optional)" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Rating</Label>
                <StarsInput value={Number(form.rating) || 5} onChange={(v) => setForm({ ...form, rating: v })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Comment</Label>
                <Textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Share your experience..." rows={4} />
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <Checkbox id="anon" checked={form.isAnonymous} onCheckedChange={(v) => setForm({ ...form, isAnonymous: !!v })} />
                <Label htmlFor="anon">Post as anonymous</Label>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>) : (<><Save className="h-4 w-4 mr-2" /> Save</>)}
                </Button>
                {form.id && (
                  <Button type="button" variant="outline" onClick={resetForm}><Plus className="h-4 w-4 mr-2" /> New</Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {items.length === 0 && (
                    <div className="text-sm text-gray-500">You haven't posted any reviews yet.</div>
                  )}
                  {items.map((r) => (
                    <div key={r.id} className="border rounded-lg p-3 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <div className="font-medium truncate">Company ID: {r.companyId}</div>
                          {r.isAnonymous && <Badge variant="outline">Anonymous</Badge>}
                        </div>
                        <div className="mt-1"><StarsView value={r.rating} /></div>
                        {r.comment && <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{r.comment}</div>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(r)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(r.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
