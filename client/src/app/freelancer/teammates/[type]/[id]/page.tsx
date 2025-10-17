'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Globe,
  Github,
  Linkedin,
  DollarSign,
  Star
} from 'lucide-react';

interface TeammateProfile {
  id: string;
  type: 'student' | 'freelancer';
  name: string;
  email: string;
  phone?: string;
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
  github?: string;
  linkedin?: string;
  portfolio?: string;
  // Freelancer specific
  portfolioUrl?: string;
  availability?: string;
  hourlyRate?: number;
}

export default function TeammateProfile() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [teammate, setTeammate] = useState<TeammateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;

    if (!user || user.role !== 'freelancer') {
      router.push('/login');
      return;
    }

    fetchTeammateProfile();
  }, [user, router, params.type, params.id]);

  const fetchTeammateProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/freelancer/teammates/${params.type}/${params.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTeammate(data.data);
      } else {
        toast.error('Teammate not found');
        router.push('/freelancer/teammates');
      }
    } catch (error) {
      console.error('Error fetching teammate profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!user || user.role !== 'freelancer' || !teammate) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/freelancer/teammates')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Teammate Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Profile Header */}
              <div className="flex items-start gap-6 mb-8 pb-8 border-b">
                {teammate.profilePicture ? (
                  <img
                    src={teammate.profilePicture}
                    alt={teammate.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{teammate.name}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    {teammate.type === 'student' ? (
                      <>
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        <span className="text-lg text-blue-600 font-medium">Student</span>
                      </>
                    ) : (
                      <>
                        <Briefcase className="h-5 w-5 text-green-600" />
                        <span className="text-lg text-green-600 font-medium">Freelancer</span>
                      </>
                    )}
                  </div>
                  {teammate.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-5 w-5" />
                      <span>{teammate.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {teammate.bio && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">About</h3>
                  <p className="text-gray-600 whitespace-pre-line">{teammate.bio}</p>
                </div>
              )}

              {/* Student Specific Info */}
              {teammate.type === 'student' && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Education</h3>
                  <div className="space-y-3 text-gray-600">
                    {teammate.major && (
                      <div>
                        <span className="font-medium text-gray-800">Major:</span> {teammate.major}
                      </div>
                    )}
                    {teammate.university && (
                      <div>
                        <span className="font-medium text-gray-800">University:</span> {teammate.university}
                        {teammate.universityLocation && `, ${teammate.universityLocation}`}
                      </div>
                    )}
                    {teammate.year && (
                      <div>
                        <span className="font-medium text-gray-800">Year:</span> {teammate.year}
                      </div>
                    )}
                    {teammate.gpa && (
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium text-gray-800">GPA:</span> {teammate.gpa}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Freelancer Specific Info */}
              {teammate.type === 'freelancer' && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Info</h3>
                  <div className="space-y-3 text-gray-600">
                    {teammate.availability && (
                      <div>
                        <span className="font-medium text-gray-800">Availability:</span>{' '}
                        <span className="capitalize">{teammate.availability}</span>
                      </div>
                    )}
                    {teammate.hourlyRate && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-gray-800">Hourly Rate:</span> ${teammate.hourlyRate}/hr
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skills */}
              {teammate.skills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {teammate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <a
                      href={`mailto:${teammate.email}`}
                      className="text-blue-600 hover:underline break-all"
                    >
                      {teammate.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                {teammate.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone</p>
                      <a
                        href={`tel:${teammate.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {teammate.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Portfolio/Website */}
                {(teammate.portfolioUrl || teammate.portfolio) && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Portfolio</p>
                      <a
                        href={teammate.portfolioUrl || teammate.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        View Portfolio
                      </a>
                    </div>
                  </div>
                )}

                {/* GitHub */}
                {teammate.github && (
                  <div className="flex items-start gap-3">
                    <Github className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">GitHub</p>
                      <a
                        href={teammate.github.startsWith('http') ? teammate.github : `https://github.com/${teammate.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {teammate.github}
                      </a>
                    </div>
                  </div>
                )}

                {/* LinkedIn */}
                {teammate.linkedin && (
                  <div className="flex items-start gap-3">
                    <Linkedin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">LinkedIn</p>
                      <a
                        href={teammate.linkedin.startsWith('http') ? teammate.linkedin : `https://linkedin.com/in/${teammate.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Button */}
              <div className="mt-6 pt-6 border-t">
                <a
                  href={`mailto:${teammate.email}`}
                  className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium"
                >
                  Send Message
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
