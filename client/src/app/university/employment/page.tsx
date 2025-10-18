// app/university/employment/page.tsx
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
  BadgeCheck,
  Briefcase,
  Timer,
  BarChart3,
  Building2,
  LineChart,
  FileBarChart2,
  Handshake,
} from "lucide-react";

interface EmploymentStats {
  totalStudents: number;
  employed: number;
  seeking: number;
  internship: number;
  unemployed: number;
  employmentRate: number;
}

interface EmploymentTrend {
  month: string;
  employed: number; // percentage (0-100)
  seeking: number;  // percentage (0-100)
}

interface TopCompany {
  name: string;
  hiredCount: number;
  industry: string;
}

export default function EmploymentTracking() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [stats, setStats] = useState<EmploymentStats>({
    totalStudents: 0,
    employed: 0,
    seeking: 0,
    internship: 0,
    unemployed: 0,
    employmentRate: 0,
  });

  const [trends, setTrends] = useState<EmploymentTrend[]>([]);
  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "university") {
      router.push("/login");
      return;
    }

    // const fetchEmploymentData = async () => {
    //   try {
    //     const token = localStorage.getItem('token');
    //     const response = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/university/employment-stats`,
    //       {
    //         headers: {
    //           'Authorization': `Bearer ${token}`
    //         }
    //       }
    //     );

    //     if (response.ok) {
    //       const data = await response.json();
    //       if (data.success && data.stats) {
    //         // Map backend data to frontend format
    //         const backendStats = data.stats.students;
    //         const employmentRate = backendStats.employmentRate || 0;

    //         setStats({
    //           totalStudents: backendStats.total || 0,
    //           employed: backendStats.onJob || 0,
    //           seeking: backendStats.available || 0,
    //           internship: backendStats.onJob || 0, // Backend uses onJob for both employed and internship
    //           unemployed: (backendStats.total - backendStats.onJob - backendStats.internshipCompleted) || 0,
    //           employmentRate: Math.round(employmentRate)
    //         });

    //         // Map top companies if available
    //         if (data.stats.topCompanies && data.stats.topCompanies.length > 0) {
    //           setTopCompanies(data.stats.topCompanies.map((company: any) => ({
    //             name: company.companyName || company.name,
    //             hiredCount: company.studentCount || company.hiredCount || 0,
    //             industry: company.industry || 'Technology'
    //           })));
    //         } else {
    //           setTopCompanies([]);
    //         }

    //         // Generate trends based on current data (since backend doesn't provide historical trends yet)
    //         // TODO: Backend should store historical data for accurate trends
    //         const currentEmployedRate = employmentRate;
    //         const currentSeekingRate = 100 - employmentRate;

    //         // Generate approximate 7-month trend
    //         const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    //         const currentMonth = new Date().getMonth();
    //         const generatedTrends: EmploymentTrend[] = [];

    //         for (let i = 6; i >= 0; i--) {
    //           const monthIndex = (currentMonth - i + 12) % 12;
    //           const monthName = monthNames[monthIndex];
    //           const year = new Date().getFullYear();

    //           // Simulate gradual improvement in employment rate
    //           const employedRate = Math.max(30, currentEmployedRate - (i * 3));
    //           const seekingRate = 100 - employedRate;

    //           generatedTrends.push({
    //             month: `${monthName} ${year}`,
    //             employed: Math.round(employedRate),
    //             seeking: Math.round(seekingRate)
    //           });
    //         }

    //         setTrends(generatedTrends);

    //         toast.success('Employment data loaded successfully');
    //       } else {
    //         toast.error('Failed to load employment statistics');
    //       }
    //     } else {
    //       console.error('Failed to fetch employment data:', response.status);
    //       toast.error('Failed to load employment data');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching employment data:', error);
    //     toast.error('Failed to load employment data');
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // fetchEmploymentData();
    // Mock data
    const mockStats: EmploymentStats = {
      totalStudents: 1250,
      employed: 650,
      seeking: 300,
      internship: 150,
      unemployed: 150,
      employmentRate: 72,
    };

    const mockTrends: EmploymentTrend[] = [
      { month: "Jan 2023", employed: 45, seeking: 55 },
      { month: "Feb 2023", employed: 52, seeking: 48 },
      { month: "Mar 2023", employed: 58, seeking: 42 },
      { month: "Apr 2023", employed: 61, seeking: 39 },
      { month: "May 2023", employed: 65, seeking: 35 },
      { month: "Jun 2023", employed: 68, seeking: 32 },
      { month: "Jul 2023", employed: 72, seeking: 28 },
    ];

    const mockTopCompanies: TopCompany[] = [
      { name: "Tech Solutions Myanmar", hiredCount: 45, industry: "Technology" },
      { name: "Myanmar FinTech", hiredCount: 32, industry: "Finance" },
      { name: "Digital Innovations Co.", hiredCount: 28, industry: "E-commerce" },
      { name: "Yangon Software House", hiredCount: 25, industry: "Technology" },
      { name: "Mandalay Tech Park", hiredCount: 22, industry: "Technology" },
    ];

    setStats(mockStats);
    setTrends(mockTrends);
    setTopCompanies(mockTopCompanies);
    setIsLoading(false);
  }, [user, router]);

  // Actions
  const handleGenerateReports = () => {
    toast.info("Generating employment reports...");
    const reportData = {
      generatedAt: new Date().toLocaleString(),
      stats,
      trends,
      topCompanies,
    };
    console.log("Employment Report:", reportData);
    toast.success("Employment reports generated successfully!");
  };

  const handleManagePartnerships = () => {
    router.push("/university/companies");
  };

  const handleViewAnalytics = () => {
    toast.info("Opening detailed analytics dashboard...");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading employment data...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      {/* Left rail */}
      <AppSidebar />

      {/* Right content pane */}
      <SidebarInset>
        {/* Top bar (consistent with other pages) */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold text-gray-900">
              Employment Tracking Dashboard
            </h1>
          </div>
        </header>

        {/* Page body */}
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto p-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                borderColor="border-blue-500"
                iconBg="bg-blue-100"
                Icon={Users}
                iconClass="text-blue-600"
                label="Total Students"
                value={stats.totalStudents.toLocaleString()}
              />

              <MetricCard
                borderColor="border-green-500"
                iconBg="bg-green-100"
                Icon={BadgeCheck}
                iconClass="text-green-600"
                label="Employment Rate"
                value={`${stats.employmentRate}%`}
              />

              <MetricCard
                borderColor="border-purple-500"
                iconBg="bg-purple-100"
                Icon={Briefcase}
                iconClass="text-purple-600"
                label="Employed"
                value={stats.employed.toLocaleString()}
              />

              <MetricCard
                borderColor="border-orange-500"
                iconBg="bg-orange-100"
                Icon={Timer}
                iconClass="text-orange-600"
                label="Seeking Jobs"
                value={stats.seeking.toLocaleString()}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Employment Status Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Employment Status Distribution
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Employed",
                      count: stats.employed,
                      color: "bg-green-500",
                      percentage: ((stats.employed / stats.totalStudents) * 100).toFixed(1),
                      Icon: Briefcase,
                      iconColor: "text-green-600",
                    },
                    {
                      label: "Internship",
                      count: stats.internship,
                      color: "bg-yellow-500",
                      percentage: ((stats.internship / stats.totalStudents) * 100).toFixed(1),
                      Icon: LineChart,
                      iconColor: "text-yellow-600",
                    },
                    {
                      label: "Seeking Employment",
                      count: stats.seeking,
                      color: "bg-orange-500",
                      percentage: ((stats.seeking / stats.totalStudents) * 100).toFixed(1),
                      Icon: Timer,
                      iconColor: "text-orange-600",
                    },
                    {
                      label: "Unemployed",
                      count: stats.unemployed,
                      color: "bg-red-500",
                      percentage: ((stats.unemployed / stats.totalStudents) * 100).toFixed(1),
                      Icon: BarChart3,
                      iconColor: "text-red-600",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${item.color}`} />
                        <div className="inline-flex items-center gap-2">
                          <item.Icon className={`h-4 w-4 ${item.iconColor}`} />
                          <span className="text-sm font-medium text-gray-700">
                            {item.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">
                          {item.count.toLocaleString()} students
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Hiring Companies */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Top Hiring Companies
                </h3>
                <div className="space-y-4">
                  {topCompanies.map((company, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <h4 className="font-medium text-gray-800">
                            {company.name}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {company.hiredCount} students
                        </p>
                        <p className="text-sm text-gray-600">hired</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Employment Trends */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Employment Trends (Last 7 Months)
              </h3>

              <div className="space-y-4">
                {trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-24">
                      {trend.month}
                    </span>
                    <div className="flex-1 mx-4">
                      <div className="flex space-x-1">
                        <div
                          className="h-6 bg-green-500 rounded-l"
                          style={{ width: `${trend.employed}%` }}
                        />
                        <div
                          className="h-6 bg-orange-500 rounded-r"
                          style={{ width: `${trend.seeking}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-4 text-sm w-40 justify-end">
                      <span className="text-green-600">{trend.employed}% employed</span>
                      <span className="text-orange-600">{trend.seeking}% seeking</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ActionCard
                onClick={handleGenerateReports}
                iconBg="bg-blue-100"
                iconClass="text-blue-600"
                Icon={FileBarChart2}
                title="Generate Reports"
                subtitle="Create detailed employment reports"
              />
              <ActionCard
                onClick={handleManagePartnerships}
                iconBg="bg-green-100"
                iconClass="text-green-600"
                Icon={Handshake}
                title="Manage Partnerships"
                subtitle="Connect with hiring companies"
              />
              <ActionCard
                onClick={handleViewAnalytics}
                iconBg="bg-purple-100"
                iconClass="text-purple-600"
                Icon={BarChart3}
                title="View Analytics"
                subtitle="Deep dive into employment data"
              />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

/* ---------- Presentational helpers ---------- */

function MetricCard({
  borderColor,
  iconBg,
  Icon,
  iconClass,
  label,
  value,
}: {
  borderColor: string;
  iconBg: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconClass: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${borderColor}`}>
      <div className="flex items-center">
        <div className={`${iconBg} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconClass}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  onClick,
  iconBg,
  iconClass,
  Icon,
  title,
  subtitle,
}: {
  onClick: () => void;
  iconBg: string;
  iconClass: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className={`${iconBg} p-3 rounded-lg inline-flex mb-4`}>
        <Icon className={`w-6 h-6 ${iconClass}`} />
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );
}
