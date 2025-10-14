import api from './api';

export interface PeerFilters {
  search?: string;
  email?: string;
  skills?: string[];
  availability?: string[];
  minRating?: number;
  location?: string;
  limit?: number;
  offset?: number;
}

export interface Peer {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  experience: string;
  location: string;
  rating: number;
  projectsCompleted: number;
  status: 'available' | 'on_job' | 'internship_completed';
  bio: string;
  projectInterests: string[];
  firstName: string;
  lastName: string;
  major?: string;
  year?: number;
  universityId?: string;
  User: {
    email: string;
    isVerified: boolean;
    createdAt: string;
  };
  University?: {
    id: string;
    universityName: string;
    location: string;
  };
  Educations?: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
  }>;
  Experiences?: Array<{
    id: string;
    company: string;
    position: string;
    description: string;
  }>;
}

export interface PeersResponse {
  success: boolean;
  data: {
    peers: Peer[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

export const peerApi = {
  // Find peers with filters
  findPeers: async (filters: PeerFilters = {}): Promise<PeersResponse> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.email) params.append('email', filters.email);
    if (filters.skills && filters.skills.length > 0) {
      filters.skills.forEach(skill => params.append('skills', skill));
    }
    if (filters.availability && filters.availability.length > 0) {
      filters.availability.forEach(avail => params.append('availability', avail));
    }
    if (filters.minRating) params.append('minRating', filters.minRating.toString());
    if (filters.location) params.append('location', filters.location);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const response = await api.get(`/student/peers?${params.toString()}`);
    return response.data;
  },

  // Get peer details (if needed in the future)
  getPeerDetails: async (peerId: string): Promise<{ success: boolean; data: Peer }> => {
    const response = await api.get(`/student/peers/${peerId}`);
    return response.data;
  }
};
