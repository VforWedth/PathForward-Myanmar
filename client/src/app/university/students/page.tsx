// app/university/students/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import * as universityApi from "@/lib/universityApi";
import { Pagination } from "@/components/ui/Pagination";

// Sidebar layout primitives
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Your simplified university sidebar (4 links)
import { AppSidebar } from "@/components/ui/university/app-sidebar"; // adjust path if needed

// lucide icons
import {
  Users,
  X,
  GraduationCap,
  BarChart3,
  CalendarDays,
  UserRound,
  Mail,
  IdCard,
  Building2,
  BadgeCheck,
  Briefcase,
  Hourglass,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber?: string;
  major: string;
  year: number;
  verificationStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  status: "available" | "on_job" | "internship_completed";
  skills: string[];
  cvUrl?: string;
  User: {
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function StudentManagement() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [students, setStudents] = useState<Student[]>([]);
  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationAction, setVerificationAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [filters, setFilters] = useState({
    major: "all",
    year: "all",
    verificationStatus: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });

  useEffect(() => {
    if (!user || user.role !== "university") {
      router.push("/login");
      return;
    }

    const fetchStudents = async () => {
      try {
        const response = await universityApi.getStudents();
        if (response.success) {
          const allStudents = response.students || response.data || [];
          setStudents(allStudents);
          setFilteredStudents(allStudents);

          // Filter pending verifications
          const pending = allStudents.filter((s: Student) => s.verificationStatus === 'pending');
          setPendingStudents(pending);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to load students');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [user, router]);

  useEffect(() => {
    let filtered = students;

    if (filters.major !== "all") {
      filtered = filtered.filter(
        (student) => student.major === filters.major
      );
    }

    if (filters.year !== "all") {
      filtered = filtered.filter((student) => student.year.toString() === filters.year);
    }

    if (filters.verificationStatus !== "all") {
      filtered = filtered.filter(
        (student) => student.verificationStatus === filters.verificationStatus
      );
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          `${student.firstName} ${student.lastName}`.toLowerCase().includes(q) ||
          student.rollNumber?.toLowerCase().includes(q) ||
          student.skills.some((skill) => skill.toLowerCase().includes(q))
      );
    }

    // Update pagination
    setPagination(prev => ({
      ...prev,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.itemsPerPage)
    }));

    setFilteredStudents(filtered);
  }, [students, filters]);

  // Paginated students
  const paginatedStudents = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, pagination.currentPage, pagination.itemsPerPage]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    setSelectedStudent(null); // Clear selection when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusColor = (status: Student["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 ring-1 ring-green-200";
      case "on_job":
        return "bg-blue-100 text-blue-800 ring-1 ring-blue-200";
      case "internship_completed":
        return "bg-purple-100 text-purple-800 ring-1 ring-purple-200";
      default:
        return "bg-gray-100 text-gray-800 ring-1 ring-gray-200";
    }
  };

  const getVerificationColor = (status: Student["verificationStatus"]) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 ring-1 ring-amber-200";
      case "rejected":
        return "bg-red-100 text-red-800 ring-1 ring-red-200";
      default:
        return "bg-gray-100 text-gray-800 ring-1 ring-gray-200";
    }
  };

  // Actions
  const handleViewFullProfile = (student: Student) => {
    toast.info(`Opening full profile for ${student.firstName} ${student.lastName}`);
    // router.push(`/university/students/${student.id}`);
  };

  const handleVerifyStudent = (student: Student, action: 'approve' | 'reject') => {
    setSelectedStudent(student);
    setVerificationAction(action);
    setShowVerificationModal(true);
  };

  const handleSaveVerification = async () => {
    if (!selectedStudent) return;

    try {
      const response = await universityApi.verifyStudent(selectedStudent.id, {
        action: verificationAction,
        reason: verificationAction === 'reject' ? rejectionReason : undefined,
      });

      if (response.success) {
        // Refresh students list
        const studentsResponse = await universityApi.getStudents();
        if (studentsResponse.success) {
          const allStudents = studentsResponse.students || studentsResponse.data || [];
          setStudents(allStudents);
          setFilteredStudents(allStudents);
          const pending = allStudents.filter((s: Student) => s.verificationStatus === 'pending');
          setPendingStudents(pending);
        }

        setShowVerificationModal(false);
        setRejectionReason('');
        setSelectedStudent(null);
        toast.success(`Student ${verificationAction === 'approve' ? 'approved' : 'rejected'} successfully`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to verify student');
    }
  };

  const handleGenerateStudentReport = (student: Student) => {
    toast.info(`Generating report for ${student.firstName} ${student.lastName}`);
    const reportData = {
      studentName: `${student.firstName} ${student.lastName}`,
      rollNumber: student.rollNumber,
      major: student.major,
      year: student.year,
      status: student.status,
      verificationStatus: student.verificationStatus,
      skills: student.skills,
      generatedAt: new Date().toLocaleString(),
    };
    console.log("Student Report:", reportData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading students...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      {/* Left rail */}
      <AppSidebar />

      {/* Right content pane */}
      <SidebarInset>
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold text-gray-900">
              Student Management
            </h1>
          </div>
        </header>

        {/* Page body */}
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto p-8">
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filter Students</h3>
                <div className="hidden md:flex items-center gap-2 text-gray-500">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm">Use filters to refine results</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Major
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={filters.major}
                    onChange={(e) =>
                      setFilters({ ...filters, major: e.target.value })
                    }
                  >
                    <option value="all">All Majors</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={filters.year}
                    onChange={(e) =>
                      setFilters({ ...filters, year: e.target.value })
                    }
                  >
                    <option value="all">All Years</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={filters.verificationStatus}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        verificationStatus: e.target.value,
                      })
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, roll number..."
                      className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500"
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Verifications Section */}
            {pendingStudents.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-100 p-2">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pending Verifications
                      </h3>
                      <p className="text-sm text-gray-600">
                        {pendingStudents.length} student{pendingStudents.length !== 1 ? 's' : ''} waiting for verification
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {pendingStudents.slice(0, 5).map((student) => (
                    <div
                      key={student.id}
                      className="bg-white p-4 rounded-lg border border-amber-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {student.firstName} {student.lastName}
                          </h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1">
                              <IdCard className="h-4 w-4" />
                              {student.rollNumber || 'No Roll Number'}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {student.major}
                            </span>
                            <span>Year {student.year}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVerifyStudent(student, 'approve')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerifyStudent(student, 'reject')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Student List */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">
                    Students ({filteredStudents.length})
                  </h3>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">Per page:</label>
                    <select
                      className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={pagination.itemsPerPage}
                      onChange={(e) => setPagination(prev => ({
                        ...prev,
                        itemsPerPage: Number(e.target.value),
                        currentPage: 1
                      }))}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>

                {paginatedStudents.length === 0 ? (
                  <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 mb-2">No students found</p>
                    <p className="text-sm text-gray-400">
                      Try adjusting your filters
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {paginatedStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`bg-white p-6 rounded-lg shadow-md border-l-4 cursor-pointer transition-all ${
                          selectedStudent?.id === student.id
                            ? "border-blue-600 bg-blue-50 transform scale-[1.02]"
                            : "border-gray-300 hover:shadow-lg"
                        }`}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-800">
                              {student.firstName} {student.lastName}
                            </h4>
                            <p className="text-gray-600">
                              <span className="inline-flex items-center gap-1">
                                <IdCard className="h-4 w-4 text-gray-500" />
                                {student.rollNumber || 'No Roll Number'}
                              </span>{" "}
                              •{" "}
                              <span className="inline-flex items-center gap-1">
                                <Building2 className="h-4 w-4 text-gray-500" />
                                {student.major}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500 inline-flex items-center gap-1">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {student.User.email}
                            </p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                student.status
                              )}`}
                            >
                              {student.status.replace('_', ' ').charAt(0).toUpperCase() +
                                student.status.replace('_', ' ').slice(1)}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getVerificationColor(
                                student.verificationStatus
                              )}`}
                            >
                              {student.verificationStatus
                                .charAt(0)
                                .toUpperCase() +
                                student.verificationStatus.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {student.skills.slice(0, 4).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                            {student.skills.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-sm">
                                +{student.skills.length - 4} more
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 items-center text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1">
                              <GraduationCap className="h-4 w-4 text-gray-500" />
                              Year: {student.year}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <BadgeCheck className="h-4 w-4 text-gray-500" />
                              Status: {student.verificationStatus}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-4 w-4 text-gray-500" />
                              Updated: {new Date(student.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="mt-6">
                        <Pagination
                          currentPage={pagination.currentPage}
                          totalPages={pagination.totalPages}
                          totalItems={pagination.totalItems}
                          itemsPerPage={pagination.itemsPerPage}
                          onPageChange={handlePageChange}
                          itemName="students"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Student Details Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md sticky top-8 max-h-[90vh] overflow-y-auto">
                  {selectedStudent ? (
                    <>
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Student Details
                        </h3>
                        <button
                          onClick={() => setSelectedStudent(null)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Close"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Personal Info */}
                        <div className="pb-4 border-b">
                          <h4 className="font-semibold text-gray-700 mb-3">
                            Personal Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="inline-flex items-center gap-2">
                              <UserRound className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Name:</span>{" "}
                              {selectedStudent.firstName} {selectedStudent.lastName}
                            </p>
                            <p className="inline-flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Email:</span>{" "}
                              {selectedStudent.User.email}
                            </p>
                            <p className="inline-flex items-center gap-2">
                              <IdCard className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Roll Number:</span>{" "}
                              {selectedStudent.rollNumber || 'Not provided'}
                            </p>
                            <p className="inline-flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Major:</span>{" "}
                              {selectedStudent.major}
                            </p>
                            <p className="inline-flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Year:</span>{" "}
                              {selectedStudent.year}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="pb-4 border-b">
                          <h4 className="font-semibold text-gray-700 mb-3">
                            Status Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                Job Status:
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                  selectedStudent.status
                                )}`}
                              >
                                {selectedStudent.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                Verification Status:
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getVerificationColor(
                                  selectedStudent.verificationStatus
                                )}`}
                              >
                                {selectedStudent.verificationStatus}
                              </span>
                            </div>
                            <p className="inline-flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Last Updated:</span>{" "}
                              {new Date(selectedStudent.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="pb-4 border-b">
                          <h4 className="font-semibold text-gray-700 mb-3">
                            Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedStudent.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2">
                          <h4 className="font-semibold text-gray-700 mb-3">
                            Quick Actions
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {selectedStudent.verificationStatus === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleVerifyStudent(selectedStudent, 'approve')}
                                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm transition-colors"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Approve Verification
                                </button>
                                <button
                                  onClick={() => handleVerifyStudent(selectedStudent, 'reject')}
                                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Reject Verification
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleViewFullProfile(selectedStudent)}
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                            >
                              <UserRound className="h-4 w-4" />
                              View Full Profile
                            </button>
                            <button
                              onClick={() =>
                                handleGenerateStudentReport(selectedStudent)
                              }
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm transition-colors"
                            >
                              <BarChart3 className="h-4 w-4" />
                              Generate Student Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserRound className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-gray-500">
                        Select a student to view details
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Click on any student from the list
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>

      {/* Verification Modal */}
      {showVerificationModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {verificationAction === 'approve' ? 'Approve' : 'Reject'} Student Verification
            </h3>
            <p className="text-gray-600 mb-4">
              {verificationAction === 'approve'
                ? `Approve verification request for ${selectedStudent.firstName} ${selectedStudent.lastName}?`
                : `Reject verification request for ${selectedStudent.firstName} ${selectedStudent.lastName}`
              }
            </p>

            {verificationAction === 'reject' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  rows={4}
                  required
                />
              </div>
            )}

            <div className="rounded-lg bg-gray-50 p-3 mb-6">
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Name:</span> {selectedStudent.firstName} {selectedStudent.lastName}</p>
                <p><span className="font-medium">Roll Number:</span> {selectedStudent.rollNumber || 'N/A'}</p>
                <p><span className="font-medium">Major:</span> {selectedStudent.major}</p>
                <p><span className="font-medium">Year:</span> {selectedStudent.year}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSaveVerification}
                disabled={verificationAction === 'reject' && !rejectionReason.trim()}
                className={`flex-1 py-2 rounded-lg text-white transition-colors ${
                  verificationAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {verificationAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
