// app/freelancer/company-projects/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Award,
  Briefcase,
  FileText,
  CheckCircle,
  AlertCircle,
  Globe,
  Mail,
  Phone,
} from 'lucide-react';

interface ProjectDetails {
  id: string;
  companyName: string;
  companyType: string;
  contactPerson: string;
  contactRole: string;
  title: string;
  description: string;
  objective: string;
  deliverables: string;
  category: string;
  techStack: string[];
  integrationRequirements: string;
  referenceLinks: string;
  designGuidelines: string;
  startDate: string;
  deadline: string;
  milestones: string;
  budgetType: 'fixed' | 'hourly' | 'milestone';
  budgetMin: string;
  budgetMax: string;
  paymentMethod: string;
  bonusRewards: string;
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  skillsRequired: string[];
  preferredLocation: string;
  portfolioRequired: boolean;
  communicationExpectation: string;
  ndaRequired: boolean;
  ownershipTerms: string;
  createdAt: string;
  Company?: {
    companyName: string;
    industry: string;
    location: string;
    logo: string;
    description: string;
    website: string;
  };
}

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'freelancer') {
      router.push('/login');
      return;
    }

    fetchProjectDetails();
  }, [user, router, params.id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/freelancer/company-projects/${params.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProject(data.data);
        }
      } else {
        router.push('/freelancer/company-projects');
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      router.push('/freelancer/company-projects');
    } finally {
      setIsLoading(false);
    }
  };

  const getBudgetDisplay = () => {
    if (!project) return '';
    if (project.budgetMin && project.budgetMax) {
      return `$${project.budgetMin} - $${project.budgetMax}`;
    } else if (project.budgetMin) {
      return `From $${project.budgetMin}`;
    } else if (project.budgetMax) {
      return `Up to $${project.budgetMax}`;
    }
    return 'Budget not specified';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/freelancer/company-projects"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to All Projects
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{project.Company?.companyName || project.companyName}</span>
                  </div>
                  {project.Company?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{project.Company.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{project.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                  {project.experienceLevel.charAt(0).toUpperCase() + project.experienceLevel.slice(1)} Level
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full capitalize">
                  {project.budgetType} Price
                </span>
                {project.ndaRequired && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">
                    NDA Required
                  </span>
                )}
                {project.portfolioRequired && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                    Portfolio Required
                  </span>
                )}
              </div>
            </div>

            {/* Project Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Description
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
            </div>

            {/* Objective */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Objective
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{project.objective}</p>
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Expected Deliverables
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{project.deliverables}</p>
            </div>

            {/* Technical Requirements */}
            {(project.techStack.length > 0 || project.integrationRequirements || project.designGuidelines) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Technical Requirements</h2>

                {project.techStack.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.integrationRequirements && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Integration Requirements</h3>
                    <p className="text-gray-600 text-sm">{project.integrationRequirements}</p>
                  </div>
                )}

                {project.designGuidelines && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Design Guidelines</h3>
                    <p className="text-gray-600 text-sm">{project.designGuidelines}</p>
                  </div>
                )}

                {project.referenceLinks && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Reference Links</h3>
                    <p className="text-sm text-gray-600 break-all">{project.referenceLinks}</p>
                  </div>
                )}
              </div>
            )}

            {/* Milestones */}
            {project.milestones && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Milestones</h2>
                <p className="text-gray-700 whitespace-pre-line">{project.milestones}</p>
              </div>
            )}

            {/* Skills Required */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {project.skillsRequired.map((skill, index) => (
                  <span key={index} className="px-3 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            {(project.communicationExpectation || project.preferredLocation || project.ownershipTerms) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Information</h2>

                {project.communicationExpectation && (
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-700 mb-1">Communication Expectations</h3>
                    <p className="text-gray-600 text-sm">{project.communicationExpectation}</p>
                  </div>
                )}

                {project.preferredLocation && (
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-700 mb-1">Preferred Location</h3>
                    <p className="text-gray-600 text-sm">{project.preferredLocation}</p>
                  </div>
                )}

                {project.ownershipTerms && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Ownership Terms</h3>
                    <p className="text-gray-600 text-sm">{project.ownershipTerms}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget & Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Project Details</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Budget</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{getBudgetDisplay()}</p>
                  <p className="text-xs text-gray-500 capitalize">{project.budgetType} payment</p>
                </div>

                {project.paymentMethod && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Payment Method</span>
                    </div>
                    <p className="text-sm text-gray-700">{project.paymentMethod}</p>
                  </div>
                )}

                {project.bonusRewards && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Award className="h-4 w-4" />
                      <span className="font-medium">Bonuses</span>
                    </div>
                    <p className="text-sm text-gray-700">{project.bonusRewards}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  {project.startDate && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Start Date:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {new Date(project.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Deadline:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                Apply for Project
              </button>
            </div>

            {/* Company Info */}
            {project.Company && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">About the Company</h3>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{project.Company.companyName}</h4>
                    <p className="text-sm text-gray-600">{project.Company.industry}</p>
                  </div>

                  {project.Company.description && (
                    <p className="text-sm text-gray-700">{project.Company.description}</p>
                  )}

                  {project.Company.website && (
                    <a
                      href={project.Company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      <Globe className="h-4 w-4" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Person</h3>

              <div className="space-y-2">
                <p className="font-semibold text-gray-800">{project.contactPerson}</p>
                {project.contactRole && (
                  <p className="text-sm text-gray-600">{project.contactRole}</p>
                )}
                {project.companyType && (
                  <p className="text-sm text-gray-600">{project.companyType}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
