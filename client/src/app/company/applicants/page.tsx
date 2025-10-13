// app/company/applicants/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AppSidebar } from '@/components/ui/app-sidebar';
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
  }>({
    status: 'all',
    position: 'all',
    search: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // auth + data load
  useEffect(() => {
    if (user === undefined) return; // wait for hydration
    if (!user || user.role !== 'company') {
      router.replace('/login');
      return;
    }

    // mock data — replace with API call
    const mockApplicants: Applicant[] = [
      {
        id: '1',
        name: 'Aung Aung',
        email: 'aung@example.com',
        position: 'Frontend Developer',
        status: 'pending',
        appliedDate: '2024-01-15',
        skills: ['React', 'TypeScript', 'Next.js'],
        experience: '2 years',
        education: 'B.Sc Computer Science',
      },
      {
        id: '2',
        name: 'Mi Mi',
        email: 'mimi@example.com',
        position: 'Backend Developer',
        status: 'reviewed',
        appliedDate: '2024-01-14',
        skills: ['Node.js', 'Python', 'MongoDB'],
        experience: '3 years',
        education: 'B.E Software Engineering',
      },
      {
        id: '3',
        name: 'Ko Ko',
        email: 'koko@example.com',
        position: 'Frontend Developer',
        status: 'accepted',
        appliedDate: '2024-01-12',
        skills: ['Vue.js', 'JavaScript', 'CSS'],
        experience: '1 year',
        education: 'B.Tech Information Technology',
      },
    ];

    setApplicants(mockApplicants);
    setIsLoading(false);
  }, [user, router]);

  // positions for filter (from data)
  const positionOptions = useMemo(() => {
    const set = new Set<string>();
    applicants.forEach(a => set.add(a.position));
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

  const updateApplicationStatus = (applicantId: string, status: Applicant['status']) => {
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading applicants...</div>
      </div>
    );
  }

  if (!user || user.role !== 'company') return null;

  return (
    <SidebarProvider>
      <ToastContainer position="top-right" />
      <AppSidebar />
      <SidebarInset>
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
                  <BreadcrumbPage>Applicants</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto pr-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/company/dashboard')}
                  className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-7xl mx-auto p-8">
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Filter Applicants</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or skills..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={filters.search}
                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                    aria-label="Search applicants"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Applicant List */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Applicants ({filteredApplicants.length})</h3>
                  <span className="text-sm text-gray-500">
                    Showing {filteredApplicants.length} of {applicants.length} total
                  </span>
                </div>

                {filteredApplicants.length === 0 ? (
                  <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-300 mb-4"
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
                    <p className="text-gray-500 mb-2">No applicants found</p>
                    <p className="text-sm text-gray-400">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplicants.map(applicant => (
                      <div
                        key={applicant.id}
                        className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${
                          selectedApplicant?.id === applicant.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-blue-500'
                        } hover:shadow-lg transition cursor-pointer`}
                        onClick={() => setSelectedApplicant(applicant)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') setSelectedApplicant(applicant);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-semibold">{applicant.name}</h4>
                            <p className="text-gray-600">{applicant.position}</p>
                            <p className="text-sm text-gray-500">{applicant.email}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(applicant.status)}`}>
                            {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                          </span>
                        </div>

                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {applicant.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-600">
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
                <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
                  {selectedApplicant ? (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">Applicant Details</h3>
                        <button
                          onClick={() => setSelectedApplicant(null)}
                          className="text-gray-400 hover:text-gray-600"
                          aria-label="Close details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="pb-4 border-b">
                          <h4 className="font-semibold text-gray-700 mb-2">Personal Information</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Name:</span> {selectedApplicant.name}</p>
                            <p><span className="font-medium">Email:</span> {selectedApplicant.email}</p>
                            <p><span className="font-medium">Position:</span> {selectedApplicant.position}</p>
                            <p><span className="font-medium">Applied:</span> {selectedApplicant.appliedDate}</p>
                          </div>
                        </div>

                        <div className="pb-4 border-b">
                          <h4 className="font-semibold text-gray-700 mb-2">Education</h4>
                          <p className="text-sm">{selectedApplicant.education}</p>
                        </div>

                        <div className="pb-4 border-b">
                          <h4 className="font-semibold text-gray-700 mb-2">Experience</h4>
                          <p className="text-sm">{selectedApplicant.experience}</p>
                        </div>

                        <div className="pb-4 border-b">
                          <h4 className="font-semibold text-gray-700 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedApplicant.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <h4 className="font-semibold text-gray-700 mb-3">Update Status</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => updateApplicationStatus(selectedApplicant.id, 'accepted')}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(selectedApplicant.id, 'rejected')}
                              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(selectedApplicant.id, 'reviewed')}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors col-span-2"
                            >
                              Mark as Reviewed
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-gray-500">Select an applicant to view details</p>
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
