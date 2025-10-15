// app/company/jobs/post/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';

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

interface JobForm {
  title: string;
  description: string;
  requirements: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  workMode: 'onsite' | 'remote' | 'ojt' | 'hybrid';
  salary: string;
  category: string;
  applicationDeadline: string;
  targetUniversities: string[];
  isPublic: boolean;
}

interface University {
  id: string;
  universityName: string;
  location: string;
}

export default function PostJob() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [connectedUniversities, setConnectedUniversities] = useState<University[]>([]);
  const [formData, setFormData] = useState<JobForm>({
    title: '',
    description: '',
    requirements: '',
    location: '',
    type: 'full-time',
    workMode: 'onsite',
    salary: '',
    category: '',
    applicationDeadline: '',
    targetUniversities: [],
    isPublic: true,
  });

  // Protect route and fetch connected universities
  useEffect(() => {
    if (user === undefined) return; // wait for hydration if your store sets undefined first
    if (!user || user.role !== 'company') {
      router.replace('/login');
      return;
    }

    // Fetch connected universities
    const fetchUniversities = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/universities/connected?status=active`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const unis = data.data.map((conn: any) => ({
              id: conn.University.id,
              universityName: conn.University.universityName,
              location: conn.University.location
            }));
            setConnectedUniversities(unis);
          }
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    fetchUniversities();
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
    // zero-out time for fair compare
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
      const payload = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        salary: formData.salary.trim(),
        category: formData.category.trim(),
        type: formData.type,
        workMode: formData.workMode,
        applicationDeadline: formData.applicationDeadline,
        targetUniversities: formData.targetUniversities,
        isPublic: formData.isPublic,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Job posted successfully!');
        router.push('/company/jobs');
      } else {
        toast.error(data.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Post job error:', error);
      toast.error('Failed to post job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Optional loading gate while auth hydrates
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading…</div>
      </div>
    );
  }

  if (!user || user.role !== 'company') return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Shared header to match the rest of company pages */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Company</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/company/jobs">Jobs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Post</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto pr-4">
              <button
                onClick={() => router.push('/company/dashboard')}
                className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-4xl mx-auto w-full">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Post a New Job</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Job Title *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Job Type *</label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Work Mode *</label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      value={formData.workMode}
                      onChange={(e) =>
                        setFormData({ ...formData, workMode: e.target.value as JobForm['workMode'] })
                      }
                    >
                      <option value="onsite">Onsite</option>
                      <option value="remote">Remote</option>
                      <option value="ojt">On-Job Training (OJT)</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Salary Range</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="e.g., $50,000 - $70,000"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Job Description *</label>
                  <textarea
                    rows={6}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Describe the job responsibilities, expectations, and what makes your company great..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Requirements *</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="List the required skills, qualifications, and experience..."
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Application Deadline *</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    value={formData.applicationDeadline}
                    onChange={(e) =>
                      setFormData({ ...formData, applicationDeadline: e.target.value })
                    }
                  />
                </div>

                {/* Job Visibility Settings */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Visibility</h3>
                  
                  <div className="mb-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">
                        Make this job public (visible to all students)
                      </span>
                    </label>
                    <p className="text-sm text-gray-500 ml-7 mt-1">
                      If unchecked, only students from selected universities can see this job
                    </p>
                  </div>

                  {connectedUniversities.length > 0 && (
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Target Universities {!formData.isPublic && '(Required)'}
                      </label>
                      <p className="text-sm text-gray-500 mb-3">
                        Select universities whose students can see this job posting
                      </p>
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                        {connectedUniversities.map((uni) => (
                          <label key={uni.id} className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.targetUniversities.includes(uni.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    targetUniversities: [...formData.targetUniversities, uni.id]
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    targetUniversities: formData.targetUniversities.filter(id => id !== uni.id)
                                  });
                                }
                              }}
                              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div>
                              <div className="text-gray-800 font-medium">{uni.universityName}</div>
                              <div className="text-sm text-gray-500">{uni.location}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {connectedUniversities.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        ℹ️ You haven't connected with any universities yet. 
                        <a href="/company/universities" className="underline ml-1">Connect with universities</a> to share targeted job postings.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                  >
                    {isLoading ? 'Posting Job...' : 'Post Job'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/company/jobs')}
                    className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
