'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Pagination } from '@/components/ui/Pagination';
import {
  ArrowLeft,
  Plus,
  Briefcase,
  Clock,
  Users,
  Filter,
  Edit,
  Trash2
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  partnersNeeded: number;
  projectType: string;
  timeline?: string;
  status: 'active' | 'in-progress' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export default function MyProjects() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 9, // 9 projects per page for nice 3-column grid
    totalItems: 0,
    totalPages: 0
  });

  useEffect(() => {
    if (user === undefined) return;

    if (!user || user.role !== 'freelancer') {
      router.push('/login');
      return;
    }

    fetchProjects();
  }, [user, router, filterStatus]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    const filtered = filterStatus === 'all'
      ? projects
      : projects.filter(p => p.status === filterStatus);

    // Update pagination
    setPagination(prev => ({
      ...prev,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.itemsPerPage)
    }));

    return filtered;
  }, [projects, filterStatus]);

  // Paginated projects
  const paginatedProjects = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, pagination.currentPage, pagination.itemsPerPage]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/freelancer/projects?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/freelancer/projects/${projectId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        toast.success('Project deleted successfully');
        fetchProjects();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getProjectTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      web: 'Web Application',
      mobile: 'Mobile App',
      desktop: 'Desktop Software',
      ai: 'AI/ML',
      other: 'Other'
    };
    return labels[type] || type;
  };

  if (isLoading || user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading projects...</div>
      </div>
    );
  }

  if (!user || user.role !== 'freelancer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/freelancer/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
                <p className="text-sm text-gray-600">Manage your project ideas</p>
              </div>
            </div>
            <Link
              href="/freelancer/projects/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="h-5 w-5" />
              New Project
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
              <span className="text-sm text-gray-600">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Per page:</label>
              <select
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                value={pagination.itemsPerPage}
                onChange={(e) => setPagination(prev => ({
                  ...prev,
                  itemsPerPage: Number(e.target.value),
                  currentPage: 1
                }))}
              >
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="12">12</option>
                <option value="24">24</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {paginatedProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">
              {filterStatus !== 'all'
                ? 'Try changing the filter to see more projects'
                : "You haven't created any projects yet"}
            </p>
            {filterStatus === 'all' && (
              <Link
                href="/freelancer/projects/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="h-5 w-5" />
                Create Your First Project
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex-1 mr-2">
                    {project.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {project.description}
                </p>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{getProjectTypeLabel(project.projectType)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{project.partnersNeeded} {project.partnersNeeded === 1 ? 'partner' : 'partners'} needed</span>
                  </div>
                  {project.timeline && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{project.timeline}</span>
                    </div>
                  )}
                </div>

                {project.skillsRequired.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skillsRequired.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {project.skillsRequired.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{project.skillsRequired.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="text-xs text-gray-500 mb-4">
                  Created: {formatDate(project.createdAt)}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/freelancer/projects/${project.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    View/Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                  onPageChange={handlePageChange}
                  itemName="projects"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
