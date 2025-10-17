'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Filter,
  Users,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Star
} from 'lucide-react';

interface Teammate {
  id: string;
  type: 'student' | 'freelancer';
  name: string;
  email: string;
  skills: string[];
  bio?: string;
  location?: string;
  profilePicture?: string;
  // Student specific
  major?: string;
  year?: string;
  university?: string;
  universityLocation?: string;
  gpa?: number;
  // Freelancer specific
  portfolioUrl?: string;
  availability?: string;
  hourlyRate?: number;
}

export default function FindTeammates() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    skills: ''
  });

  useEffect(() => {
    if (user === undefined) return;

    if (!user || user.role !== 'freelancer') {
      router.push('/login');
      return;
    }

    fetchTeammates();
  }, [user, router, filters]);

  const fetchTeammates = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.skills) params.append('skills', filters.skills);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/freelancer/teammates?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTeammates(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching teammates:', error);
      toast.error('Failed to load teammates');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading teammates...</div>
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
                <h1 className="text-2xl font-bold text-gray-800">Find Teammates</h1>
                <p className="text-sm text-gray-600">Connect with students and freelancers</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, major..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="student">Students Only</option>
                <option value="freelancer">Freelancers Only</option>
              </select>
            </div>

            {/* Skills Filter */}
            <div>
              <input
                type="text"
                placeholder="Filter by skill..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={filters.skills}
                onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {teammates.length} {teammates.length === 1 ? 'Teammate' : 'Teammates'} Found
          </h3>
        </div>

        {/* Teammates Grid */}
        {teammates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No teammates found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teammates.map((teammate) => (
              <div
                key={`${teammate.type}-${teammate.id}`}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4 mb-4">
                  {teammate.profilePicture ? (
                    <img
                      src={teammate.profilePicture}
                      alt={teammate.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{teammate.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {teammate.type === 'student' ? (
                        <>
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-600 font-medium">Student</span>
                        </>
                      ) : (
                        <>
                          <Briefcase className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">Freelancer</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Student Info */}
                {teammate.type === 'student' && (
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {teammate.major && (
                      <p className="font-medium text-gray-800">{teammate.major}</p>
                    )}
                    {teammate.university && (
                      <p>{teammate.university}</p>
                    )}
                    {teammate.year && (
                      <p>Year {teammate.year}</p>
                    )}
                    {teammate.gpa && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>GPA: {teammate.gpa}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Freelancer Info */}
                {teammate.type === 'freelancer' && (
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {teammate.availability && (
                      <p className="capitalize">
                        <span className="font-medium">Status:</span> {teammate.availability}
                      </p>
                    )}
                    {teammate.hourlyRate && (
                      <p>
                        <span className="font-medium">Rate:</span> ${teammate.hourlyRate}/hr
                      </p>
                    )}
                  </div>
                )}

                {/* Location */}
                {teammate.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{teammate.location}</span>
                  </div>
                )}

                {/* Bio */}
                {teammate.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {teammate.bio}
                  </p>
                )}

                {/* Skills */}
                {teammate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {teammate.skills.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {teammate.skills.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{teammate.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* View Profile Button */}
                <Link
                  href={`/freelancer/teammates/${teammate.type}/${teammate.id}`}
                  className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center text-sm"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
