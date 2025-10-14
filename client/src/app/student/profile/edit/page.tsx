'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Trash2, Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'
import {
  getProfile,
  updateProfile,
  uploadCV,
  uploadProfilePicture,
  updateStatus,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addCertificate,
  updateCertificate,
  deleteCertificate
} from '@/lib/studentApi'

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Profile state
  const [profile, setProfile] = useState<any>({
    firstName: '',
    lastName: '',
    major: '',
    year: '',
    location: '',
    jobPreference: 'onsite',
    portfolioUrl: '',
    bio: '',
    skills: [],
    status: 'available'
  })

  const [education, setEducation] = useState<any[]>([])
  const [experience, setExperience] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])

  // Form states for adding new items
  const [showAddEducation, setShowAddEducation] = useState(false)
  const [showAddExperience, setShowAddExperience] = useState(false)
  const [showAddCertificate, setShowAddCertificate] = useState(false)

  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    grade: ''
  })

  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrent: false
  })

  const [newCertificate, setNewCertificate] = useState({
    title: '',
    issuingOrganization: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: ''
  })

  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const res = await getProfile()
      if (res.success && res.data) {
        setProfile({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          major: res.data.major || '',
          year: res.data.year || '',
          location: res.data.location || '',
          jobPreference: res.data.jobPreference || 'onsite',
          portfolioUrl: res.data.portfolioUrl || '',
          bio: res.data.bio || '',
          skills: res.data.skills || [],
          status: res.data.status || 'available'
        })
        setEducation(res.data.Education || [])
        setExperience(res.data.Experiences || [])
        setCertificates(res.data.Certificates || [])
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      await updateProfile(profile)
      toast.success('Profile updated successfully')
      router.push('/student/dashboard')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus(status as any)
      setProfile({ ...profile, status })
      toast.success('Status updated')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to update status')
    }
  }

  const handleFileUpload = async (type: 'cv' | 'picture', file: File) => {
    try {
      if (type === 'cv') {
        await uploadCV(file)
        toast.success('CV uploaded successfully')
      } else {
        await uploadProfilePicture(file)
        toast.success('Profile picture uploaded successfully')
      }
      loadProfile()
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Upload failed')
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, skillInput.trim()] })
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((s: string) => s !== skill) })
  }

  // Education handlers
  const handleAddEducation = async () => {
    try {
      const res = await addEducation(newEducation)
      if (res.success) {
        setEducation([...education, res.data])
        setShowAddEducation(false)
        setNewEducation({
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          grade: ''
        })
        toast.success('Education added')
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to add education')
    }
  }

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Delete this education?')) return
    try {
      await deleteEducation(id)
      setEducation(education.filter(e => e.id !== id))
      toast.success('Education deleted')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to delete')
    }
  }

  // Experience handlers
  const handleAddExperience = async () => {
    try {
      const res = await addExperience(newExperience)
      if (res.success) {
        setExperience([...experience, res.data])
        setShowAddExperience(false)
        setNewExperience({
          company: '',
          position: '',
          description: '',
          startDate: '',
          endDate: '',
          isCurrent: false
        })
        toast.success('Experience added')
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to add experience')
    }
  }

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Delete this experience?')) return
    try {
      await deleteExperience(id)
      setExperience(experience.filter(e => e.id !== id))
      toast.success('Experience deleted')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to delete')
    }
  }

  // Certificate handlers
  const handleAddCertificate = async () => {
    try {
      const res = await addCertificate(newCertificate)
      if (res.success) {
        setCertificates([...certificates, res.data])
        setShowAddCertificate(false)
        setNewCertificate({
          title: '',
          issuingOrganization: '',
          issueDate: '',
          expiryDate: '',
          credentialId: '',
          credentialUrl: ''
        })
        toast.success('Certificate added')
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to add certificate')
    }
  }

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm('Delete this certificate?')) return
    try {
      await deleteCertificate(id)
      setCertificates(certificates.filter(c => c.id !== id))
      toast.success('Certificate deleted')
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to delete')
    }
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
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
                <BreadcrumbItem>
                  <BreadcrumbLink href="/student/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Major</Label>
                  <Input value={profile.major} onChange={(e) => setProfile({ ...profile, major: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input type="number" value={profile.year} onChange={(e) => setProfile({ ...profile, year: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Job Preference</Label>
                  <Select value={profile.jobPreference} onValueChange={(v) => setProfile({ ...profile, jobPreference: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onsite">Onsite</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="ojt">OJT</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Portfolio URL</Label>
                <Input value={profile.portfolioUrl} onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                  <Button type="button" onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                      <button className="ml-2 text-red-500" onClick={() => removeSkill(skill)}>×</button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={profile.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="on_job">On Job</SelectItem>
                    <SelectItem value="internship_completed">Internship Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Upload your CV and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload CV</Label>
                <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files?.[0] && handleFileUpload('cv', e.target.files[0])} />
              </div>
              <div className="space-y-2">
                <Label>Upload Profile Picture</Label>
                <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload('picture', e.target.files[0])} />
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Your academic background</CardDescription>
                </div>
                <Button onClick={() => setShowAddEducation(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="border rounded-lg p-3 flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</div>
                    <div className="text-sm text-gray-600">{edu.institution}</div>
                    <div className="text-xs text-gray-500">
                      {edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteEducation(edu.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {showAddEducation && (
                <div className="border rounded-lg p-4 space-y-3 bg-muted/50">
                  <Input placeholder="Institution" value={newEducation.institution} onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })} />
                  <Input placeholder="Degree" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} />
                  <Input placeholder="Field of Study" value={newEducation.fieldOfStudy} onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input type="date" placeholder="Start Date" value={newEducation.startDate} onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })} />
                    <Input type="date" placeholder="End Date" value={newEducation.endDate} onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })} disabled={newEducation.isCurrent} />
                  </div>
                  <Input placeholder="Grade/GPA" value={newEducation.grade} onChange={(e) => setNewEducation({ ...newEducation, grade: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={newEducation.isCurrent} onChange={(e) => setNewEducation({ ...newEducation, isCurrent: e.target.checked })} />
                    <label className="text-sm">Currently studying here</label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddEducation}>Save</Button>
                    <Button variant="outline" onClick={() => setShowAddEducation(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Experience</CardTitle>
                  <CardDescription>Your work experience</CardDescription>
                </div>
                <Button onClick={() => setShowAddExperience(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="border rounded-lg p-3 flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{exp.position}</div>
                    <div className="text-sm text-gray-600">{exp.company}</div>
                    <div className="text-xs text-gray-500">
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteExperience(exp.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {showAddExperience && (
                <div className="border rounded-lg p-4 space-y-3 bg-muted/50">
                  <Input placeholder="Position" value={newExperience.position} onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })} />
                  <Input placeholder="Company" value={newExperience.company} onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} />
                  <Textarea placeholder="Description" value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} rows={3} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input type="date" placeholder="Start Date" value={newExperience.startDate} onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })} />
                    <Input type="date" placeholder="End Date" value={newExperience.endDate} onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })} disabled={newExperience.isCurrent} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={newExperience.isCurrent} onChange={(e) => setNewExperience({ ...newExperience, isCurrent: e.target.checked })} />
                    <label className="text-sm">Currently working here</label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddExperience}>Save</Button>
                    <Button variant="outline" onClick={() => setShowAddExperience(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Certificates</CardTitle>
                  <CardDescription>Your certifications and achievements</CardDescription>
                </div>
                <Button onClick={() => setShowAddCertificate(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Certificate
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="border rounded-lg p-3 flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{cert.title}</div>
                    <div className="text-sm text-gray-600">{cert.issuingOrganization}</div>
                    <div className="text-xs text-gray-500">Issued: {cert.issueDate}</div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteCertificate(cert.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {showAddCertificate && (
                <div className="border rounded-lg p-4 space-y-3 bg-muted/50">
                  <Input placeholder="Certificate Title" value={newCertificate.title} onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })} />
                  <Input placeholder="Issuing Organization" value={newCertificate.issuingOrganization} onChange={(e) => setNewCertificate({ ...newCertificate, issuingOrganization: e.target.value })} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input type="date" placeholder="Issue Date" value={newCertificate.issueDate} onChange={(e) => setNewCertificate({ ...newCertificate, issueDate: e.target.value })} />
                    <Input type="date" placeholder="Expiry Date (optional)" value={newCertificate.expiryDate} onChange={(e) => setNewCertificate({ ...newCertificate, expiryDate: e.target.value })} />
                  </div>
                  <Input placeholder="Credential ID (optional)" value={newCertificate.credentialId} onChange={(e) => setNewCertificate({ ...newCertificate, credentialId: e.target.value })} />
                  <Input placeholder="Credential URL (optional)" value={newCertificate.credentialUrl} onChange={(e) => setNewCertificate({ ...newCertificate, credentialUrl: e.target.value })} />
                  <div className="flex gap-2">
                    <Button onClick={handleAddCertificate}>Save</Button>
                    <Button variant="outline" onClick={() => setShowAddCertificate(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Profile
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
