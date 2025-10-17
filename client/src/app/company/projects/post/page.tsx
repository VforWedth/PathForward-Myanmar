// app/company/projects/post/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
import { FolderKanban, PlusCircle, X, Upload } from 'lucide-react';

interface ProjectForm {
  // Company Information
  companyName: string;
  companyType: string;
  contactPerson: string;
  contactRole: string;

  // Project Overview
  title: string;
  description: string;
  objective: string;
  deliverables: string;
  category: string;

  // Technical Requirements
  techStack: string[];
  integrationRequirements: string;
  referenceLinks: string;
  designGuidelines: string;

  // Timeline
  startDate: string;
  deadline: string;
  milestones: string;

  // Budget and Payment
  budgetType: 'fixed' | 'hourly' | 'milestone';
  budgetMin: string;
  budgetMax: string;
  paymentMethod: string;
  bonusRewards: string;

  // Freelancer Requirements
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  skillsRequired: string[];
  preferredLocation: string;
  portfolioRequired: boolean;
  communicationExpectation: string;

  // Attachments
  attachments: File[];

  // Legal/Policy
  ndaRequired: boolean;
  ownershipTerms: string;
}

const categoryOptions = [
  'Web Design',
  'UI/UX Design',
  'Mobile App Development',
  'Web Development',
  'Backend Development',
  'Frontend Development',
  'Full Stack Development',
  'Graphic Design',
  'Branding',
  'Logo Design',
  'Data Analysis',
  'Machine Learning',
  'AI Development',
  'DevOps',
  'Database Design',
  'API Development',
  'E-commerce',
  'Game Development',
  'Video Editing',
  'Content Writing',
  'Other',
];

const techStackSuggestions = [
  'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Python', 'Django',
  'Flask', 'Laravel', 'PHP', 'Java', 'Spring Boot', 'C#', '.NET',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'AWS', 'Azure',
  'Docker', 'Kubernetes', 'GraphQL', 'REST API', 'TypeScript',
  'Tailwind CSS', 'Bootstrap', 'Material UI', 'Figma', 'Adobe XD',
];

const skillSuggestions = [
  'UI/UX Design', 'Responsive Design', 'Mobile Development', 'Web Development',
  'API Integration', 'Database Design', 'Cloud Computing', 'DevOps',
  'Agile/Scrum', 'Version Control (Git)', 'Testing/QA', 'Security',
  'Performance Optimization', 'SEO', 'Accessibility', 'Project Management',
];

export default function PostProject() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectForm>({
    companyName: '',
    companyType: '',
    contactPerson: '',
    contactRole: '',
    title: '',
    description: '',
    objective: '',
    deliverables: '',
    category: '',
    techStack: [],
    integrationRequirements: '',
    referenceLinks: '',
    designGuidelines: '',
    startDate: '',
    deadline: '',
    milestones: '',
    budgetType: 'fixed',
    budgetMin: '',
    budgetMax: '',
    paymentMethod: '',
    bonusRewards: '',
    experienceLevel: 'intermediate',
    skillsRequired: [],
    preferredLocation: '',
    portfolioRequired: false,
    communicationExpectation: '',
    attachments: [],
    ndaRequired: false,
    ownershipTerms: '',
  });

  const [techInput, setTechInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (user === undefined) return;
    if (!user || user.role !== 'company') {
      router.replace('/login');
      return;
    }

    // Fetch company profile to prefill company info
    const fetchCompanyProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/profile`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setFormData(prev => ({
              ...prev,
              companyName: data.data.companyName || '',
              contactPerson: user.name || '',
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching company profile:', error);
      }
    };

    fetchCompanyProfile();
  }, [user, router]);

  const validate = () => {
    if (!formData.title.trim()) return 'Please enter a project title.';
    if (!formData.description.trim()) return 'Please enter a project description.';
    if (!formData.objective.trim()) return 'Please enter the project objective.';
    if (!formData.deliverables.trim()) return 'Please enter expected deliverables.';
    if (!formData.category) return 'Please select a project category.';
    if (!formData.deadline) return 'Please set a deadline.';
    if (formData.skillsRequired.length === 0) return 'Please add at least one required skill.';

    const today = new Date();
    const dl = new Date(formData.deadline);
    today.setHours(0, 0, 0, 0);
    dl.setHours(0, 0, 0, 0);
    if (dl < today) return 'Deadline cannot be in the past.';

    if (formData.startDate) {
      const sd = new Date(formData.startDate);
      sd.setHours(0, 0, 0, 0);
      if (sd > dl) return 'Start date cannot be after deadline.';
    }

    return null;
  };

  const addTech = () => {
    const tech = techInput.trim();
    if (tech && !formData.techStack.includes(tech)) {
      setFormData({ ...formData, techStack: [...formData.techStack, tech] });
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tech)
    });
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skillsRequired.includes(skill)) {
      setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, skill] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(s => s !== skill)
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit

    if (files.length !== validFiles.length) {
      toast.error('Some files were too large (max 10MB per file)');
    }

    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...validFiles]
    });
  };

  const removeAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setIsLoading(true);
    try {
      // For now, we'll send JSON data without file upload
      // File upload can be implemented separately with multipart/form-data
      const payload = {
        companyName: formData.companyName.trim(),
        companyType: formData.companyType.trim() || null,
        contactPerson: formData.contactPerson.trim(),
        contactRole: formData.contactRole.trim() || null,
        title: formData.title.trim(),
        description: formData.description.trim(),
        objective: formData.objective.trim(),
        deliverables: formData.deliverables.trim(),
        category: formData.category,
        techStack: formData.techStack,
        integrationRequirements: formData.integrationRequirements.trim() || null,
        referenceLinks: formData.referenceLinks.trim() || null,
        designGuidelines: formData.designGuidelines.trim() || null,
        startDate: formData.startDate || null,
        deadline: formData.deadline,
        milestones: formData.milestones.trim() || null,
        budgetType: formData.budgetType,
        budgetMin: formData.budgetMin.trim() || null,
        budgetMax: formData.budgetMax.trim() || null,
        paymentMethod: formData.paymentMethod.trim() || null,
        bonusRewards: formData.bonusRewards.trim() || null,
        experienceLevel: formData.experienceLevel,
        skillsRequired: formData.skillsRequired,
        preferredLocation: formData.preferredLocation.trim() || null,
        portfolioRequired: formData.portfolioRequired,
        communicationExpectation: formData.communicationExpectation.trim() || null,
        ndaRequired: formData.ndaRequired,
        ownershipTerms: formData.ownershipTerms.trim() || null,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/company/projects`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Project posted successfully!');
        router.push('/company/projects');
      } else {
        toast.error(data.message || 'Failed to post project');
      }
    } catch (error) {
      console.error('Post project error:', error);
      toast.error('Failed to post project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center">
        <div className="text-[#567C8D]">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'company') return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="relative isolate border-b border-black/5 bg-gradient-to-r from-[#2F4156] via-[#2F4156] to-[#567C8D] text-white shadow-lg">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -left-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <FolderKanban className="h-6 w-6" />
              <span className="text-base font-semibold sm:text-lg">Post New Project</span>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/company/projects"
                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
              >
                Back to Projects
              </Link>
              <Link
                href="/company/dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-white text-[#2F4156] px-3 py-1.5 text-sm"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex max-w-7xl items-center gap-2 px-4 pb-3 sm:px-6">
            <SidebarTrigger
              className="rounded-md bg-white/10 px-2 py-1.5 text-white hover:bg-white/20"
              aria-label="Toggle sidebar"
            />
            <Separator orientation="vertical" className="mr-2 h-4 bg-white/30" />
            <Breadcrumb>
              <BreadcrumbList className="text-white/90">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="hover:text-white">
                    Company
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/company/projects" className="hover:text-white">
                    Projects
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Post</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="min-h-[calc(100vh-4rem)] bg-[#F5EFEB]">
          <div className="mx-auto max-w-7xl p-6 sm:p-8">
            <section className="relative overflow-hidden rounded-2xl border border-[#C8D9E6] bg-white/70 shadow-sm backdrop-blur-sm">
              <div className="absolute inset-0 bg-[radial-gradient(1200px_300px_at_0%_-10%,rgba(16,44,36,0.08),transparent),radial-gradient(800px_200px_at_100%_120%,rgba(86,124,141,0.08),transparent)]" />
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-2 text-[#2F4156] mb-4">
                  <PlusCircle className="h-5 w-5" />
                  <h1 className="text-xl font-semibold">Post a Freelancer Project</h1>
                </div>
                <p className="max-w-prose text-sm text-[#567C8D] mb-6">
                  Provide detailed information about your project to attract the right freelancers. Fields marked with * are required.
                </p>

                <form onSubmit={handleSubmit} className="grid gap-8">
                  {/* Company Information */}
                  <div className="border-l-4 border-[#2F4156] pl-4">
                    <h2 className="text-lg font-semibold text-[#2F4156] mb-4">Company Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Company Name *</label>
                        <input
                          type="text"
                          required
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Company Type</label>
                        <input
                          type="text"
                          placeholder="e.g., Startup, NGO, Enterprise"
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.companyType}
                          onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Contact Person *</label>
                        <input
                          type="text"
                          required
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Contact Role</label>
                        <input
                          type="text"
                          placeholder="e.g., Project Manager, CTO"
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.contactRole}
                          onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Overview */}
                  <div className="border-l-4 border-emerald-600 pl-4">
                    <h2 className="text-lg font-semibold text-[#2F4156] mb-4">Project Overview</h2>
                    <div className="grid gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Project Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., E-commerce Website Design"
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Project Category *</label>
                        <select
                          required
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="">Select a category</option>
                          {categoryOptions.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Project Description *</label>
                        <textarea
                          rows={5}
                          required
                          placeholder="Full explanation of what needs to be done and why..."
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Objective / Problem Statement *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="What problem should be solved?"
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.objective}
                          onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Expected Deliverables *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="e.g., Website, logo, mobile app UI, backend API, marketing video, etc."
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.deliverables}
                          onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Technical Requirements */}
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h2 className="text-lg font-semibold text-[#2F4156] mb-4">Technical Requirements</h2>
                    <div className="grid gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Preferred Tech Stack</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="e.g., React, Node.js, MongoDB"
                            className="flex-1 rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTech();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={addTech}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {techStackSuggestions.slice(0, 10).map(tech => (
                            <button
                              key={tech}
                              type="button"
                              onClick={() => {
                                if (!formData.techStack.includes(tech)) {
                                  setFormData({ ...formData, techStack: [...formData.techStack, tech] });
                                }
                              }}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                            >
                              + {tech}
                            </button>
                          ))}
                        </div>
                        {formData.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.techStack.map((tech, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                              >
                                {tech}
                                <button
                                  type="button"
                                  onClick={() => removeTech(tech)}
                                  className="hover:text-red-600"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Integration / API Requirements</label>
                        <textarea
                          rows={2}
                          placeholder="Any specific integrations or APIs needed..."
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.integrationRequirements}
                          onChange={(e) => setFormData({ ...formData, integrationRequirements: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Reference Links / Examples</label>
                        <input
                          type="text"
                          placeholder="URLs to similar projects or inspiration"
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.referenceLinks}
                          onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Design / Brand Guidelines</label>
                        <textarea
                          rows={2}
                          placeholder="Any design standards, brand colors, fonts, etc."
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.designGuidelines}
                          onChange={(e) => setFormData({ ...formData, designGuidelines: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="border-l-4 border-amber-600 pl-4">
                    <h2 className="text-lg font-semibold text-[#2F4156] mb-4">Timeline</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Start Date</label>
                        <input
                          type="date"
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Deadline *</label>
                        <input
                          type="date"
                          required
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.deadline}
                          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Milestones</label>
                        <textarea
                          rows={3}
                          placeholder="If payment or review happens in stages, describe them here..."
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.milestones}
                          onChange={(e) => setFormData({ ...formData, milestones: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Budget and Payment */}
                  <div className="border-l-4 border-green-600 pl-4">
                    <h2 className="text-lg font-semibold text-[#2F4156] mb-4">Budget and Payment</h2>
                    <div className="grid gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Budget Type</label>
                        <select
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.budgetType}
                          onChange={(e) => setFormData({ ...formData, budgetType: e.target.value as 'fixed' | 'hourly' | 'milestone' })}
                        >
                          <option value="fixed">Fixed Price</option>
                          <option value="hourly">Hourly Rate</option>
                          <option value="milestone">Milestone-based</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-[#2F4156]">Budget Min (USD)</label>
                          <input
                            type="text"
                            placeholder="e.g., 100"
                            className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                            value={formData.budgetMin}
                            onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-[#2F4156]">Budget Max (USD)</label>
                          <input
                            type="text"
                            placeholder="e.g., 300"
                            className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                            value={formData.budgetMax}
                            onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Payment Method</label>
                        <input
                          type="text"
                          placeholder="e.g., Platform escrow, Direct transfer, PayPal"
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.paymentMethod}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Bonuses / Rewards</label>
                        <input
                          type="text"
                          placeholder="e.g., Performance bonus for early delivery"
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.bonusRewards}
                          onChange={(e) => setFormData({ ...formData, bonusRewards: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Freelancer Requirements */}
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h2 className="text-lg font-semibold text-[#2F4156] mb-4">Freelancer Requirements</h2>
                    <div className="grid gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Experience Level</label>
                        <select
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.experienceLevel}
                          onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as 'beginner' | 'intermediate' | 'expert' })}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Skills Required *</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="e.g., UI/UX Design, React, API Integration"
                            className="flex-1 rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addSkill();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={addSkill}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {skillSuggestions.slice(0, 8).map(skill => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => {
                                if (!formData.skillsRequired.includes(skill)) {
                                  setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, skill] });
                                }
                              }}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                            >
                              + {skill}
                            </button>
                          ))}
                        </div>
                        {formData.skillsRequired.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.skillsRequired.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="hover:text-red-600"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Preferred Location</label>
                        <input
                          type="text"
                          placeholder="e.g., Myanmar, Remote (Any), Asia"
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.preferredLocation}
                          onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.portfolioRequired}
                            onChange={(e) => setFormData({ ...formData, portfolioRequired: e.target.checked })}
                            className="w-4 h-4 text-emerald-600 border-[#E3EAF1] rounded focus:ring-emerald-500"
                          />
                          <span className="text-sm text-[#2F4156]">
                            Portfolio Required (Attach 2-3 previous works)
                          </span>
                        </label>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Communication Expectation</label>
                        <input
                          type="text"
                          placeholder="e.g., Daily updates on Slack, Weekly video calls"
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.communicationExpectation}
                          onChange={(e) => setFormData({ ...formData, communicationExpectation: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="border-l-4 border-indigo-600 pl-4">
                    <h2 className="text-lg font-semibold text-[#2F4156] mb-4">Attachments</h2>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#2F4156]">Supporting Documents</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.fig"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          Choose Files
                        </label>
                        <span className="text-sm text-[#567C8D]">
                          Max 10MB per file. PDF, DOC, images, Figma files
                        </span>
                      </div>
                      {formData.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-[#F5EFEB] rounded">
                              <span className="text-sm text-[#2F4156]">
                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                              <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="text-rose-600 hover:text-rose-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Legal/Policy */}
                  <div className="border-l-4 border-rose-600 pl-4">
                    <h2 className="text-lg font-semibold text-[#2F4156] mb-4">Legal & Policy</h2>
                    <div className="grid gap-4">
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.ndaRequired}
                            onChange={(e) => setFormData({ ...formData, ndaRequired: e.target.checked })}
                            className="w-4 h-4 text-emerald-600 border-[#E3EAF1] rounded focus:ring-emerald-500"
                          />
                          <span className="text-sm text-[#2F4156]">
                            Confidentiality Agreement (NDA) Required
                          </span>
                        </label>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4156]">Ownership Terms</label>
                        <textarea
                          rows={2}
                          placeholder="Who owns the final work? Any usage rights?"
                          className="w-full rounded-lg border border-[#E3EAF1] px-4 py-2 text-[#2F4156] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          value={formData.ownershipTerms}
                          onChange={(e) => setFormData({ ...formData, ownershipTerms: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-[#E3EAF1]">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#2F4156] px-6 py-3 text-white shadow-sm ring-1 ring-black/10 transition hover:translate-y-[-1px] hover:bg-[#243447] disabled:opacity-70"
                    >
                      <PlusCircle className="h-5 w-5" />
                      {isLoading ? 'Posting Project...' : 'Post Project'}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/company/projects')}
                      className="rounded-xl bg-white px-6 py-3 text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
