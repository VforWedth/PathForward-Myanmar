// app/company/applicants/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
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

import { toast, ToastContainer } from 'react-toastify';
import Link from 'next/link';
import { Users, Filter, ArrowLeft } from 'lucide-react';

interface Applicant {
  id: string;
  name: string;
  email: string;
  position: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string;
  skills: string[];
  experience: string;
  education: string;
  location?: string;
  major?: string;
  university?: string;
}

type FilterStatus = 'all' | Applicant['status'];

export default function CompanyApplicants() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [filters, setFilters] = useState<{
    status: FilterStatus;
    position: 'all' | string;
    search: string;
    city: 'all' | string;
    major: 'all' | string;
    university: 'all' | string;
  }>({
    status: 'all',
    position: 'all',
    search: '',
    city: 'all',
    major: 'all',
    university: 'all',
  });
  const [isLoading, setIsLoading] = useState(true);

  // auth + data load
  useEffect(() => {
    if (user === undefined) return; // wait for hydration
    if (!user || user.role !== 'company') {
      router.replace('/login');
      return;
    }

    const fetchApplicants = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.status !== 'all') params.append('status', filters.status);
        if (filters.position !== 'all') params.append('position', filters.position);
        if (filters.search) params.append('search', filters.search);
        if (filters.city !== 'all') params.append('city', filters.city);
        if (filters.major !== 'all') params.append('major', filters.major);
        if (filters.university !== 'all') params.append('university', filters.university);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/applicants?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Map backend data to frontend format
            const formattedApplicants = data.data.map((app: any) => ({
              id: app.id,
              name: app.applicant?.name || 'Unknown',
              email: app.applicant?.email || '',
              position: app.position || app.Job?.title || 'Unknown',
              status: app.status,
              appliedDate: new Date(app.createdAt).toLocaleDateString(),
              skills: app.applicant?.skills || [],
              experience: app.applicant?.experience || 'Not specified',
              education: app.applicant?.education || 'Not specified',
              location: app.applicant?.location,
              major: app.applicant?.major,
              university: app.applicant?.university,
            }));
            setApplicants(formattedApplicants);
          }
        } else {
          console.error('Failed to fetch applicants');
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, [user, router, filters]);

  // positions for filter (from data)
  const positionOptions = useMemo(() => {
    const set = new Set<string>();
    applicants.forEach(a => set.add(a.position));
    return Array.from(set).sort();
  }, [applicants]);

  // cities for filter (from data)
  const cityOptions = useMemo(() => {
    const set = new Set<string>();
    applicants.forEach(a => { if (a.location) set.add(a.location); });
    return Array.from(set).sort();
  }, [applicants]);

  // majors for filter (from data)
  const majorOptions = useMemo(() => {
    const set = new Set<string>();
    applicants.forEach(a => { if (a.major) set.add(a.major); });
    return Array.from(set).sort();
  }, [applicants]);

  // universities for filter (from data)
  const universityOptions = useMemo(() => {
    const set = new Set<string>();
    applicants.forEach(a => { if (a.university) set.add(a.university); });
    return Array.from(set).sort();
  }, [applicants]);

  // derived filtered list
  const filteredApplicants = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return applicants.filter(app => {
      if (filters.status !== 'all' && app.status !== filters.status) return false;
      if (filters.position !== 'all' && app.position !== filters.position) return false;
      if (!q) return true;
      const nameHit = app.name.toLowerCase().includes(q);
      const emailHit = app.email.toLowerCase().includes(q);
      const skillHit = app.skills.some(s => s.toLowerCase().includes(q));
      return nameHit || emailHit || skillHit;
    });
  }, [applicants, filters]);

  const updateApplicationStatus = async (applicantId: string, status: Applicant['status']) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/applicants/${applicantId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ status })
        }
      );

      if (response.ok) {
        setApplicants(prev => prev.map(app => (app.id === applicantId ? { ...app, status } : app)));
        if (selectedApplicant?.id === applicantId) {
          setSelectedApplicant(prev => (prev ? { ...prev, status } : prev));
        }

        const statusMessages: Record<Applicant['status'], string> = {
          accepted: 'Application accepted successfully!',
          rejected: 'Application rejected.',
          reviewed: 'Application marked as reviewed.',
          pending: 'Application status updated to pending.',
        };
        toast.success(statusMessages[status]);
      } else {
        toast.error('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const getStatusColor = (status: Applicant['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (user === undefined || isLoading) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center">
        <div className="text-[#567C8D]">Loading applicants...</div>
      </div>
    );
  }

  if (!user || user.role !== 'company') return null;

  return (
    <SidebarProvider>
      <ToastContainer position="top-right" />
      <AppSidebar />
      <SidebarInset>
        {/* THEMED TOP BAR (matches student) */}
        <header className="relative isolate border-b border-black/5 bg-gradient-to-r from-[#2F4156] via-[#2F4156] to-[#567C8D] text-white shadow-lg">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -left-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
         
              <Users className="h-6 w-6" />
              <span className="text-base font-semibold leading-none sm:text-lg">Applicants</span>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/company/dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Link>
            </div>
          </div>

          {/* breadcrumb row in the themed header */}
          <div className="relative mx-auto flex max-w-7xl items-center gap-2 px-4 pb-3 sm:px-6">
               <SidebarTrigger
                className="rounded-md bg-white/10 px-2 py-1.5 text-white hover:bg-white/20"
                aria-label="Toggle sidebar"
              />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4 bg-white/30" />
            <Breadcrumb>
              <BreadcrumbList className="text-white/90">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="hover:text-white">Company</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Applicants</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto md:hidden pr-2">
              <SidebarTrigger className="text-white" />
            </div>
          </div>
        </header>

        {/* PAGE BODY */}
        <div className="min-h-[calc(100vh-4rem)] bg-[#F5EFEB]">
          <div className="max-w-7xl mx-auto p-6 sm:p-8">
            {/* Filters (themed card) */}
            <div className="rounded-2xl border border-[#C8D9E6] bg-white p-6 shadow-sm mb-6">
              <div className="mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5 text-[#2F4156]" />
                <h3 className="text-lg font-semibold text-[#2F4156]">Filter Applicants</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-[#2F4156] mb-2">Status</label>
                  <select
                    className="w-full rounded-lg border border-[#E3EAF1] bg-white px-3 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters(f => ({ ...f, status: e.target.value as FilterStatus }))
                    }
                    aria-label="Filter by status"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2F4156] mb-2">Position</label>
                  <select
                    className="w-full rounded-lg border border-[#E3EAF1] bg-white px-3 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    value={filters.position}
                    onChange={(e) => setFilters(f => ({ ...f, position: e.target.value }))}
                    aria-label="Filter by position"
                  >
                    <option value="all">All Positions</option>
                    {positionOptions.map(pos => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2F4156] mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or skills..."
                    className="w-full rounded-lg border border-[#E3EAF1] bg-white px-3 py-2 text-[#2F4156] placeholder-[#567C8D] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    value={filters.search}
                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                    aria-label="Search applicants"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={filters.city}
                    onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))}
                    aria-label="Filter by city"
                  >
                    <option value="all">All Cities</option>
                    {cityOptions.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={filters.major}
                    onChange={(e) => setFilters(f => ({ ...f, major: e.target.value }))}
                    aria-label="Filter by major"
                  >
                    <option value="all">All Majors</option>
                    {majorOptions.map(major => (
                      <option key={major} value={major}>
                        {major}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={filters.university}
                    onChange={(e) => setFilters(f => ({ ...f, university: e.target.value }))}
                    aria-label="Filter by university"
                  >
                    <option value="all">All Universities</option>
                    {universityOptions.map(uni => (
                      <option key={uni} value={uni}>
                        {uni}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Applicant List */}
              <div className="lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[#2F4156]">
                    Applicants ({filteredApplicants.length})
                  </h3>
                  <span className="text-sm text-[#567C8D]">
                    Showing {filteredApplicants.length} of {applicants.length} total
                  </span>
                </div>

                {filteredApplicants.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#C8D9E6] bg-white/60 p-8 text-center shadow-sm">
                    <svg
                      className="mx-auto mb-4 h-16 w-16 text-[#C8D9E6]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <p className="mb-1 text-[#2F4156]">No applicants found</p>
                    <p className="text-sm text-[#567C8D]">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplicants.map(applicant => (
                      <div
                        key={applicant.id}
                        className={`cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                          selectedApplicant?.id === applicant.id
                            ? 'border-[#567C8D] ring-2 ring-[#C8D9E6]'
                            : 'border-[#E3EAF1]'
                        }`}
                        onClick={() => setSelectedApplicant(applicant)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') setSelectedApplicant(applicant);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-[#2F4156]">{applicant.name}</h4>
                            <p className="text-[#567C8D]">{applicant.position}</p>
                            <p className="text-sm text-[#567C8D]/80">{applicant.email}</p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                              applicant.status
                            )}`}
                          >
                            {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                          </span>
                        </div>

                        <div className="mt-4">
                          <div className="mb-3 flex flex-wrap gap-2">
                            {applicant.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="rounded-md bg-[#F5EFEB] px-2 py-1 text-sm text-[#2F4156] ring-1 ring-[#E3EAF1]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm text-[#567C8D]">
                            <span>Applied: {applicant.appliedDate}</span>
                            <span>Experience: {applicant.experience}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Applicant Details Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 rounded-2xl border border-[#C8D9E6] bg-white p-6 shadow-sm">
                  {selectedApplicant ? (
                    <>
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="text-xl font-semibold text-[#2F4156]">Applicant Details</h3>
                        <button
                          onClick={() => setSelectedApplicant(null)}
                          className="text-[#567C8D] hover:text-[#2F4156]"
                          aria-label="Close details"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="border-b pb-4">
                          <h4 className="mb-2 font-semibold text-[#2F4156]">Personal Information</h4>
                          <div className="space-y-1 text-sm text-[#567C8D]">
                            <p><span className="font-medium text-[#2F4156]">Name:</span> {selectedApplicant.name}</p>
                            <p><span className="font-medium text-[#2F4156]">Email:</span> {selectedApplicant.email}</p>
                            <p><span className="font-medium text-[#2F4156]">Position:</span> {selectedApplicant.position}</p>
                            <p><span className="font-medium text-[#2F4156]">Applied:</span> {selectedApplicant.appliedDate}</p>
                          </div>
                        </div>

                        <div className="border-b pb-4">
                          <h4 className="mb-2 font-semibold text-[#2F4156]">Education</h4>
                          <p className="text-sm text-[#567C8D]">{selectedApplicant.education}</p>
                        </div>

                        <div className="border-b pb-4">
                          <h4 className="mb-2 font-semibold text-[#2F4156]">Experience</h4>
                          <p className="text-sm text-[#567C8D]">{selectedApplicant.experience}</p>
                        </div>

                        <div className="border-b pb-4">
                          <h4 className="mb-2 font-semibold text-[#2F4156]">Skills</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedApplicant.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="rounded-md bg-emerald-50 px-2 py-1 text-sm text-emerald-800 ring-1 ring-emerald-600/15"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <h4 className="mb-3 font-semibold text-[#2F4156]">Update Status</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => updateApplicationStatus(selectedApplicant.id, 'accepted')}
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white transition-colors hover:bg-emerald-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(selectedApplicant.id, 'rejected')}
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(selectedApplicant.id, 'reviewed')}
                              className="col-span-2 rounded-lg bg-[#2F4156] px-3 py-2 text-sm text-white transition-colors hover:bg-[#243447]"
                            >
                              Mark as Reviewed
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center">
                      <svg className="mx-auto mb-4 h-16 w-16 text-[#C8D9E6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-[#567C8D]">Select an applicant to view details</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
