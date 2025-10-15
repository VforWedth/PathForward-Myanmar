// components/peer.tsx
import React, { useState, useEffect } from 'react';
import { Search, Users, Filter, MessageCircle, Star, MapPin, Loader2 } from 'lucide-react';
import { peerApi, Peer, PeerFilters } from '@/lib/peerApi';
import { toast } from 'react-toastify';

// Use the Peer interface from peerApi instead of TeamMember

const PeerFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [filters, setFilters] = useState<PeerFilters>({
    skills: [],
    availability: [],
    minRating: 0,
    location: ''
  });
  const [peers, setPeers] = useState<Peer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  });

  // Fetch peers from API
  const fetchPeers = async (resetOffset = false) => {
    setIsLoading(true);
    try {
        const currentFilters: PeerFilters = {
          search: searchTerm || undefined,
          email: emailFilter || undefined,
          skills: filters.skills && filters.skills.length > 0 ? filters.skills : undefined,
          availability: filters.availability && filters.availability.length > 0 ? filters.availability : undefined,
          minRating: filters.minRating || undefined,
          location: filters.location || undefined,
          limit: pagination.limit,
          offset: resetOffset ? 0 : pagination.offset
        };

      const response = await peerApi.findPeers(currentFilters);
      
      if (response.success) {
        if (resetOffset) {
          setPeers(response.data.peers);
        } else {
          setPeers(prev => [...prev, ...response.data.peers]);
        }
        setPagination(response.data.pagination);
      } else {
        toast.error('Failed to fetch peers');
      }
    } catch (error: any) {
      console.error('Error fetching peers:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch peers');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPeers(true);
  }, []);

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPeers(true);
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, emailFilter, filters]);

  // Load more peers
  const loadMore = () => {
    if (pagination.hasMore && !isLoading) {
      setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }));
      fetchPeers(false);
    }
  };

  const handleContact = (peer: Peer) => {
    // Implement contact logic (email, message, etc.)
    console.log(`Contacting ${peer.name}`);
    // For now, show email in alert - in future, implement messaging system
    alert(`Contact ${peer.name} at: ${peer.User.email}`);
  };

  const handleSkillFilter = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills?.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...(prev.skills || []), skill]
    }));
  };

  const commonSkills = ['React', 'TypeScript', 'Python', 'Node.js', 'UI/UX', 'Data Science'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Users className="h-8 w-8" />
            Find Team Members
          </h1>
          <p className="text-gray-600 mt-2">
            Connect with skilled professionals for your next project
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, skills, or interests..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-1 relative">
              <input
                type="email"
                placeholder="Filter by email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
              />
              {emailFilter && (
                <button
                  onClick={() => setEmailFilter('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {isFilterOpen && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Skills Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => handleSkillFilter(skill)}
                        className={`px-3 py-1 text-sm rounded-full border ${
                          filters.skills?.includes(skill)
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'bg-gray-100 border-gray-300 text-gray-700'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4.0}>4.0+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.availability?.[0] || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      availability: e.target.value ? [e.target.value] : [] 
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    <option value="available">Available</option>
                    <option value="on_job">On Job</option>
                    <option value="internship_completed">Completed</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Found {pagination.total} peer{pagination.total !== 1 ? 's' : ''}
          </p>
          {isLoading && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>

        {/* Peers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {peers.map(peer => (
            <div
              key={peer.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
            >
              {/* Peer Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{peer.avatar}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{peer.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {peer.location || 'Location not specified'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{peer.rating}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-wrap gap-1">
                  {peer.skills?.slice(0, 4).map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {peer.skills && peer.skills.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{peer.skills.length - 4}
                    </span>
                  )}
                  {(!peer.skills || peer.skills.length === 0) && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      No skills listed
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{peer.experience}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Projects</span>
                  <span className="font-medium">{peer.projectsCompleted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${
                    peer.status === 'available' ? 'text-green-600' :
                    peer.status === 'on_job' ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {peer.status === 'available' ? 'Available' :
                     peer.status === 'on_job' ? 'On Job' : 'Completed'}
                  </span>
                </div>
                {peer.major && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Major</span>
                    <span className="font-medium">{peer.major}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => handleContact(peer)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {pagination.hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Peers'
              )}
            </button>
          </div>
        )}

        {/* Empty State */}
        {peers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No peers found</h3>
            <p className="mt-2 text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerFinder;