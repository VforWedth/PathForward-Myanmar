'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import Link from 'next/link';

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading universities...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
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
                  <BreadcrumbPage>Universities</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto pr-4 flex items-center gap-2">
              <Link
                href="/company/universities/connected"
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                My Connections
              </Link>
              <button
                onClick={() => router.push('/company/dashboard')}
                className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-7xl mx-auto p-8 w-full">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Connect with Universities</h1>
              <p className="text-gray-600">
                Build partnerships with universities to access verified students and post targeted job opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map((university) => (
                <div
                  key={university.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {university.universityName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(university.connectionStatus)}`}>
                        {getStatusText(university.connectionStatus)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">📍 Location:</span> {university.location}
                      </p>
                      {university.establishedYear && (
                        <p>
                          <span className="font-medium">📅 Established:</span> {university.establishedYear}
                        </p>
                      )}
                      {university.website && (
                        <p>
                          <span className="font-medium">🌐 Website:</span>{' '}
                          <a
                            href={university.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Visit
                          </a>
                        </p>
                      )}
                    </div>

                    {university.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {university.description}
                      </p>
                    )}

                    {university.supportedMajors && university.supportedMajors.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Majors:</p>
                        <div className="flex flex-wrap gap-2">
                          {university.supportedMajors.slice(0, 3).map((major, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {major}
                            </span>
                          ))}
                          {university.supportedMajors.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              +{university.supportedMajors.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSelectedUniversity(university);
                          setShowUniversityModal(true);
                        }}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                      
                      {university.connectionStatus === 'not_connected' ? (
                        <button
                          onClick={() => handleConnect(university.id)}
                          disabled={connectingId === university.id}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-sm font-medium"
                        >
                          {connectingId === university.id ? 'Connecting...' : 'Send Connection Request'}
                        </button>
                      ) : university.connectionStatus === 'pending' ? (
                        <button
                          disabled
                          className="w-full px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium cursor-not-allowed"
                        >
                          ⏳ Request Pending
                        </button>
                      ) : university.connectionStatus === 'active' ? (
                        <Link
                          href={`/company/universities/${university.id}/students`}
                          className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium text-center"
                        >
                          View Students
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="w-full px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium cursor-not-allowed"
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
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg
                  className="w-20 h-20 mx-auto text-gray-300 mb-4"
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
                <p className="text-lg text-gray-600 mb-2">No universities available</p>
                <p className="text-sm text-gray-500">Check back later for partnership opportunities</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* University Details Modal */}
      {showUniversityModal && selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">{selectedUniversity.universityName}</h3>
                <p className="text-gray-600 mt-1">{selectedUniversity.location}</p>
              </div>
              <button
                onClick={() => setShowUniversityModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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
                  <h4 className="font-semibold text-gray-700 mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">📍</span>
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <br />
                        <span className="text-gray-600">{selectedUniversity.location}</span>
                      </div>
                    </div>
                    {selectedUniversity.website && (
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">🌐</span>
                        <div>
                          <span className="font-medium text-gray-700">Website:</span>
                          <br />
                          <a
                            href={selectedUniversity.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedUniversity.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">University Details</h4>
                  <div className="space-y-2 text-sm">
                    {selectedUniversity.establishedYear && (
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">📅</span>
                        <div>
                          <span className="font-medium text-gray-700">Established:</span>
                          <br />
                          <span className="text-gray-600">{selectedUniversity.establishedYear}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500">🎓</span>
                      <div>
                        <span className="font-medium text-gray-700">Connection Status:</span>
                        <br />
                        <span className="text-gray-600">{getStatusText(selectedUniversity.connectionStatus)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedUniversity.description && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">About the University</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedUniversity.description}</p>
                </div>
              )}

              {/* Supported Majors */}
              {selectedUniversity.supportedMajors && selectedUniversity.supportedMajors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Supported Majors</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUniversity.supportedMajors.map((major, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {major}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t flex flex-wrap gap-3">
                {selectedUniversity.connectionStatus === 'not_connected' && (
                  <button
                    onClick={() => {
                      setShowUniversityModal(false);
                      handleConnect(selectedUniversity.id);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Send Connection Request
                  </button>
                )}
                
                {selectedUniversity.connectionStatus === 'active' && (
                  <Link
                    href={`/company/universities/${selectedUniversity.id}/students`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    View Students
                  </Link>
                )}

                {selectedUniversity.website && (
                  <a
                    href={selectedUniversity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
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
