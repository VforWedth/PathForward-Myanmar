'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, MapPin, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getJobs, getJob, applyForJob } from '@/lib/studentApi'

function useQueryState(key: string, defaultValue = '') {
  const router = useRouter()
  const params = useSearchParams()
  const value = params.get(key) || defaultValue
  const setValue = (v: string) => {
    const sp = new URLSearchParams(params?.toString())
    if (!v) sp.delete(key) else sp.set(key, v)
    router.push(`/student/jobs?${sp.toString()}`)
  }
  return [value, setValue] as const
}

export default function JobsPage() {
  const [search, setSearch] = useQueryState('search')
  const [location, setLocation] = useQueryState('location')
  const [workMode, setWorkMode] = useQueryState('workMode')
  const [jobType, setJobType] = useQueryState('jobType')
  const [experienceLevel, setExperienceLevel] = useQueryState('experienceLevel')
  const [skillsCsv, setSkillsCsv] = useQueryState('skills')
  const [page, setPage] = useQueryState('page', '1')

  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [pagination, setPagination] = useState<{ total: number; page: number; pages: number; limit: number } | null>(null)

  const [detailLoading, setDetailLoading] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)

  const skills = useMemo(() => (skillsCsv ? skillsCsv.split(',').map(s => s.trim()).filter(Boolean) : []), [skillsCsv])
  const [skillInput, setSkillInput] = useState('')

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const res = await getJobs({ search, location, workMode, jobType, experienceLevel, skills: skillsCsv, page })
      setJobs(res.data || [])
      setPagination(res.pagination || null)
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, location, workMode, jobType, experienceLevel, skillsCsv, page])

  const addSkill = () => {
    const s = skillInput.trim()
    if (!s) return
    const set = new Set(skills)
    set.add(s)
    setSkillsCsv(Array.from(set).join(','))
    setSkillInput('')
  }

  const removeSkill = (s: string) => {
    const list = skills.filter(x => x !== s)
    setSkillsCsv(list.join(','))
  }

  const openJob = async (id: string) => {
    try {
      setDetailLoading(true)
      const res = await getJob(id)
      setSelectedJob(res.data)
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to load job')
    } finally {
      setDetailLoading(false)
    }
  }

  const doApply = async (id: string) => {
    try {
      await applyForJob(id)
      toast.success('Application submitted')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to apply')
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
                  <BreadcrumbPage>Jobs</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Jobs</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-6">
              <div className="md:col-span-2 space-y-2">
                <Label>Search</Label>
                <div className="flex gap-2">
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title, keywords" />
                  <Button variant="secondary" onClick={() => setPage('1')}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label>Work Mode</Label>
                <Select value={workMode || undefined} onValueChange={(v) => setWorkMode(v === 'any' ? '' : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="ojt">OJT</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={jobType || undefined} onValueChange={(v) => setJobType(v === 'any' ? '' : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="full_time">Full-time</SelectItem>
                    <SelectItem value="part_time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select value={experienceLevel || undefined} onValueChange={(v) => setExperienceLevel(v === 'any' ? '' : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3 space-y-2">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="e.g., react, node, sql" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                  <Button type="button" onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map(s => (
                    <Badge key={s} variant="secondary" className="px-3 py-1">
                      {s}
                      <button className="ml-2 text-red-500" onClick={() => removeSkill(s)}>×</button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {!jobs.length && (
                      <div className="text-center text-sm text-gray-500 py-8">No jobs found. Adjust filters.</div>
                    )}
                    {jobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-3 hover:bg-muted/50 transition flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{job.title}</div>
                          <div className="text-sm text-gray-600 truncate">{job.Company?.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location || '—'}</div>
                          <div className="mt-1 flex gap-2">
                            <Badge variant="secondary">{job.workMode}</Badge>
                            <Badge variant="outline">{job.jobType}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => openJob(job.id)}>View</Button>
                          <Button onClick={() => doApply(job.id)}>Apply</Button>
                        </div>
                      </div>
                    ))}
                    {pagination && pagination.pages > 1 && (
                      <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-gray-600">Page {pagination.page} of {pagination.pages} • {pagination.total} results</div>
                        <div className="flex gap-2">
                          <Button variant="outline" disabled={Number(page) <= 1} onClick={() => setPage(String(Number(page) - 1))}>Prev</Button>
                          <Button variant="outline" disabled={pagination.page >= pagination.pages} onClick={() => setPage(String(Number(page) + 1))}>Next</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent>
                {detailLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : !selectedJob ? (
                  <div className="text-sm text-gray-500">Select a job to see details.</div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-lg font-semibold">{selectedJob.title}</div>
                    <div className="text-sm text-gray-600">{selectedJob.Company?.name} • {selectedJob.location}</div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{selectedJob.workMode}</Badge>
                      <Badge variant="outline">{selectedJob.jobType}</Badge>
                    </div>
                    {selectedJob.description && (
                      <div className="text-sm whitespace-pre-wrap">{selectedJob.description}</div>
                    )}
                    <div className="text-sm">
                      <div className="font-medium mt-2">Company</div>
                      <div>{selectedJob.Company?.name}</div>
                      <div className="text-gray-600 text-xs">{selectedJob.Company?.industry} • {selectedJob.Company?.location}</div>
                      {selectedJob.Company?.website && (
                        <a className="text-xs text-blue-600 hover:underline" href={selectedJob.Company.website} target="_blank" rel="noreferrer">Website</a>
                      )}
                    </div>
                    <div className="pt-2">
                      <Button className="w-full" onClick={() => doApply(selectedJob.id)}>Apply</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
