// app/company/jobs/post/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Briefcase, PlusCircle } from 'lucide-react';

interface JobForm {
  title: string;
  description: string;
  requirements: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: string;
  category: string;
  applicationDeadline: string;
}

export default function PostJob() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<JobForm>({
    title: '',
    description: '',
    requirements: '',
    location: '',
    type: 'full-time',
    salary: '',
    category: '',
    applicationDeadline: '',
  });

  // Protect route
  useEffect(() => {
    if (user === undefined) return;
    if (!user || user.role !== 'company') {
      router.replace('/login');
    }
  }, [user, router]);

  const validate = () => {
    if (!formData.title.trim()) return 'Please enter a job title.';
    if (!formData.location.trim()) return 'Please enter a location.';
    if (!formData.description.trim()) return 'Please enter a job description.';
    if (!formData.requirements.trim()) return 'Please enter job requirements.';
    if (!formData.category.trim()) return 'Please select a category.';
    if (!formData.applicationDeadline) return 'Please set an application deadline.';

    const today = new Date();
    const dl = new Date(formData.applicationDeadline);
    today.setHours(0, 0, 0, 0);
    dl.setHours(0, 0, 0, 0);
    if (dl < today) return 'Deadline cannot be in the past.';

    return null;
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const payload = {
        ...formData,
        title: formData.title.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        salary: formData.salary.trim(),
        category: formData.category.trim(),
      };
      console.log('POST /api/jobs => ', payload);

      toast.success('Job posted successfully!');
      router.push('/company/jobs');
    } catch {
      toast.error('Failed to post job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center">
        <div className="text-[#567C8D]">Loading…</div>
      </div>
    );
  }

  if (!user || user.role !== 'company') return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Themed Gradient Header with SidebarTrigger on LEFT */}
        <header className="relative isolate border-b border-black/5 bg-gradient-to-r from-[#2F4156] via-[#2F4156] to-[#567C8D] text-white shadow-lg">
          {/* blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -left-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            {/* LEFT: sidebar trigger + title */}
            <div className="flex items-center gap-3">
            
              <Briefcase className="h-6 w-6" />
              <span className="text-base font-semibold sm:text-lg">
                Post New Job
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
                  <BreadcrumbPage>Post</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* mobile trigger (kept for parity) */}
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
                <div className="flex items-center gap-2 text-[#2F4156]">
                  <PlusCircle className="h-5 w-5" />
                  <h1 className="text-xl font-semibold">Create a job posting</h1>
                </div>
                <p className="max-w-prose text-sm text-[#567C8D]">
                  Share role details, requirements, and timelines. You can edit later from the Jobs page.
                </p>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="grid gap-6">
                  {/* Title / Type */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Job Title *</label>
                      <input
                        type="text"
                        required
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
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value as JobForm['type'] })
                        }
                      >
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  {/* Location / Salary */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Location *</label>
                      <input
                        type="text"
                        required
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
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#2F4156]">Job Description *</label>
                    <textarea
                      rows={6}
                      required
                      placeholder="Describe the responsibilities, expectations, and what makes your company great..."
                      className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#2F4156]">Requirements *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="List required skills, qualifications, and experience…"
                      className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    />
                  </div>

                  {/* Category / Deadline */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Category *</label>
                      <select
                        required
                        className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        <option value="engineering">Engineering</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        <option value="sales">Sales</option>
                        <option value="finance">Finance</option>
                        <option value="hr">Human Resources</option>
                      </select>
                    </div>

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
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#2F4156] px-5 py-2.5 text-white shadow-sm ring-1 ring-black/10 transition hover:translate-y-[-1px] hover:bg-[#243447] disabled:opacity-70"
                    >
                      <PlusCircle className="h-5 w-5" />
                      {isLoading ? 'Posting Job…' : 'Post Job'}
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
