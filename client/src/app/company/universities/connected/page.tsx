'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Link2, Building2, ArrowLeft, RefreshCcw } from 'lucide-react';

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

interface Connection {
  id: string;
  status: 'pending' | 'active' | 'inactive';
  connectedAt: string;
  University: {
    id: string;
    universityName: string;
    location: string;
    website: string;
    description: string;
  };
}

export default function ConnectedUniversitiesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'company') {
      router.push('/login');
      return;
    }

    fetchConnections();
    fetchStats();
  }, [user, router, statusFilter]);

  const fetchConnections = async () => {
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/universities/connected${params}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConnections(data.data);
        }
      } else {
        toast.error('Failed to fetch connections');
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error('Error loading connections');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/universities/stats`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDisconnect = async (universityId: string, universityName: string) => {
    if (!confirm(`Are you sure you want to disconnect from ${universityName}?`)) {
      return;
    }

    setDisconnectingId(universityId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/universities/${universityId}/disconnect`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('University disconnected successfully');
        fetchConnections();
        fetchStats();
      } else {
        toast.error(data.message || 'Failed to disconnect');
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Error disconnecting from university');
    } finally {
      setDisconnectingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center">
        <div className="text-[#567C8D]">Loading connections...</div>
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
            
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My University Connections</h1>
              <p className="text-sm text-white/80">Manage your university partnerships</p>
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
                  <BreadcrumbPage className="text-white font-medium">My Connections</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => {
                  setIsLoading(true);
                  fetchConnections();
                  fetchStats();
                }}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
              >
                <RefreshCcw className="h-4 w-4" />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              <Link
                href="/company/universities"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm border border-emerald-500"
              >
                <Building2 className="h-4 w-4" />
                Browse Universities
              </Link>
              <button
                onClick={() => router.push('/company/dashboard')}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm border border-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#F5EFEB]">
          <div className="max-w-7xl mx-auto p-8 w-full">

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#C8D9E6] shadow-sm">
                <div className="text-3xl font-bold text-[#2F4156] mb-2">{stats.total}</div>
                <div className="text-[#567C8D]">Total Connections</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#C8D9E6] shadow-sm">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.active}</div>
                <div className="text-[#567C8D]">Active</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#C8D9E6] shadow-sm">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pending}</div>
                <div className="text-[#567C8D]">Pending Approval</div>
              </div>
            </div>

            {/* Filter */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-[#C8D9E6] shadow-sm mb-6">
              <label className="block text-sm font-medium text-[#2F4156] mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full md:w-64 border border-[#C8D9E6] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-[#2F4156]"
              >
                <option value="all">All Connections</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Connections List */}
            <div className="space-y-4">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#C8D9E6] shadow-sm hover:shadow-md transition-all hover:border-emerald-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#2F4156]">
                          {connection.University.universityName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(connection.status)}`}>
                          {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-[#567C8D] mb-4">
                        <p>📍 {connection.University.location}</p>
                        {connection.University.website && (
                          <p>
                            🌐{' '}
                            <a
                              href={connection.University.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:underline"
                            >
                              {connection.University.website}
                            </a>
                          </p>
                        )}
                        <p className="text-xs text-[#567C8D]/70">
                          Connected on {new Date(connection.connectedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {connection.University.description && (
                        <p className="text-sm text-[#567C8D] mb-4">{connection.University.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {connection.status === 'active' && (
                      <Link
                        href={`/company/universities/${connection.University.id}/students`}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                      >
                        View Students
                      </Link>
                    )}
                    <button
                      onClick={() => handleDisconnect(connection.University.id, connection.University.universityName)}
                      disabled={disconnectingId === connection.University.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {disconnectingId === connection.University.id ? 'Disconnecting...' : 'Disconnect'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {connections.length === 0 && (
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
                <p className="text-lg text-[#2F4156] mb-2">No connections yet</p>
                <p className="text-sm text-[#567C8D] mb-4">
                  {statusFilter === 'all'
                    ? 'Start connecting with universities to access verified students'
                    : `No ${statusFilter} connections found`}
                </p>
                <Link
                  href="/company/universities"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  <Building2 className="h-5 w-5" />
                  Browse Universities
                </Link>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
