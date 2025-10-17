// app/company/jobs/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import Link from 'next/link';

import { AppSidebar } from '@/components/ui/company/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Briefcase, Save, X } from 'lucide-react';

interface JobForm {
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  workMode: 'onsite' | 'remote' | 'ojt' | 'hybrid';
  salaryRange: string;
  skillsRequired: string[];
  majorsPreferred: string[];
  experienceLevel: 'entry' | 'mid' | 'senior';
  numberOfPositions: number;
  applicationDeadline: string;
  targetUniversities: string[];
  isPublic: boolean;
  status: 'active' | 'closed' | 'draft';
}

interface University {
  id: string;
  universityName: string;
  location: string;
}

export default function EditJob() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [connectedUniversities, setConnectedUniversities] = useState<University[]>([]);
  const [formData, setFormData] = useState<JobForm>({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    jobType: 'full-time',
    workMode: 'onsite',
    salaryRange: '',
    skillsRequired: [],
    majorsPreferred: [],
    experienceLevel: 'entry',
    numberOfPositions: 1,
    applicationDeadline: '',
    targetUniversities: [],
    isPublic: true,
    status: 'active',
  });

  // For handling multi-value inputs
  const [skillInput, setSkillInput] = useState('');
  const [majorInput, setMajorInput] = useState('');

  // Protect route and fetch job data
  useEffect(() => {
    if (user === undefined) return;
    if (!user || user.role !== 'company') {
      router.replace('/login');
      return;
    }

    if (!jobId) {
      toast.error('Job ID not found');
      router.push('/company/jobs');
      return;
    }

    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('token');

        // Fetch job details
        const jobResponse = await fetch(`${apiUrl}/company/jobs/${jobId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!jobResponse.ok) {
          toast.error('Failed to fetch job details');
          router.push('/company/jobs');
          return;
        }

        const jobData = await jobResponse.json();
        if (jobData.success && jobData.data) {
          const job = jobData.data;

          // Format deadline for input[type="date"]
          let deadline = '';
          if (job.deadline) {
            const d = new Date(job.deadline);
            deadline = d.toISOString().split('T')[0];
          }

          setFormData({
            title: job.title || '',
            description: job.description || '',
            requirements: job.requirements || '',
            responsibilities: job.responsibilities || '',
            location: job.location || '',
            jobType: job.jobType || 'full-time',
            workMode: job.workMode || 'onsite',
            salaryRange: job.salaryRange || '',
            skillsRequired: job.skillsRequired || [],
            majorsPreferred: job.majorsPreferred || [],
            experienceLevel: job.experienceLevel || 'entry',
            numberOfPositions: job.numberOfPositions || 1,
            applicationDeadline: deadline,
            targetUniversities: job.targetUniversities || [],
            isPublic: job.isPublic !== false,
            status: job.status || 'active',
          });
        }

        // Fetch connected universities
        const uniResponse = await fetch(`${apiUrl}/company/universities/connected?status=active`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (uniResponse.ok) {
          const uniData = await uniResponse.json();
          if (uniData.success && uniData.data) {
            const unis = uniData.data.map((conn: any) => ({
              id: conn.University.id,
              universityName: conn.University.universityName,
              location: conn.University.location
            }));
            setConnectedUniversities(unis);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load job data');
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [user, router, jobId]);

  const validate = () => {
    if (!formData.title.trim()) return 'Please enter a job title.';
    if (!formData.location.trim()) return 'Please enter a location.';
    if (!formData.description.trim()) return 'Please enter a job description.';
    if (!formData.requirements.trim()) return 'Please enter job requirements.';
    if (!formData.responsibilities.trim()) return 'Please enter job responsibilities.';
    if (!formData.applicationDeadline) return 'Please set an application deadline.';
    if (formData.numberOfPositions < 1) return 'Number of positions must be at least 1.';

    const today = new Date();
    const dl = new Date(formData.applicationDeadline);
    today.setHours(0, 0, 0, 0);
    dl.setHours(0, 0, 0, 0);
    if (dl < today) return 'Deadline cannot be in the past.';

    if (!formData.isPublic && formData.targetUniversities.length === 0) {
      return 'Please select at least one target university or make the job public.';
    }

    return null;
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skillsRequired.includes(skill)) {
      setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, skill] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(s => s !== skill)
    });
  };

  const addMajor = () => {
    const major = majorInput.trim();
    if (major && !formData.majorsPreferred.includes(major)) {
      setFormData({ ...formData, majorsPreferred: [...formData.majorsPreferred, major] });
      setMajorInput('');
    }
  };

  const removeMajor = (major: string) => {
    setFormData({
      ...formData,
      majorsPreferred: formData.majorsPreferred.filter(m => m !== major)
    });
  };

  const toggleUniversity = (universityId: string) => {
    if (formData.targetUniversities.includes(universityId)) {
      setFormData({
        ...formData,
        targetUniversities: formData.targetUniversities.filter(id => id !== universityId)
      });
    } else {
      setFormData({
        ...formData,
        targetUniversities: [...formData.targetUniversities, universityId]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        responsibilities: formData.responsibilities.trim(),
        location: formData.location.trim(),
        workMode: formData.workMode,
        type: formData.jobType,
        salary: formData.salaryRange.trim() || null,
        skillsRequired: formData.skillsRequired,
        majorsPreferred: formData.majorsPreferred,
        experienceLevel: formData.experienceLevel,
        numberOfPositions: formData.numberOfPositions,
        applicationDeadline: formData.applicationDeadline,
        targetUniversities: formData.targetUniversities,
        isPublic: formData.isPublic,
        status: formData.status,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/jobs/${jobId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Job updated successfully!');
        router.push('/company/jobs');
      } else {
        toast.error(data.message || 'Failed to update job');
      }
    } catch (error) {
      console.error('Update job error:', error);
      toast.error('Failed to update job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (user === undefined || isFetching) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center">
        <div className="text-[#567C8D]">Loading job data...</div>
      </div>
    );
  }

  if (!user || user.role !== 'company') return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Themed Gradient Header */}
        <header className="relative isolate border-b border-black/5 bg-gradient-to-r from-[#2F4156] via-[#2F4156] to-[#567C8D] text-white shadow-lg">
          {/* blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -left-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            {/* LEFT: title */}
            <div className="flex items-center gap-3">
              <Briefcase className="h-6 w-6" />
              <span className="text-base font-semibold sm:text-lg">
                Edit Job Posting
              </span>
            </div>

            {/* RIGHT (desktop): quick links */}
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/company/jobs"
                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
              >
                Back to Jobs
              </Link>
              <Link
                href="/company/dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-white text-[#2F4156] px-3 py-1.5 text-sm"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Breadcrumb Row */}
          <div className="relative mx-auto flex max-w-7xl items-center gap-2 px-4 pb-3 sm:px-6">
            <SidebarTrigger
              className="rounded-md bg-white/10 px-2 py-1.5 text-white hover:bg-white/20"
              aria-label="Toggle sidebar"
            />
            <Separator orientation="vertical" className="mr-2 h-4 bg-white/30" />
            <Breadcrumb>
              <BreadcrumbList className="text-white/90">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="hover:text-white">
                    Company
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/company/jobs" className="hover:text-white">
                    Jobs
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* mobile trigger */}
            <div className="ml-auto md:hidden">
              <SidebarTrigger className="text-white" aria-label="Toggle sidebar" />
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="min-h-[calc(100vh-4rem)] bg-[#F5EFEB]">
          <div className="mx-auto max-w-7xl p-6 sm:p-8">
            <section className="relative overflow-hidden rounded-2xl border border-[#C8D9E6] bg-white/70 shadow-sm backdrop-blur-sm">
              {/* subtle pattern tint */}
              <div className="absolute inset-0 bg-[radial-gradient(1200px_300px_at_0%_-10%,rgba(16,44,36,0.08),transparent),radial-gradient(800px_200px_at_100%_120%,rgba(86,124,141,0.08),transparent)]" />
              <div className="relative z-10 grid gap-6 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#2F4156]">
                    <Save className="h-5 w-5" />
                    <h1 className="text-xl font-semibold">Edit job posting</h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      formData.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      formData.status === 'closed' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="max-w-prose text-sm text-[#567C8D]">
                  Update job details, requirements, and visibility settings. All fields marked with * are required.
                </p>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="grid gap-6">
                  {/* Status Selection */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#2F4156]">Job Status *</label>
                    <select
                      required
                      className="w-full md:w-64 rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as JobForm['status'] })}
                    >
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                      <option value="draft">Draft</option>
                    </select>
                    <p className="mt-1 text-xs text-[#567C8D]">
                      Active jobs are visible to students. Closed jobs no longer accept applications.
                    </p>
                  </div>

                  {/* Title / Job Type */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Job Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Software Engineer"
                        className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Job Type *</label>
                      <select
                        required
                        className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        value={formData.jobType}
                        onChange={(e) =>
                          setFormData({ ...formData, jobType: e.target.value as JobForm['jobType'] })
                        }
                      >
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                        <option value="freelance">Freelance</option>
                      </select>
                    </div>
                  </div>

                  {/* Work Mode / Experience Level */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Work Mode *</label>
                      <select
                        required
                        className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        value={formData.workMode}
                        onChange={(e) => setFormData({ ...formData, workMode: e.target.value as JobForm['workMode'] })}
                      >
                        <option value="onsite">On-site</option>
                        <option value="remote">Remote</option>
                        <option value="ojt">OJT (On-the-Job Training)</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Experience Level *</label>
                      <select
                        required
                        className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        value={formData.experienceLevel}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as JobForm['experienceLevel'] })}
                      >
                        <option value="entry">Entry Level</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior Level</option>
                      </select>
                    </div>
                  </div>

                  {/* Location / Salary / Positions */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Location *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Yangon, Myanmar"
                        className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Salary Range</label>
                      <input
                        type="text"
                        placeholder="e.g., $50,000 - $70,000"
                        className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        value={formData.salaryRange}
                        onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Number of Positions *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        value={formData.numberOfPositions}
                        onChange={(e) => setFormData({ ...formData, numberOfPositions: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#2F4156]">Job Description *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Describe the role, expectations, and what makes your company great..."
                      className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#2F4156]">Responsibilities *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="List the key responsibilities and duties for this position..."
                      className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                      value={formData.responsibilities}
                      onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#2F4156]">Requirements *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="List the required skills, qualifications, and experience..."
                      className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    />
                  </div>

                  {/* Skills Required */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#2F4156]">Required Skills</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="e.g., JavaScript, React, Node.js"
                        className="flex-1 rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {formData.skillsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.skillsRequired.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5EFEB] text-[#2F4156] rounded-full text-sm ring-1 ring-[#E3EAF1]"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Majors Preferred */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#2F4156]">Preferred Majors</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="e.g., Computer Science, Information Technology"
                        className="flex-1 rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        value={majorInput}
                        onChange={(e) => setMajorInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addMajor();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addMajor}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {formData.majorsPreferred.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.majorsPreferred.map((major, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5EFEB] text-[#2F4156] rounded-full text-sm ring-1 ring-[#E3EAF1]"
                          >
                            {major}
                            <button
                              type="button"
                              onClick={() => removeMajor(major)}
                              className="hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Application Deadline */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#2F4156]">Application Deadline *</label>
                    <input
                      type="date"
                      required
                      className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                      value={formData.applicationDeadline}
                      onChange={(e) =>
                        setFormData({ ...formData, applicationDeadline: e.target.value })
                      }
                    />
                  </div>

                  {/* Target Universities Section */}
                  <div className="border-t border-[#E3EAF1] pt-6">
                    <h3 className="text-lg font-semibold text-[#2F4156] mb-4">Job Visibility</h3>

                    <div className="mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPublic}
                          onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 border-[#E3EAF1] rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-[#2F4156]">
                          Make this job public (visible to all students)
                        </span>
                      </label>
                    </div>

                    {!formData.isPublic && connectedUniversities.length > 0 && (
                      <div>
                        <p className="text-sm text-[#567C8D] mb-3">
                          Select universities that can see this job posting:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {connectedUniversities.map((uni) => (
                            <label
                              key={uni.id}
                              className="flex items-start gap-2 p-3 border border-[#E3EAF1] rounded-lg cursor-pointer hover:bg-[#F5EFEB] transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={formData.targetUniversities.includes(uni.id)}
                                onChange={() => toggleUniversity(uni.id)}
                                className="mt-1 w-4 h-4 text-emerald-600 border-[#E3EAF1] rounded focus:ring-emerald-500"
                              />
                              <div>
                                <div className="font-medium text-[#2F4156] text-sm">{uni.universityName}</div>
                                <div className="text-xs text-[#567C8D]">{uni.location}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {!formData.isPublic && connectedUniversities.length === 0 && (
                      <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        You don't have any connected universities. Please make the job public or connect with universities first.
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-white shadow-sm ring-1 ring-black/10 transition hover:translate-y-[-1px] hover:bg-emerald-700 disabled:opacity-70"
                    >
                      <Save className="h-5 w-5" />
                      {isLoading ? 'Saving Changes…' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/company/jobs')}
                      className="rounded-xl bg-white px-5 py-2.5 text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
