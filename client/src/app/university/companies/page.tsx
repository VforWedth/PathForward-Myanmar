// app/university/companies/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";

// shadcn/ui sidebar primitives
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// your university sidebar with 4 links
import { AppSidebar } from "@/components/ui/university/app-sidebar"; // adjust path if needed

// lucide icons
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Briefcase,
  BriefcaseBusiness,
  BadgeCheck,
  XCircle,
  X,
  Users,
  CalendarDays,
  DollarSign,
  Check,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  website: string;
  description: string;
  partnershipStatus: "pending" | "approved" | "rejected";
  contactEmail: string;
  jobsCount: number;
  connectionId?: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  salary: string;
  postedDate: string;
  deadline: string;
  requirements: string[];
}

export default function UniversityCompanies() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<"companies" | "jobs">("companies");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "university") {
      router.push("/login");
      return;
    }

    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setCompanies([]); // Clear previous data
      setJobs([]); // Clear previous data
      
      // Fetch connection requests (pending)
      const requestsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/university/connection-requests`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        if (requestsData.success) {
          const pendingCompanies = requestsData.connections.map((conn: any) => ({
            id: conn.Company.id,
            name: conn.Company.companyName,
            industry: conn.Company.industry,
            location: conn.Company.location,
            website: conn.Company.website,
            description: conn.Company.description,
            partnershipStatus: "pending" as const,
            contactEmail: conn.Company.User.email,
            jobsCount: 0,
            connectionId: conn.id
          }));
          setCompanies(prev => [...prev, ...pendingCompanies]);
        }
      }

      // Fetch connected companies
      const connectedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/university/connected-companies`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (connectedResponse.ok) {
        const connectedData = await connectedResponse.json();
        if (connectedData.success) {
          const activeCompanies = connectedData.connections.map((conn: any) => ({
            id: conn.Company.id,
            name: conn.Company.companyName,
            industry: conn.Company.industry,
            location: conn.Company.location,
            website: conn.Company.website,
            description: conn.Company.description,
            partnershipStatus: conn.status === 'active' ? "approved" as const : "inactive" as const,
            contactEmail: conn.Company.User.email,
            jobsCount: 0,
            connectionId: conn.id
          }));
          setCompanies(prev => [...prev, ...activeCompanies]);
        }
      }

      // Fetch job posts from connected companies
      const jobsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/university/job-posts`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        console.log('University jobs API response:', jobsData); // Debug log
        if (jobsData.success) {
          const jobPosts = jobsData.jobs.map((job: any) => ({
            id: job.id,
            title: job.title,
            company: job.Company.companyName,
            type: job.jobType || job.type,
            location: job.location,
            salary: job.salaryRange || job.salary,
            postedDate: new Date(job.createdAt).toISOString().split('T')[0],
            deadline: job.deadline,
            requirements: job.skillsRequired || [],
            status: job.status
          }));
          console.log('Formatted university jobs:', jobPosts); // Debug log
          console.log('Sample job requirements:', jobPosts[0]?.requirements); // Debug log
          setJobs(jobPosts);
        }
      } else {
        console.error('Failed to fetch university jobs:', jobsResponse.status, jobsResponse.statusText);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error loading data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Company["partnershipStatus"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 ring-1 ring-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 ring-1 ring-red-200";
      default:
        return "bg-gray-100 text-gray-800 ring-1 ring-gray-200";
    }
  };

  // Actions
  const handleViewCompanyDetails = (company: Company) => {
    setSelectedCompany(company);
    setShowCompanyModal(true);
  };

  const handleContactCompany = (company: Company) => {
    toast.info(`Opening email client to contact ${company.name}`);
    window.open(
      `mailto:${company.contactEmail}?subject=Partnership Inquiry&body=Hello ${company.name},`,
      "_blank"
    );
  };

  const handleApprovePartnership = async (company: Company) => {
    if (!company.connectionId) {
      toast.error("Connection ID not found");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/university/connection-requests/${company.connectionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ action: 'approve' })
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Partnership approved successfully!");
        fetchData(); // Refresh data
      } else {
        toast.error(data.message || "Failed to approve partnership");
      }
    } catch (error) {
      console.error('Error approving partnership:', error);
      toast.error("Error approving partnership");
    }
  };

  const handleRejectPartnership = async (company: Company) => {
    if (!company.connectionId) {
      toast.error("Connection ID not found");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/university/connection-requests/${company.connectionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ action: 'reject' })
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.info("Partnership request rejected");
        fetchData(); // Refresh data
      } else {
        toast.error(data.message || "Failed to reject partnership");
      }
    } catch (error) {
      console.error('Error rejecting partnership:', error);
      toast.error("Error rejecting partnership");
    }
  };

  const handleInitiatePartnership = () => {
    toast.info("Redirecting to partnership initiation form...");
  };

  const handleViewJobDetails = (job: Job) => {
    toast.info(`Viewing details for: ${job.title}`);
  };

  const handleShareWithStudents = async (job: Job) => {
    // In a full implementation, this could:
    // 1. Send email notifications to students
    // 2. Create announcements
    // 3. Post to student dashboard
    // For now, we'll just show a success message since jobs from connected companies
    // are already visible to students
    
    toast.success(
      `Job "${job.title}" from ${job.company} is now visible to your students! Students can find it in their job board.`,
      { autoClose: 5000 }
    );
  };

  const handleSaveJob = (job: Job) => {
    toast.info(`Job "${job.title}" saved to university favorites`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      {/* Left rail */}
      <AppSidebar />

      {/* Right content */}
      <SidebarInset>
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold text-gray-900">Company Connections</h1>
          </div>
        </header>

        {/* Page body */}
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto p-8">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("companies")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "companies"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Partner Companies ({companies.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("jobs")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "jobs"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Available Jobs ({jobs.length})
                  </button>
                </nav>
              </div>
            </div>

            {activeTab === "companies" ? (
              /* Companies Tab */
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold">Partner Companies</h3>
                  <p className="text-gray-600">Companies connected with your university</p>
                </div>

                <div className="divide-y">
                  {companies.map((company) => (
                    <div key={company.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800">{company.name}</h4>

                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-700">
                            <span className="inline-flex items-center gap-1.5">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              {company.industry}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              {company.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Globe className="h-4 w-4 text-gray-500" />
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {company.website}
                              </a>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Mail className="h-4 w-4 text-gray-500" />
                              {company.contactEmail}
                            </span>
                          </div>

                          <p className="mt-3 text-gray-700">{company.description}</p>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              company.partnershipStatus
                            )}`}
                          >
                            {company.partnershipStatus.charAt(0).toUpperCase() +
                              company.partnershipStatus.slice(1)}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            <Briefcase className="h-4 w-4" />
                            {company.jobsCount} jobs
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleViewCompanyDetails(company)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <BadgeCheck className="h-4 w-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleContactCompany(company)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Mail className="h-4 w-4" />
                          Contact
                        </button>
                        {company.partnershipStatus === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprovePartnership(company)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                            >
                              <Check className="h-4 w-4" />
                              Approve Partnership
                            </button>
                            <button
                              onClick={() => handleRejectPartnership(company)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {companies.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-lg mb-2">No partner companies yet</p>
                    <p className="text-sm mb-4">Start building connections with companies</p>
                    <button
                      onClick={handleInitiatePartnership}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <BriefcaseBusiness className="h-5 w-5" />
                      Initiate Partnership
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Jobs Tab */
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold">Available Jobs</h3>
                  <p className="text-gray-600">Job opportunities from partner companies</p>
                </div>

                <div className="divide-y">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800">{job.title}</h4>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-700">
                            <span className="inline-flex items-center gap-1.5">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              {job.company}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Briefcase className="h-4 w-4 text-gray-500" />
                              {job.type}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              {job.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              {job.salary}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-4 w-4 text-gray-500" />
                              Posted: {job.postedDate}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-4 w-4 text-gray-500" />
                              Deadline: {job.deadline}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h5 className="font-semibold text-gray-700 mb-2">Requirements:</h5>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {Array.isArray(job.requirements) && job.requirements.length > 0 ? (
                            job.requirements.map((req, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                              >
                                <BadgeCheck className="h-3 w-3" />
                                {req}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">No specific requirements listed</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleViewJobDetails(job)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <BadgeCheck className="h-4 w-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleShareWithStudents(job)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Users className="h-4 w-4" />
                          Share with Students
                        </button>
                        <button
                          onClick={() => handleSaveJob(job)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          <BriefcaseBusiness className="h-4 w-4" />
                          Save Job
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {jobs.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Briefcase className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-lg mb-2">No available jobs</p>
                    <p className="text-sm mb-4">Connect with companies to see job opportunities</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </SidebarInset>

      {/* Company Details Modal */}
      {showCompanyModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold">{selectedCompany.name}</h3>
              <button
                onClick={() => setShowCompanyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Company Information</h4>
                  <div className="space-y-2 text-sm">
                    <p className="inline-flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Industry:</span> {selectedCompany.industry}
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Location:</span> {selectedCompany.location}
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Website:</span>
                      <a
                        href={selectedCompany.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedCompany.website}
                      </a>
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Contact:</span> {selectedCompany.contactEmail}
                    </p>
                    <p className="inline-flex items-center gap-2">
                      {selectedCompany.partnershipStatus === "approved" ? (
                        <BadgeCheck className="h-4 w-4 text-green-600" />
                      ) : selectedCompany.partnershipStatus === "pending" ? (
                        <CalendarDays className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">Partnership Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(
                          selectedCompany.partnershipStatus
                        )}`}
                      >
                        {selectedCompany.partnershipStatus}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <p className="inline-flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Active Jobs:</span> {selectedCompany.jobsCount}
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Students Hired:</span> 45
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Partnership Since:</span> 2023
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600">{selectedCompany.description}</p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-700 mb-3">Actions</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleContactCompany(selectedCompany)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Company
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("jobs");
                      setShowCompanyModal(false);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Briefcase className="h-4 w-4" />
                    View Jobs
                  </button>
                  {selectedCompany.partnershipStatus === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprovePartnership(selectedCompany)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        <Check className="h-4 w-4" />
                        Approve Partnership
                      </button>
                      <button
                        onClick={() => handleRejectPartnership(selectedCompany)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
