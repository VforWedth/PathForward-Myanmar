'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';

interface ProjectForm {
  title: string;
  description: string;
  skillsRequired: string[];
  partnersNeeded: number;
  projectType: 'web' | 'mobile' | 'desktop' | 'ai' | 'other';
  timeline: string;
  status: 'active' | 'in-progress' | 'completed' | 'archived';
}

const skillSuggestions = [
  'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'C#',
  'UI/UX Design', 'Graphic Design', 'Machine Learning', 'Data Science',
  'DevOps', 'AWS', 'Docker', 'Kubernetes', 'Mobile Development',
  'Blockchain', 'Web3', 'AR/VR', 'Game Development'
];

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    description: '',
    skillsRequired: [],
    partnersNeeded: 1,
    projectType: 'web',
    timeline: '',
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (user === undefined) return;

    if (!user || user.role !== 'freelancer') {
      router.push('/login');
      return;
    }

    fetchProject();
  }, [user, router, params.id]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/freelancer/projects/${params.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const project = data.data;
        setFormData({
          title: project.title,
          description: project.description,
          skillsRequired: project.skillsRequired || [],
          partnersNeeded: project.partnersNeeded,
          projectType: project.projectType,
          timeline: project.timeline || '',
          status: project.status
        });
      } else {
        toast.error('Project not found');
        router.push('/freelancer/projects');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = (skill: string) => {
    if (skill && !formData.skillsRequired.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skill]
      }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(skill => skill !== skillToRemove)
    }));
  };

  const validateForm = () => {
    if (formData.skillsRequired.length === 0) {
      toast.error('Please add at least one required skill');
      return false;
    }

    if (formData.partnersNeeded < 1 || formData.partnersNeeded > 10) {
      toast.error('Partners needed must be between 1 and 10');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/freelancer/projects/${params.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Project updated successfully!');
        router.push('/freelancer/projects');
      } else {
        toast.error(data.message || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading project...</div>
      </div>
    );
  }

  if (!user || user.role !== 'freelancer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Edit Project</h1>
          <button
            onClick={() => router.push('/freelancer/projects')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Information</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Project Title *</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a clear and descriptive title"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Project Description *</label>
              <textarea
                name="description"
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project idea in detail"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Project Type *</label>
                <select
                  name="projectType"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.projectType}
                  onChange={handleChange}
                >
                  <option value="web">Web Application</option>
                  <option value="mobile">Mobile App</option>
                  <option value="desktop">Desktop Software</option>
                  <option value="ai">AI/Machine Learning</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Partners Needed *</label>
                <input
                  type="number"
                  name="partnersNeeded"
                  required
                  min="1"
                  max="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.partnersNeeded}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Status *</label>
                <select
                  name="status"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Estimated Timeline</label>
              <input
                type="text"
                name="timeline"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                value={formData.timeline}
                onChange={handleChange}
                placeholder="e.g., 3 months, 6 weeks, Ongoing"
              />
            </div>
          </div>

          {/* Skills Required */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills Required *</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Add Required Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Type a skill or select from suggestions"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(skillInput);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(skillInput)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>

              {/* Skill Suggestions */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Popular Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {skillSuggestions.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Skills */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Required Skills ({formData.skillsRequired.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {formData.skillsRequired.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
