// app/freelancer/projects/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';

interface ProjectForm {
  title: string;
  description: string;
  skillsRequired: string[];
  partnersNeeded: number;
  projectType: 'web' | 'mobile' | 'desktop' | 'ai' | 'other';
  timeline: string;
  file: File | null;
}

const skillSuggestions = [
  'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'C#',
  'UI/UX Design', 'Graphic Design', 'Machine Learning', 'Data Science',
  'DevOps', 'AWS', 'Docker', 'Kubernetes', 'Mobile Development',
  'Blockchain', 'Web3', 'AR/VR', 'Game Development'
];

export default function NewProjectIdea() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    description: '',
    skillsRequired: [],
    partnersNeeded: 1,
    projectType: 'web',
    timeline: '',
    file: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }
    setFormData(prev => ({
      ...prev,
      file
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
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Project data:', formData);
      
      toast.success('Project idea posted successfully!');
      router.push('/freelancer/dashboard');
    } catch (error) {
      toast.error('Failed to post project idea. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'freelancer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Post New Project Idea</h1>
          <button
            onClick={() => router.push('/freelancer/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Dashboard
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
                placeholder="Describe your project idea in detail. What problem does it solve? What are the main features?"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <p className="text-sm text-gray-500 mt-1">Maximum 10 partners allowed per project</p>
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

          {/* File Upload */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Documentation (Optional)</h2>
            
            <div>
              <label className="block text-gray-700 mb-2">Upload Project Outline</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                Upload PDF, DOC, DOCX, or TXT files (max 10MB). You can include project requirements, 
                wireframes, or any other documentation.
              </p>
              {formData.file && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Before You Post</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Make sure your project description is clear and detailed</li>
              <li>• Be specific about the skills you're looking for in partners</li>
              <li>• Consider the time commitment and set realistic expectations</li>
              <li>• Projects with clear documentation tend to attract better partners</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting Project...
              </>
            ) : (
              'Post Project Idea'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}