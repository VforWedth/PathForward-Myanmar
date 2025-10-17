// app/freelancer/company-projects/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import {
  FolderKanban,
  Search,
  Filter,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Award,
  Building2,
  ArrowRight,
  CalendarDays,
} from 'lucide-react';

interface CompanyProject {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetType: 'fixed' | 'hourly' | 'milestone';
  budgetMin: string;
  budgetMax: string;
  deadline: string;
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  skillsRequired: string[];
  companyName: string;
  createdAt: string;
  Company?: {
    companyName: string;
    industry: string;
    location: string;
    logo: string;
  };
}

export default function FreelancerCompanyProjects() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<CompanyProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [budgetTypeFilter, setBudgetTypeFilter] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'freelancer') {
      router.push('/login');
      return;
    }

    fetchProjects();
  }, [user, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/freelancer/company-projects`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProjects(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching company projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchQuery.trim() === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
      const matchesExperience = experienceFilter === 'all' || project.experienceLevel === experienceFilter;
      const matchesBudgetType = budgetTypeFilter === 'all' || project.budgetType === budgetTypeFilter;

      return matchesSearch && matchesCategory && matchesExperience && matchesBudgetType;
    });
  }, [projects, searchQuery, categoryFilter, experienceFilter, budgetTypeFilter]);

  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [projects]);

  const getBudgetDisplay = (project: CompanyProject) => {
    if (project.budgetMin && project.budgetMax) {
      return `$${project.budgetMin} - $${project.budgetMax}`;
    } else if (project.budgetMin) {
      return `From $${project.budgetMin}`;
    } else if (project.budgetMax) {
      return `Up to $${project.budgetMax}`;
    }
    return 'Budget not specified';
  };

  const getExperienceBadge = (level: string) => {
    const badges = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-blue-100 text-blue-700',
      expert: 'bg-purple-100 text-purple-700',
    };
    return badges[level as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FolderKanban className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Browse Company Projects</h1>
          </div>
          <Link
            href="/freelancer/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Budget Type Filter */}
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                value={budgetTypeFilter}
                onChange={(e) => setBudgetTypeFilter(e.target.value)}
              >
                <option value="all">All Budget Types</option>
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
                <option value="milestone">Milestone</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FolderKanban className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Projects Found</h3>
            <p className="text-gray-600">
              {searchQuery || categoryFilter !== 'all' || experienceFilter !== 'all' || budgetTypeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No company projects available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium">
                          {project.Company?.companyName || project.companyName}
                        </span>
                        {project.Company?.location && (
                          <>
                            <span>•</span>
                            <MapPin className="h-4 w-4" />
                            <span>{project.Company.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getExperienceBadge(project.experienceLevel)}`}>
                      {project.experienceLevel.charAt(0).toUpperCase() + project.experienceLevel.slice(1)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.skillsRequired.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {project.skillsRequired.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{project.skillsRequired.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{project.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="capitalize">{project.budgetType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="h-4 w-4" />
                      <span>{getBudgetDisplay(project)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarDays className="h-4 w-4" />
                      <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Posted Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock className="h-3 w-3" />
                    <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/freelancer/company-projects/${project.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
