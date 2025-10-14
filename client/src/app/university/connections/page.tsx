"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import { NotificationBanner } from "@/components/ui/notification-banner";

// shadcn/ui sidebar primitives
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// your role-aware sidebar
import { AppSidebar } from "@/components/ui/university/app-sidebar";

// lucide icons
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Check,
  X,
  Clock,
  Users,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

interface ConnectionRequest {
  id: string;
  status: 'pending' | 'active' | 'rejected';
  createdAt: string;
  connectedAt?: string;
  company: {
    id: string;
    companyName: string;
    industry: string;
    location: string;
    website: string;
    description: string;
    user: {
      email: string;
      isVerified: boolean;
    };
  };
}

export default function UniversityConnections() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [connectedCompanies, setConnectedCompanies] = useState<ConnectionRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"requests" | "connected">("requests");
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Array<{id: string, type: 'success' | 'error' | 'info' | 'warning', title: string, message: string}>>([]);

  useEffect(() => {
    if (!user || user.role !== "university") {
      router.push("/login");
      return;
    }

    fetchConnections();
  }, [user, router]);

  const fetchConnections = async () => {
    try {
      setIsLoading(true);

      // Fetch pending connection requests
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
          setConnectionRequests(requestsData.connections);
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
          setConnectedCompanies(connectedData.connections);
        }
      }

    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error('Error loading connections');
    } finally {
      setIsLoading(false);
    }
  };

  const addNotification = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, title, message }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleApproveRequest = async (connectionId: string) => {
    setProcessingId(connectionId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/university/connection-requests/${connectionId}`,
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
        addNotification('success', 'Connection Approved', 'Company connection request has been approved successfully!');
        fetchConnections(); // Refresh data
      } else {
        addNotification('error', 'Approval Failed', data.message || 'Failed to approve connection request');
      }
    } catch (error) {
      console.error('Error approving connection:', error);
      addNotification('error', 'Error', 'Error approving connection request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRequest = async (connectionId: string) => {
    setProcessingId(connectionId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/university/connection-requests/${connectionId}`,
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
        addNotification('info', 'Connection Rejected', 'Company connection request has been rejected');
        fetchConnections(); // Refresh data
      } else {
        addNotification('error', 'Rejection Failed', data.message || 'Failed to reject connection request');
      }
    } catch (error) {
      console.error('Error rejecting connection:', error);
      addNotification('error', 'Error', 'Error rejecting connection request');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '✓ Connected';
      case 'pending':
        return '⏳ Pending';
      case 'rejected':
        return '✗ Rejected';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading connections...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      {/* Left rail */}
      <AppSidebar />

      {/* Right content pane */}
      <SidebarInset>
        {/* Notification Banner */}
        <NotificationBanner 
          notifications={notifications} 
          onRemove={removeNotification} 
        />
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">Connection Management</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => {
                  setIsLoading(true);
                  fetchConnections();
                }}
                disabled={isLoading}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:bg-gray-400"
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("requests")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "requests"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Connection Requests ({connectionRequests.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("connected")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "connected"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Connected Companies ({connectedCompanies.length})
                  </button>
                </nav>
              </div>
            </div>

            {activeTab === "requests" ? (
              /* Connection Requests Tab */
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold">Pending Connection Requests</h3>
                  <p className="text-gray-600">Companies requesting to connect with your university</p>
                </div>

                <div className="divide-y">
                  {connectionRequests.map((request) => (
                    <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800">{request.company.companyName}</h4>

                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-700">
                            <span className="inline-flex items-center gap-1.5">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              {request.company.industry}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              {request.company.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Globe className="h-4 w-4 text-gray-500" />
                              <a
                                href={request.company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {request.company.website}
                              </a>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Mail className="h-4 w-4 text-gray-500" />
                              {request.company.user.email}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-4 w-4 text-gray-500" />
                              Requested: {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="mt-3 text-gray-700">{request.company.description}</p>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(request.status)}`}
                          >
                            {getStatusText(request.status)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          disabled={processingId === request.id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:bg-gray-400"
                        >
                          <Check className="h-4 w-4" />
                          {processingId === request.id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={processingId === request.id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:bg-gray-400"
                        >
                          <X className="h-4 w-4" />
                          {processingId === request.id ? 'Processing...' : 'Reject'}
                        </button>
                        <button
                          onClick={() => window.open(`mailto:${request.company.user.email}?subject=Partnership Inquiry&body=Hello ${request.company.companyName},`, "_blank")}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Mail className="h-4 w-4" />
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {connectionRequests.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <AlertCircle className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-lg mb-2">No pending connection requests</p>
                    <p className="text-sm">Companies will appear here when they request to connect with your university</p>
                  </div>
                )}
              </div>
            ) : (
              /* Connected Companies Tab */
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold">Connected Companies</h3>
                  <p className="text-gray-600">Companies with active partnerships</p>
                </div>

                <div className="divide-y">
                  {connectedCompanies.map((connection) => (
                    <div key={connection.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800">{connection.company.companyName}</h4>

                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-700">
                            <span className="inline-flex items-center gap-1.5">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              {connection.company.industry}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              {connection.company.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Globe className="h-4 w-4 text-gray-500" />
                              <a
                                href={connection.company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {connection.company.website}
                              </a>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Mail className="h-4 w-4 text-gray-500" />
                              {connection.company.user.email}
                            </span>
                            {connection.connectedAt && (
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4 text-gray-500" />
                                Connected: {new Date(connection.connectedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <p className="mt-3 text-gray-700">{connection.company.description}</p>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(connection.status)}`}
                          >
                            {getStatusText(connection.status)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => window.open(`mailto:${connection.company.user.email}?subject=Partnership Inquiry&body=Hello ${connection.company.companyName},`, "_blank")}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Mail className="h-4 w-4" />
                          Contact
                        </button>
                        <button
                          onClick={() => router.push(`/university/companies?tab=jobs&company=${connection.company.id}`)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Users className="h-4 w-4" />
                          View Jobs
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {connectedCompanies.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-lg mb-2">No connected companies yet</p>
                    <p className="text-sm">Companies will appear here after you approve their connection requests</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}