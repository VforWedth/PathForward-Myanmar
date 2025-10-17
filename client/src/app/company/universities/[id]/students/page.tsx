'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Users, Building2, ArrowLeft, Search, Filter } from 'lucide-react';

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

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  major: string;
  year: number;
  gpa?: number;
  skills?: string[];
  jobPreference: string;
  status: string;
  User: {
    email: string;
    phone: string;
    isVerified: boolean;
  };
}

interface University {
  id: string;
  universityName: string;
  location: string;
}

export default function UniversityStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const universityId = params.id as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [university, setUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    major: '',
    year: '',
    search: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'company') {
      router.push('/login');
      return;
    }

    fetchStudents();
  }, [user, router, universityId, filters]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.major) queryParams.append('major', filters.major);
      if (filters.year) queryParams.append('year', filters.year);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/universities/${universityId}/students?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStudents(data.data || []);
        
        // Extract university info from first student if available
        if (data.data && data.data.length > 0 && data.data[0].University) {
          setUniversity({
            id: universityId,
            universityName: data.data[0].University.universityName || 'University',
            location: data.data[0].University.location || ''
          });
        }
      } else if (response.status === 403) {
        toast.error('You are not connected to this university');
        router.push('/company/universities');
      } else {
        toast.error(data.message || 'Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error loading students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const getYearLabel = (year: number) => {
    switch (year) {
      case 1: return '1st Year';
      case 2: return '2nd Year';
      case 3: return '3rd Year';
      case 4: return '4th Year';
      case 5: return '5th Year';
      default: return `Year ${year}`;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'on_job':
        return 'bg-blue-100 text-blue-800';
      case 'internship_completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'on_job':
        return 'Currently Employed';
      case 'internship_completed':
        return 'Internship Completed';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center">
        <div className="text-[#567C8D]">Loading students...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header with Gradient */}
        <header className="relative isolate border-b border-black/5 bg-gradient-to-r from-[#2F4156] via-[#2F4156] to-[#567C8D] text-white shadow-lg">
          {/* Decorative blur effects */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -left-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
          </div>

          {/* Title row */}
          <div className="relative flex h-20 shrink-0 items-center gap-3 px-6">
            <Users className="h-8 w-8 text-emerald-300" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {university?.universityName || 'University'} Students
              </h1>
              <p className="text-sm text-white/80">
                {university?.location && `📍 ${university.location} • `}
                {students.length} {students.length === 1 ? 'student' : 'students'} found
              </p>
            </div>
          </div>

          {/* Breadcrumb row */}
          <div className="relative flex h-12 items-center gap-2 border-t border-white/10 bg-black/5 px-4">
            <SidebarTrigger className="-ml-1 text-white hover:bg-white/10 data-[state=open]:bg-white/10" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-white/20" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-white/90 hover:text-white">
                    Company
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-white/50" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/company/universities" className="text-white/90 hover:text-white">
                    Universities
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/50" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">Students</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => router.push('/company/universities')}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm border border-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Universities
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#F5EFEB]">
          <div className="max-w-7xl mx-auto p-8 w-full">

            {/* Filters */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#C8D9E6] shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-[#567C8D]" />
                <h3 className="text-lg font-semibold text-[#2F4156]">Filter Students</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2F4156] mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#567C8D]" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or skills..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-[#C8D9E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-[#2F4156]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2F4156] mb-2">Major</label>
                  <input
                    type="text"
                    placeholder="e.g., Computer Science"
                    value={filters.major}
                    onChange={(e) => setFilters({ ...filters, major: e.target.value })}
                    className="w-full px-4 py-2 border border-[#C8D9E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-[#2F4156]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2F4156] mb-2">Year</label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                    className="w-full px-4 py-2 border border-[#C8D9E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-[#2F4156]"
                  >
                    <option value="">All Years</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>
              </div>
              {(filters.search || filters.major || filters.year) && (
                <button
                  onClick={() => setFilters({ major: '', year: '', search: '' })}
                  className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Students Grid */}
            {students.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#C8D9E6] shadow-sm hover:shadow-md transition-all overflow-hidden hover:border-emerald-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-[#2F4156]">
                            {student.firstName} {student.lastName}
                          </h3>
                          {student.User?.isVerified && (
                            <span className="text-xs text-emerald-600">✓ Verified</span>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(student.status)}`}>
                          {getStatusText(student.status)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4 text-sm text-[#567C8D]">
                        <p>
                          <span className="font-medium text-[#2F4156]">🎓 Major:</span> {student.major}
                        </p>
                        <p>
                          <span className="font-medium text-[#2F4156]">📚 Year:</span> {getYearLabel(student.year)}
                        </p>
                        {student.gpa && (
                          <p>
                            <span className="font-medium text-[#2F4156]">📊 GPA:</span> {student.gpa.toFixed(2)}
                          </p>
                        )}
                        <p>
                          <span className="font-medium text-[#2F4156]">💼 Preference:</span> {student.jobPreference}
                        </p>
                      </div>

                      {student.skills && student.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-[#2F4156] mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {student.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-[#F5EFEB] text-[#2F4156] rounded text-xs ring-1 ring-[#E3EAF1]"
                              >
                                {skill}
                              </span>
                            ))}
                            {student.skills.length > 3 && (
                              <span className="px-2 py-1 bg-[#F5EFEB] text-[#567C8D] rounded text-xs ring-1 ring-[#E3EAF1]">
                                +{student.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-[#E3EAF1] flex gap-2">
                        <button
                          onClick={() => handleViewDetails(student)}
                          className="flex-1 px-4 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#243447] transition-colors text-sm font-medium"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => {
                            toast.info('This feature will be connected with the student module');
                            // TODO: Navigate to job application flow
                            // This will be connected when student module is integrated
                          }}
                          className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                        >
                          Invite to Job
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#C8D9E6] bg-white/60 p-12 text-center shadow-sm">
                <svg
                  className="w-20 h-20 mx-auto text-[#C8D9E6] mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <p className="text-lg text-[#2F4156] mb-2">No students found</p>
                <p className="text-sm text-[#567C8D]">
                  {filters.search || filters.major || filters.year
                    ? 'Try adjusting your filters'
                    : 'This university has no students yet'}
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#C8D9E6] p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-[#2F4156]">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <p className="text-[#567C8D] mt-1">
                  {selectedStudent.major} • {getYearLabel(selectedStudent.year)}
                </p>
              </div>
              <button
                onClick={() => setShowStudentModal(false)}
                className="text-[#567C8D] hover:text-[#2F4156] transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Status */}
              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedStudent.status)}`}>
                  {getStatusText(selectedStudent.status)}
                </span>
                {selectedStudent.User?.isVerified && (
                  <span className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Verified Student
                  </span>
                )}
              </div>

              {/* Student Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#2F4156] mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-[#567C8D]">📧</span>
                      <div>
                        <span className="font-medium text-[#2F4156]">Email:</span>
                        <br />
                        <a href={`mailto:${selectedStudent.User.email}`} className="text-emerald-600 hover:underline">
                          {selectedStudent.User.email}
                        </a>
                      </div>
                    </div>
                    {selectedStudent.User.phone && (
                      <div className="flex items-start gap-2">
                        <span className="text-[#567C8D]">📱</span>
                        <div>
                          <span className="font-medium text-[#2F4156]">Phone:</span>
                          <br />
                          <a href={`tel:${selectedStudent.User.phone}`} className="text-emerald-600 hover:underline">
                            {selectedStudent.User.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#2F4156] mb-3">Academic Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-[#567C8D]">🎓</span>
                      <div>
                        <span className="font-medium text-[#2F4156]">Major:</span>
                        <br />
                        <span className="text-[#567C8D]">{selectedStudent.major}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#567C8D]">📚</span>
                      <div>
                        <span className="font-medium text-[#2F4156]">Year:</span>
                        <br />
                        <span className="text-[#567C8D]">{getYearLabel(selectedStudent.year)}</span>
                      </div>
                    </div>
                    {selectedStudent.gpa && (
                      <div className="flex items-start gap-2">
                        <span className="text-[#567C8D]">📊</span>
                        <div>
                          <span className="font-medium text-[#2F4156]">GPA:</span>
                          <br />
                          <span className="text-[#567C8D]">{selectedStudent.gpa.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <span className="text-[#567C8D]">💼</span>
                      <div>
                        <span className="font-medium text-[#2F4156]">Job Preference:</span>
                        <br />
                        <span className="text-[#567C8D]">{selectedStudent.jobPreference}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {selectedStudent.skills && selectedStudent.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#2F4156] mb-3">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#F5EFEB] text-[#2F4156] rounded-full text-sm ring-1 ring-[#E3EAF1]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-[#E3EAF1] flex flex-wrap gap-3">
                <a
                  href={`mailto:${selectedStudent.User.email}?subject=Job Opportunity&body=Hello ${selectedStudent.firstName},`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#243447] transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </a>
                <button
                  onClick={() => {
                    toast.info('This feature will be available when student module is connected');
                    // TODO: Will be implemented when connecting with student module
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Invite to Apply for Job
                </button>
              </div>

              {/* Note about student module integration */}
              <div className="bg-[#F5EFEB] border border-[#C8D9E6] rounded-lg p-4">
                <p className="text-sm text-[#2F4156]">
                  <strong>📝 Note:</strong> Full student profile details, education history, experience,
                  and application features will be available once the student module is integrated.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
