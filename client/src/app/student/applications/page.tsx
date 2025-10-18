'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getDisplayName } from '@/utils/getDisplayName';
import { motion } from 'framer-motion';

// shadcn/ui
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// icons
import { MapPin, CalendarDays, DollarSign, ExternalLink, FileText } from 'lucide-react';

// top nav
import { StudentTopNav } from '@/components/ui/student/top-nav';

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  status: 'applied' | 'under-review' | 'interview' | 'rejected' | 'accepted';
  appliedDate: string;
  companyLogo?: string;
  location: string;
  salary?: string;
  notes?: string;
  interviewDate?: string;
}

export default function JobApplicationsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filter, setFilter] = useState<'all' | JobApplication['status']>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }

    fetchApplications();
  }, [user, router]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/student/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success && data.applications) {
        // Map API response to component format
        const mappedApplications: JobApplication[] = data.applications.map((app: any) => {
          return {
            id: app.id,
            jobTitle: app.Job?.title || 'Unknown Job',
            company: app.Job?.Company?.companyName || 'Unknown Company',
            status: mapStatus(app.status),
            appliedDate: app.createdAt,
            companyLogo: app.Job?.Company?.logo,
            location: app.Job?.location || 'Not specified',
            salary: app.Job?.salary ? `$${app.Job.salary}` : undefined,
            notes: app.coverLetter,
          };
        });

        setApplications(mappedApplications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      setIsWithdrawing(applicationId);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/student/applications/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Remove the application from the list
        setApplications(prev => prev.filter(app => app.id !== applicationId));
        alert('Application withdrawn successfully');
      } else {
        alert(data.message || 'Failed to withdraw application');
      }
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('Failed to withdraw application');
    } finally {
      setIsWithdrawing(null);
    }
  };

  // Map backend status to frontend status
  const mapStatus = (backendStatus: string): JobApplication['status'] => {
    const statusMap: Record<string, JobApplication['status']> = {
      'pending': 'applied',
      'reviewing': 'under-review',
      'shortlisted': 'interview',
      'rejected': 'rejected',
      'accepted': 'accepted',
    };
    return statusMap[backendStatus] || 'applied';
  };

  const filtered = useMemo(
    () => applications.filter((a) => filter === 'all' || a.status === filter),
    [applications, filter]
  );

  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'applied':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Applied</Badge>;
      case 'under-review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'interview':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Interview</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>;
    }
  };

  const Stat = ({
    label,
    value,
    colorClass = '',
  }: {
    label: string;
    value: number | string;
    colorClass?: string;
  }) => (
    <Card className="shadow-sm">
      <CardContent className="p-4 text-center">
        <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
        <div className="text-sm text-[#567C8D]">{label}</div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5EFEB]">
        <StudentTopNav userName={user?.name || user?.email?.split('@')[0]} alertsCount={3} onLogout={logout} />
        <main className="mx-auto max-w-6xl p-6 md:p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 text-4xl">⏳</div>
              <p className="text-lg text-[#567C8D]">Loading your applications...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      {/* ✅ shadcn Top Nav */}
      <StudentTopNav userName={user?.name || user?.email?.split('@')[0]} alertsCount={3} onLogout={logout} />

      <main className="mx-auto max-w-6xl p-6 md:p-8">
        {/* Filters */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#2F4156]">Filter Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
              <TabsList className="flex w-full flex-wrap gap-2 bg-[#F5EFEB] p-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="applied">Applied</TabsTrigger>
                <TabsTrigger value="under-review">Under Review</TabsTrigger>
                <TabsTrigger value="interview">Interview</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Applications list */}
        <div className="mt-6 space-y-4">
          {filtered.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div className="flex-1">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-semibold text-[#2F4156]">{a.jobTitle}</h3>
                          <p className="text-lg font-medium text-[#567C8D]">{a.company}</p>
                        </div>
                        {getStatusBadge(a.status)}
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-sm text-[#567C8D] md:grid-cols-3">
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" /> {a.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4" /> {a.salary ?? '—'}
                        </div>
                        <div className="flex items-center">
                          <CalendarDays className="mr-2 h-4 w-4" /> Applied:{' '}
                          {new Date(a.appliedDate).toLocaleDateString()}
                        </div>
                      </div>

                      {a.interviewDate && (
                        <div className="mt-3 rounded-lg bg-blue-50 p-3 text-blue-800">
                          <span className="font-medium">Interview:</span>{' '}
                          {new Date(a.interviewDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex gap-2 lg:mt-0 lg:ml-6">
                      <Button>
                        <FileText className="mr-2 h-4 w-4" /> View Details
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#567C8D] text-[#567C8D] hover:bg-[#567C8D] hover:text-white"
                        onClick={() => handleWithdrawApplication(a.id)}
                        disabled={a.status !== 'applied' || isWithdrawing === a.id}
                      >
                        {isWithdrawing === a.id ? 'Withdrawing...' : 'Withdraw'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <Card className="mt-6 text-center">
            <CardContent className="py-12">
              <div className="mb-4 text-6xl">📝</div>
              <h3 className="mb-2 text-xl font-semibold text-[#2F4156]">No applications found</h3>
              <p className="mb-6 text-[#567C8D]">
                {filter === 'all'
                  ? "You haven't applied to any jobs yet."
                  : `No applications with status "${pretty(filter)}".`}
              </p>
              <Button asChild>
                <Link href="/jobs" className="inline-flex items-center">
                  Browse Jobs <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <section className="mt-10">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#2F4156]">Application Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                <Stat label="Total" value={applications.length} />
                <Stat
                  label="Applied"
                  value={applications.filter((x) => x.status === 'applied').length}
                  colorClass="text-blue-600"
                />
                <Stat
                  label="Interview"
                  value={applications.filter((x) => x.status === 'interview').length}
                  colorClass="text-purple-600"
                />
                <Stat
                  label="Accepted"
                  value={applications.filter((x) => x.status === 'accepted').length}
                  colorClass="text-green-600"
                />
                <Stat
                  label="Rejected"
                  value={applications.filter((x) => x.status === 'rejected').length}
                  colorClass="text-red-600"
                />
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

function pretty(status: 'all' | JobApplication['status']) {
  if (status === 'all') return 'All Applications';
  return (
    {
      applied: 'Applied',
      'under-review': 'Under Review',
      interview: 'Interview',
      rejected: 'Rejected',
      accepted: 'Accepted',
    } as const
  )[status];
}
