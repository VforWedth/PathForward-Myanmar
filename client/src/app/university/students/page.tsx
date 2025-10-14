// app/university/students/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";

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
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  year: string;
  gpa: string;
  status: "active" | "graduated" | "inactive";
  employmentStatus: "unemployed" | "internship" | "employed" | "seeking";
  skills: string[];
  lastUpdated: string;
}

export default function StudentManagement() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmploymentModal, setShowEmploymentModal] = useState(false);
  const [newEmploymentStatus, setNewEmploymentStatus] =
    useState<Student["employmentStatus"]>("unemployed");
  const [filters, setFilters] = useState({
    department: "all",
    year: "all",
    employmentStatus: "all",
    search: "",
  });

  useEffect(() => {
    if (!user || user.role !== "university") {
      router.push("/login");
      return;
    }

    // Mock data
    const mockStudents: Student[] = [
      {
        id: "1",
        name: "Aung Aung",
        email: "aung@university.edu.mm",
        studentId: "STU-2023-001",
        department: "Computer Science",
        year: "Final Year",
        gpa: "3.8",
        status: "active",
        employmentStatus: "seeking",
        skills: ["React", "Python", "Machine Learning"],
        lastUpdated: "2024-01-15",
      },
      {
        id: "2",
        name: "Mi Mi",
        email: "mimi@university.edu.mm",
        studentId: "STU-2023-002",
        department: "Software Engineering",
        year: "Third Year",
        gpa: "3.9",
        status: "active",
        employmentStatus: "internship",
        skills: ["Java", "Spring Boot", "Database Design"],
        lastUpdated: "2024-01-14",
      },
      {
        id: "3",
        name: "Ko Ko",
        email: "koko@university.edu.mm",
        studentId: "STU-2022-001",
        department: "Computer Science",
        year: "Graduated",
        gpa: "3.7",
        status: "graduated",
        employmentStatus: "employed",
        skills: ["JavaScript", "Node.js", "AWS"],
        lastUpdated: "2024-01-10",
      },
    ];

    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
    setIsLoading(false);
  }, [user, router]);

  useEffect(() => {
    let filtered = students;

    if (filters.department !== "all") {
      filtered = filtered.filter(
        (student) => student.department === filters.department
      );
    }

    if (filters.year !== "all") {
      filtered = filtered.filter((student) => student.year === filters.year);
    }

    if (filters.employmentStatus !== "all") {
      filtered = filtered.filter(
        (student) => student.employmentStatus === filters.employmentStatus
      );
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(q) ||
          student.studentId.toLowerCase().includes(q) ||
          student.skills.some((skill) => skill.toLowerCase().includes(q))
      );
    }

    setFilteredStudents(filtered);
  }, [students, filters]);

  const getStatusColor = (status: Student["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 ring-1 ring-green-200";
      case "graduated":
        return "bg-blue-100 text-blue-800 ring-1 ring-blue-200";
      case "inactive":
        return "bg-red-100 text-red-800 ring-1 ring-red-200";
      default:
        return "bg-gray-100 text-gray-800 ring-1 ring-gray-200";
    }
  };

  const getEmploymentColor = (status: Student["employmentStatus"]) => {
    switch (status) {
      case "employed":
        return "bg-green-100 text-green-800 ring-1 ring-green-200";
      case "internship":
        return "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200";
      case "seeking":
        return "bg-orange-100 text-orange-800 ring-1 ring-orange-200";
      case "unemployed":
        return "bg-red-100 text-red-800 ring-1 ring-red-200";
      default:
        return "bg-gray-100 text-gray-800 ring-1 ring-gray-200";
    }
  };

  // Actions
  const handleViewFullProfile = (student: Student) => {
    toast.info(`Opening full profile for ${student.name}`);
    // router.push(`/university/students/${student.id}`);
  };

  const handleUpdateEmploymentStatus = (student: Student) => {
    setSelectedStudent(student);
    setNewEmploymentStatus(student.employmentStatus);
    setShowEmploymentModal(true);
  };

  const handleSaveEmploymentStatus = () => {
    if (selectedStudent) {
      const updatedStudents = students.map((s) =>
        s.id === selectedStudent.id
          ? {
              ...s,
              employmentStatus: newEmploymentStatus,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : s
      );
      setStudents(updatedStudents);
      setSelectedStudent({
        ...selectedStudent,
        employmentStatus: newEmploymentStatus,
      });
      setShowEmploymentModal(false);
      toast.success(
        `Employment status updated to ${newEmploymentStatus} for ${selectedStudent.name}`
      );
    }
  };

  const handleGenerateStudentReport = (student: Student) => {
    toast.info(`Generating report for ${student.name}`);
    const reportData = {
      studentName: student.name,
      studentId: student.studentId,
      department: student.department,
      employmentStatus: student.employmentStatus,
      skills: student.skills,
      gpa: student.gpa,
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
                    Department
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={filters.department}
                    onChange={(e) =>
                      setFilters({ ...filters, department: e.target.value })
                    }
                  >
                    <option value="all">All Departments</option>
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
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={filters.employmentStatus}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        employmentStatus: e.target.value,
                      })
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="seeking">Seeking</option>
                    <option value="internship">Internship</option>
                    <option value="employed">Employed</option>
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
                      placeholder="Search by name, ID, or skills..."
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Student List */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">
                    Students ({filteredStudents.length})
                  </h3>
                  <span className="text-sm text-gray-500">
                    Showing {filteredStudents.length} of {students.length} total
                  </span>
                </div>

                {filteredStudents.length === 0 ? (
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
                  <div className="space-y-4">
                    {filteredStudents.map((student) => (
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
                              {student.name}
                            </h4>
                            <p className="text-gray-600">
                              <span className="inline-flex items-center gap-1">
                                <IdCard className="h-4 w-4 text-gray-500" />
                                {student.studentId}
                              </span>{" "}
                              •{" "}
                              <span className="inline-flex items-center gap-1">
                                <Building2 className="h-4 w-4 text-gray-500" />
                                {student.department}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500 inline-flex items-center gap-1">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {student.email}
                            </p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                student.status
                              )}`}
                            >
                              {student.status.charAt(0).toUpperCase() +
                                student.status.slice(1)}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getEmploymentColor(
                                student.employmentStatus
                              )}`}
                            >
                              {student.employmentStatus
                                .charAt(0)
                                .toUpperCase() +
                                student.employmentStatus.slice(1)}
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
                              <BarChart3 className="h-4 w-4 text-gray-500" />
                              GPA: {student.gpa}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-4 w-4 text-gray-500" />
                              Updated: {student.lastUpdated}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                              {selectedStudent.name}
                            </p>
                            <p className="inline-flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Email:</span>{" "}
                              {selectedStudent.email}
                            </p>
                            <p className="inline-flex items-center gap-2">
                              <IdCard className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Student ID:</span>{" "}
                              {selectedStudent.studentId}
                            </p>
                            <p className="inline-flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Department:</span>{" "}
                              {selectedStudent.department}
                            </p>
                            <p className="inline-flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Year:</span>{" "}
                              {selectedStudent.year}
                            </p>
                            <p className="inline-flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">GPA:</span>{" "}
                              {selectedStudent.gpa}
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
                                Academic Status:
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                  selectedStudent.status
                                )}`}
                              >
                                {selectedStudent.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                Employment Status:
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getEmploymentColor(
                                  selectedStudent.employmentStatus
                                )}`}
                              >
                                {selectedStudent.employmentStatus}
                              </span>
                            </div>
                            <p className="inline-flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Last Updated:</span>{" "}
                              {selectedStudent.lastUpdated}
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
                            <button
                              onClick={() => handleViewFullProfile(selectedStudent)}
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                            >
                              <UserRound className="h-4 w-4" />
                              View Full Profile
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateEmploymentStatus(selectedStudent)
                              }
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-colors"
                            >
                              <BadgeCheck className="h-4 w-4" />
                              Update Employment Status
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

      {/* Employment Status Modal */}
      {showEmploymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Update Employment Status
            </h3>
            <p className="text-gray-600 mb-4">
              Update employment status for {selectedStudent.name}
            </p>

            <div className="space-y-3 mb-6">
              {(["unemployed", "seeking", "internship", "employed"] as const).map(
                (status) => (
                  <label
                    key={status}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="employmentStatus"
                      value={status}
                      checked={newEmploymentStatus === status}
                      onChange={(e) =>
                        setNewEmploymentStatus(
                          e.target.value as Student["employmentStatus"]
                        )
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="capitalize inline-flex items-center gap-2">
                      {status === "employed" && (
                        <Briefcase className="h-4 w-4 text-green-600" />
                      )}
                      {status === "internship" && (
                        <Hourglass className="h-4 w-4 text-yellow-600" />
                      )}
                      {status === "seeking" && (
                        <Search className="h-4 w-4 text-orange-600" />
                      )}
                      {status === "unemployed" && (
                        <Users className="h-4 w-4 text-red-600" />
                      )}
                      {status}
                    </span>
                  </label>
                )
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSaveEmploymentStatus}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEmploymentModal(false)}
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
