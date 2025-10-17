'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Building2, Link2, ArrowLeft } from 'lucide-react';

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

interface University {
  id: string;
  universityName: string;
  location: string;
  establishedYear?: number;
  website: string;
  description: string;
  supportedMajors: string[];
  connectionStatus: 'not_connected' | 'pending' | 'active' | 'inactive';
  isConnected: boolean;
}

export default function UniversitiesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [showUniversityModal, setShowUniversityModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'company') {
      router.push('/login');
      return;
    }

    fetchUniversities();
  }, [user, router]);

  const fetchUniversities = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/universities`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUniversities(data.data);
        }
      } else {
        toast.error('Failed to fetch universities');
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
      toast.error('Error loading universities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (universityId: string) => {
    setConnectingId(universityId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/universities/${universityId}/connect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ message: 'Request for partnership' })
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Connection request sent successfully!');
        fetchUniversities(); // Refresh list
      } else {
        toast.error(data.message || 'Failed to send connection request');
      }
    } catch (error) {
      console.error('Error connecting to university:', error);
      toast.error('Error sending connection request');
    } finally {
      setConnectingId(null);
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '✓ Connected';
      case 'pending':
        return '⏳ Pending';
      case 'inactive':
        return '✗ Inactive';
      default:
        return 'Not Connected';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center">
        <div className="text-[#567C8D]">Loading universities...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Gradient Header */}
        <header className="relative isolate border-b border-black/5 bg-gradient-to-r from-[#2F4156] via-[#2F4156] to-[#567C8D] text-white shadow-lg">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -left-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <span className="text-base font-semibold sm:text-lg">Browse Universities</span>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/company/universities/connected"
                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
              >
                <Link2 className="h-4 w-4" /> My Connections
              </Link>
              <Link
                href="/company/dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-white text-[#2F4156] px-3 py-1.5 text-sm"
              >
                <ArrowLeft className="h-4 w-4" /> Dashboard
              </Link>
            </div>
          </div>

          {/* Breadcrumb Row */}
          <div className="relative mx-auto flex max-w-7xl items-center gap-2 px-4 pb-3 sm:px-6">
            <SidebarTrigger
              className="rounded-md bg-white/10 px-2 py-1.5 text-white hover:bg-white/20"
              aria-label="Toggle sidebar"
            />
            <Separator orientation="vertical" className="mr-2 h-4 bg-white/30" />
            <Breadcrumb>
              <BreadcrumbList className="text-white/90">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="hover:text-white">Company</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Universities</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto md:hidden">
              <SidebarTrigger className="text-white" aria-label="Toggle sidebar" />
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="min-h-[calc(100vh-4rem)] bg-[#F5EFEB]">
          <div className="mx-auto max-w-7xl p-6 sm:p-8">
            {/* Welcome Section */}
            <section className="mb-8 rounded-2xl border border-[#C8D9E6] bg-white/70 shadow-sm backdrop-blur-sm p-6">
              <h2 className="text-2xl font-bold text-[#2F4156] mb-2">Connect with Universities</h2>
              <p className="text-[#567C8D]">
                Build partnerships with universities to access verified students and post targeted job opportunities.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map((university) => (
                <div
                  key={university.id}
                  className="rounded-2xl border border-[#C8D9E6] bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-[#2F4156]">
                        {university.universityName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(university.connectionStatus)}`}>
                        {getStatusText(university.connectionStatus)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-[#567C8D]">
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-[#2F4156]">📍 Location:</span> {university.location}
                      </p>
                      {university.establishedYear && (
                        <p className="flex items-center gap-2">
                          <span className="font-medium text-[#2F4156]">📅 Established:</span> {university.establishedYear}
                        </p>
                      )}
                      {university.website && (
                        <p className="flex items-center gap-2">
                          <span className="font-medium text-[#2F4156]">🌐 Website:</span>
                          <a
                            href={university.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline"
                          >
                            Visit
                          </a>
                        </p>
                      )}
                    </div>

                    {university.description && (
                      <p className="text-sm text-[#567C8D] mb-4 line-clamp-3">
                        {university.description}
                      </p>
                    )}

                    {university.supportedMajors && university.supportedMajors.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-[#2F4156] mb-2">Majors:</p>
                        <div className="flex flex-wrap gap-2">
                          {university.supportedMajors.slice(0, 3).map((major, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-[#F5EFEB] text-[#2F4156] rounded-md text-xs ring-1 ring-[#E3EAF1]"
                            >
                              {major}
                            </span>
                          ))}
                          {university.supportedMajors.length > 3 && (
                            <span className="px-2 py-1 bg-[#F5EFEB] text-[#2F4156] rounded-md text-xs ring-1 ring-[#E3EAF1]">
                              +{university.supportedMajors.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-[#E3EAF1] flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSelectedUniversity(university);
                          setShowUniversityModal(true);
                        }}
                        className="w-full px-4 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#243447] transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>

                      {university.connectionStatus === 'not_connected' ? (
                        <button
                          onClick={() => handleConnect(university.id)}
                          disabled={connectingId === university.id}
                          className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 text-sm font-medium"
                        >
                          {connectingId === university.id ? 'Connecting...' : 'Send Connection Request'}
                        </button>
                      ) : university.connectionStatus === 'pending' ? (
                        <button
                          disabled
                          className="w-full px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium cursor-not-allowed ring-1 ring-yellow-600/20"
                        >
                          ⏳ Request Pending
                        </button>
                      ) : university.connectionStatus === 'active' ? (
                        <Link
                          href={`/company/universities/${university.id}/students`}
                          className="block w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium text-center"
                        >
                          View Students
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium cursor-not-allowed"
                        >
                          Connection Inactive
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {universities.length === 0 && (
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <p className="text-lg text-[#2F4156] mb-2">No universities available</p>
                <p className="text-sm text-[#567C8D]">Check back later for partnership opportunities</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* University Details Modal */}
      {showUniversityModal && selectedUniversity && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#C8D9E6] p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-[#2F4156]">{selectedUniversity.universityName}</h3>
                <p className="text-[#567C8D] mt-1">{selectedUniversity.location}</p>
              </div>
              <button
                onClick={() => setShowUniversityModal(false)}
                className="text-[#567C8D] hover:text-[#2F4156] transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Badge */}
              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedUniversity.connectionStatus)}`}>
                  {getStatusText(selectedUniversity.connectionStatus)}
                </span>
              </div>

              {/* University Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#2F4156] mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-[#567C8D]">📍</span>
                      <div>
                        <span className="font-medium text-[#2F4156]">Location:</span>
                        <br />
                        <span className="text-[#567C8D]">{selectedUniversity.location}</span>
                      </div>
                    </div>
                    {selectedUniversity.website && (
                      <div className="flex items-start gap-2">
                        <span className="text-[#567C8D]">🌐</span>
                        <div>
                          <span className="font-medium text-[#2F4156]">Website:</span>
                          <br />
                          <a
                            href={selectedUniversity.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline"
                          >
                            {selectedUniversity.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#2F4156] mb-3">University Details</h4>
                  <div className="space-y-2 text-sm">
                    {selectedUniversity.establishedYear && (
                      <div className="flex items-start gap-2">
                        <span className="text-[#567C8D]">📅</span>
                        <div>
                          <span className="font-medium text-[#2F4156]">Established:</span>
                          <br />
                          <span className="text-[#567C8D]">{selectedUniversity.establishedYear}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <span className="text-[#567C8D]">🎓</span>
                      <div>
                        <span className="font-medium text-[#2F4156]">Connection Status:</span>
                        <br />
                        <span className="text-[#567C8D]">{getStatusText(selectedUniversity.connectionStatus)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedUniversity.description && (
                <div>
                  <h4 className="font-semibold text-[#2F4156] mb-2">About the University</h4>
                  <p className="text-sm text-[#567C8D] leading-relaxed">{selectedUniversity.description}</p>
                </div>
              )}

              {/* Supported Majors */}
              {selectedUniversity.supportedMajors && selectedUniversity.supportedMajors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#2F4156] mb-3">Supported Majors</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUniversity.supportedMajors.map((major, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#F5EFEB] text-[#2F4156] rounded-full text-sm ring-1 ring-[#E3EAF1]"
                      >
                        {major}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-[#E3EAF1] flex flex-wrap gap-3">
                {selectedUniversity.connectionStatus === 'not_connected' && (
                  <button
                    onClick={() => {
                      setShowUniversityModal(false);
                      handleConnect(selectedUniversity.id);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Send Connection Request
                  </button>
                )}

                {selectedUniversity.connectionStatus === 'active' && (
                  <Link
                    href={`/company/universities/${selectedUniversity.id}/students`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    View Students
                  </Link>
                )}

                {selectedUniversity.website && (
                  <a
                    href={selectedUniversity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#243447] transition-colors text-sm font-medium"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
