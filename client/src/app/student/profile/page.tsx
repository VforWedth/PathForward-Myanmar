'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  ExternalLink,
  FileDown,
  FileUp,
  GraduationCap,
  Link2,
  Mail,
  Pencil,
  Phone,
  Save,
  Upload,
  User2,
  UserCircle2,
  X,
  Plus,
  Building2,
  BookOpen,
  BadgeCheck,
  Camera,
  FileText,
  Loader2,
  Trash2,
  Download,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { StudentTopNav } from '@/components/ui/student/top-nav';

// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { getFileUrl } from '@/lib/utils';

// API imports
import {
  getProfile,
  updateProfile,
  uploadCV,
  uploadProfilePicture,
  updateStatus,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addCertificate,
  updateCertificate,
  deleteCertificate
} from '@/lib/studentApi';

interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  major: string;
  year: string;
  location: string;
  jobPreference: string;
  portfolioUrl: string;
  bio: string;
  skills: string[];
  status: string;
  profilePicture?: string;
  cvUrl?: string;
  User?: {
    email: string;
    phone: string;
  };
  University?: {
    universityName: string;
  };
  Education?: any[];
  Experiences?: any[];
  Certificates?: any[];
}

export default function StudentProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  
  // File uploads
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageRefresh, setProfileImageRefresh] = useState(0);
  
  // Education, Experience, Certificates
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  
  // Form states for adding new items
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddCertificate, setShowAddCertificate] = useState(false);

  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    grade: ''
  });

  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrent: false
  });

  const [newCertificate, setNewCertificate] = useState({
    title: '',
    issuingOrganization: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }
    loadProfile();
  }, [user, router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      console.log('Profile loaded:', res);
      if (res.success && res.data) {
        setProfile(res.data);
        setEducation(res.data.Education || []);
        setExperience(res.data.Experiences || []);
        setCertificates(res.data.Certificates || []);
        console.log('Profile picture URL from API:', res.data.profilePicture);
      }
    } catch (error: any) {
      console.error('Load profile error:', error);
      toast.error(error?.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      setSaving(true);
      await updateProfile(profile);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      loadProfile(); // Reload to get fresh data
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const updateProfileField = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    setProfile((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill || !profile) return;
    if (profile.skills.includes(skill)) {
      toast.error('Skill already exists');
      return;
    }
    updateProfileField('skills', [...profile.skills, skill]);
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    if (!profile) return;
    updateProfileField('skills', profile.skills.filter((s) => s !== skillToRemove));
  };

  const handleFileUpload = async (type: 'cv' | 'picture', file: File) => {
    try {
      if (type === 'cv') {
        const res = await uploadCV(file);
        toast.success('CV uploaded successfully');
        setCvFile(null);
      } else if (type === 'picture') {
        const res = await uploadProfilePicture(file);
        console.log('Profile picture upload response:', res);
        toast.success('Profile picture uploaded successfully');
        setProfileImageFile(null);
        
        // Update the profile state immediately with the new profile picture URL
        if (res.success && res.profilePicture) {
          console.log('Updating profile with new picture URL:', res.profilePicture);
          
          // Force immediate state update
          setProfile(prev => {
            if (!prev) return prev;
            const updated = { ...prev, profilePicture: res.profilePicture };
            console.log('Profile state updated:', updated);
            return updated;
          });
          
          setProfileImageRefresh(Date.now()); // Force image refresh
        } else {
          console.error('Upload response missing profilePicture URL:', res);
        }
      }
      
      // Reload profile to ensure all data is fresh
      console.log('Reloading profile after upload...');
      await loadProfile();
      
      // Log final state after reload
      setTimeout(() => {
        console.log('Final profile state after reload:', profile);
      }, 100);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Upload failed');
    }
  };

  // Education handlers
  const handleAddEducation = async () => {
    try {
      const res = await addEducation(newEducation);
      if (res.success) {
        setEducation([...education, res.data]);
        setShowAddEducation(false);
        setNewEducation({
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          grade: ''
        });
        toast.success('Education added successfully');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add education');
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Delete this education entry?')) return;
    try {
      await deleteEducation(id);
      setEducation(education.filter(e => e.id !== id));
      toast.success('Education deleted successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete education');
    }
  };

  // Experience handlers
  const handleAddExperience = async () => {
    try {
      const res = await addExperience(newExperience);
      if (res.success) {
        setExperience([...experience, res.data]);
        setShowAddExperience(false);
        setNewExperience({
          company: '',
          position: '',
          description: '',
          startDate: '',
          endDate: '',
          isCurrent: false
        });
        toast.success('Experience added successfully');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add experience');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Delete this experience entry?')) return;
    try {
      await deleteExperience(id);
      setExperience(experience.filter(e => e.id !== id));
      toast.success('Experience deleted successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete experience');
    }
  };

  // Certificate handlers
  const handleAddCertificate = async () => {
    try {
      const res = await addCertificate(newCertificate);
      if (res.success) {
        setCertificates([...certificates, res.data]);
        setShowAddCertificate(false);
        setNewCertificate({
          title: '',
          issuingOrganization: '',
          issueDate: '',
          expiryDate: '',
          credentialId: '',
          credentialUrl: ''
        });
        toast.success('Certificate added successfully');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add certificate');
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm('Delete this certificate?')) return;
    try {
      await deleteCertificate(id);
      setCertificates(certificates.filter(c => c.id !== id));
      toast.success('Certificate deleted successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete certificate');
    }
  };

  // Loading skeleton
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#F5EFEB]">
        <StudentTopNav userName={user?.name} alertsCount={3} onLogout={logout} />
        <div className="mx-auto grid max-w-5xl gap-6 p-6 md:grid-cols-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-[#C8D9E6] bg-white" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      <StudentTopNav userName={user?.name} alertsCount={3} onLogout={logout} />

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Header card */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card className="overflow-hidden">
            <CardContent className="relative p-6">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
              <div className="relative z-10 flex items-start justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {profile.profilePicture ? (
                      <img 
                        src={getFileUrl(profile.profilePicture, true) || ''} 
                        alt="Profile" 
                        className="h-16 w-16 rounded-2xl object-cover ring-1 ring-[#E3EAF1]"
                        onLoad={() => {
                          console.log('Profile picture loaded successfully:', getFileUrl(profile.profilePicture, true));
                        }}
                        onError={(e) => {
                          console.error('Failed to load profile picture:', {
                            originalUrl: profile.profilePicture,
                            constructedUrl: getFileUrl(profile.profilePicture, true),
                            error: e
                          });
                          // Don't hide the image, just show fallback
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiNGNUVGRUIiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyRjQxNTYiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Im0yMCAyMS0xLTFtLTMuNS0zLjVhNyA3IDAgMSAxIDAtOS45OTkgNyA3IDAgMCAxIDAgOS45OTlaIi8+CjxwYXRoIGQ9Im05IDlhMyAzIDAgMSAwIDYgMGEzIDMgMCAwIDAtNiAwIi8+Cjwvc3ZnPgo8L3N2Zz4K';
                        }}
                      />
                    ) : (
                      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#F5EFEB] ring-1 ring-[#E3EAF1]">
                        <UserCircle2 className="h-8 w-8 text-[#2F4156]" />
                      </div>
                    )}
                    {isEditing && (
                      <label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-emerald-500 p-1 text-white hover:bg-emerald-600">
                        <Camera className="h-3 w-3" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setProfileImageFile(file);
                              handleFileUpload('picture', file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#2F4156]">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="text-sm text-[#567C8D]">
                      {profile.major} • {profile.University?.universityName || 'No University'}
                    </p>
                    {/* Debug info - remove this later */}
                    {profile.profilePicture && (
                      <p className="text-xs text-gray-400 mt-1">
                        Picture URL: {profile.profilePicture}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={() => setIsEditing(false)} variant="outline">
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={saving} className="bg-emerald-500 text-white hover:bg-emerald-600">
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2F4156]">
                  <User2 className="h-5 w-5" /> Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-[#567C8D]">First Name</Label>
                    {isEditing ? (
                      <Input 
                        value={profile.firstName} 
                        onChange={(e) => updateProfileField('firstName', e.target.value)} 
                      />
                    ) : (
                      <p className="mt-2 text-[#2F4156]">{profile.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#567C8D]">Last Name</Label>
                    {isEditing ? (
                      <Input 
                        value={profile.lastName} 
                        onChange={(e) => updateProfileField('lastName', e.target.value)} 
                      />
                    ) : (
                      <p className="mt-2 text-[#2F4156]">{profile.lastName}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#567C8D] flex items-center gap-1">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <p className="mt-2 text-[#2F4156]">{profile.User?.email}</p>
                  </div>
                  <div>
                    <Label className="text-[#567C8D] flex items-center gap-1">
                      <Phone className="h-4 w-4" /> Phone
                    </Label>
                    <p className="mt-2 text-[#2F4156]">{profile.User?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-[#567C8D] flex items-center gap-1">
                      <BookOpen className="h-4 w-4" /> Major
                    </Label>
                    {isEditing ? (
                      <Input 
                        value={profile.major} 
                        onChange={(e) => updateProfileField('major', e.target.value)} 
                      />
                    ) : (
                      <p className="mt-2 text-[#2F4156]">{profile.major}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#567C8D] flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Year
                    </Label>
                    {isEditing ? (
                      <Input 
                        type="number"
                        value={profile.year} 
                        onChange={(e) => updateProfileField('year', e.target.value)} 
                      />
                    ) : (
                      <p className="mt-2 text-[#2F4156]">{profile.year}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#567C8D]">Location</Label>
                    {isEditing ? (
                      <Input 
                        value={profile.location} 
                        onChange={(e) => updateProfileField('location', e.target.value)} 
                      />
                    ) : (
                      <p className="mt-2 text-[#2F4156]">{profile.location}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#567C8D]">Job Preference</Label>
                    {isEditing ? (
                      <Select 
                        value={profile.jobPreference} 
                        onValueChange={(value) => updateProfileField('jobPreference', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="onsite">Onsite</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="ojt">OJT</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-2 text-[#2F4156] capitalize">{profile.jobPreference}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2F4156]">
                  <GraduationCap className="h-5 w-5" /> Bio
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea 
                    rows={5} 
                    value={profile.bio} 
                    onChange={(e) => updateProfileField('bio', e.target.value)} 
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-[#2F4156]">{profile.bio || 'No bio provided'}</p>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2F4156]">
                  <Pencil className="h-5 w-5" /> Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-[#C8D9E6] text-[#2F4156]">
                      <span className="mr-1">{skill}</span>
                      {isEditing && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 p-0 text-[#2F4156]/70" 
                          onClick={() => removeSkill(skill)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-3 flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill and press Enter"
                    />
                    <Button onClick={addSkill}>
                      <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Portfolio URL */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2F4156]">
                  <Link2 className="h-5 w-5" /> Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Input 
                    value={profile.portfolioUrl} 
                    onChange={(e) => updateProfileField('portfolioUrl', e.target.value)} 
                    placeholder="https://your-portfolio.com"
                  />
                ) : (
                  profile.portfolioUrl ? (
                    <a
                      href={profile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#567C8D] underline underline-offset-4 hover:text-[#2F4156]"
                    >
                      {profile.portfolioUrl} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <p className="text-[#567C8D]">No portfolio URL provided</p>
                  )
                )}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-[#2F4156]">
                    <BookOpen className="h-5 w-5" /> Education
                  </CardTitle>
                  {isEditing && (
                    <Button onClick={() => setShowAddEducation(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" /> Add Education
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="border rounded-lg p-3 flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</div>
                      <div className="text-sm text-gray-600">{edu.institution}</div>
                      <div className="text-xs text-gray-500">
                        {edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}
                      </div>
                      {edu.grade && <div className="text-xs text-gray-500">Grade: {edu.grade}</div>}
                    </div>
                    {isEditing && (
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteEducation(edu.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {showAddEducation && (
                  <div className="border rounded-lg p-4 space-y-3 bg-muted/50">
                    <Input 
                      placeholder="Institution" 
                      value={newEducation.institution} 
                      onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })} 
                    />
                    <Input 
                      placeholder="Degree" 
                      value={newEducation.degree} 
                      onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} 
                    />
                    <Input 
                      placeholder="Field of Study" 
                      value={newEducation.fieldOfStudy} 
                      onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })} 
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input 
                        type="date" 
                        placeholder="Start Date" 
                        value={newEducation.startDate} 
                        onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })} 
                      />
                      <Input 
                        type="date" 
                        placeholder="End Date" 
                        value={newEducation.endDate} 
                        onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })} 
                        disabled={newEducation.isCurrent} 
                      />
                    </div>
                    <Input 
                      placeholder="Grade/GPA" 
                      value={newEducation.grade} 
                      onChange={(e) => setNewEducation({ ...newEducation, grade: e.target.value })} 
                    />
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={newEducation.isCurrent} 
                        onChange={(e) => setNewEducation({ ...newEducation, isCurrent: e.target.checked })} 
                      />
                      <label className="text-sm">Currently studying here</label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddEducation}>Save</Button>
                      <Button variant="outline" onClick={() => setShowAddEducation(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-[#2F4156]">
                    <Building2 className="h-5 w-5" /> Experience
                  </CardTitle>
                  {isEditing && (
                    <Button onClick={() => setShowAddExperience(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" /> Add Experience
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id} className="border rounded-lg p-3 flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{exp.position}</div>
                      <div className="text-sm text-gray-600">{exp.company}</div>
                      <div className="text-xs text-gray-500">
                        {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                      </div>
                      {exp.description && <div className="text-sm mt-1">{exp.description}</div>}
                    </div>
                    {isEditing && (
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteExperience(exp.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {showAddExperience && (
                  <div className="border rounded-lg p-4 space-y-3 bg-muted/50">
                    <Input 
                      placeholder="Position" 
                      value={newExperience.position} 
                      onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })} 
                    />
                    <Input 
                      placeholder="Company" 
                      value={newExperience.company} 
                      onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })} 
                    />
                    <Textarea 
                      placeholder="Description" 
                      value={newExperience.description} 
                      onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} 
                      rows={3} 
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input 
                        type="date" 
                        placeholder="Start Date" 
                        value={newExperience.startDate} 
                        onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })} 
                      />
                      <Input 
                        type="date" 
                        placeholder="End Date" 
                        value={newExperience.endDate} 
                        onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })} 
                        disabled={newExperience.isCurrent} 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={newExperience.isCurrent} 
                        onChange={(e) => setNewExperience({ ...newExperience, isCurrent: e.target.checked })} 
                      />
                      <label className="text-sm">Currently working here</label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddExperience}>Save</Button>
                      <Button variant="outline" onClick={() => setShowAddExperience(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-[#2F4156]">
                    <BadgeCheck className="h-5 w-5" /> Certificates
                  </CardTitle>
                  {isEditing && (
                    <Button onClick={() => setShowAddCertificate(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" /> Add Certificate
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-3 flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{cert.title}</div>
                      <div className="text-sm text-gray-600">{cert.issuingOrganization}</div>
                      <div className="text-xs text-gray-500">Issued: {cert.issueDate}</div>
                      {cert.credentialUrl && (
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View Certificate
                        </a>
                      )}
                    </div>
                    {isEditing && (
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCertificate(cert.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {showAddCertificate && (
                  <div className="border rounded-lg p-4 space-y-3 bg-muted/50">
                    <Input 
                      placeholder="Certificate Title" 
                      value={newCertificate.title} 
                      onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })} 
                    />
                    <Input 
                      placeholder="Issuing Organization" 
                      value={newCertificate.issuingOrganization} 
                      onChange={(e) => setNewCertificate({ ...newCertificate, issuingOrganization: e.target.value })} 
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input 
                        type="date" 
                        placeholder="Issue Date" 
                        value={newCertificate.issueDate} 
                        onChange={(e) => setNewCertificate({ ...newCertificate, issueDate: e.target.value })} 
                      />
                      <Input 
                        type="date" 
                        placeholder="Expiry Date (optional)" 
                        value={newCertificate.expiryDate} 
                        onChange={(e) => setNewCertificate({ ...newCertificate, expiryDate: e.target.value })} 
                      />
                    </div>
                    <Input 
                      placeholder="Credential ID (optional)" 
                      value={newCertificate.credentialId} 
                      onChange={(e) => setNewCertificate({ ...newCertificate, credentialId: e.target.value })} 
                    />
                    <Input 
                      placeholder="Credential URL (optional)" 
                      value={newCertificate.credentialUrl} 
                      onChange={(e) => setNewCertificate({ ...newCertificate, credentialUrl: e.target.value })} 
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddCertificate}>Save</Button>
                      <Button variant="outline" onClick={() => setShowAddCertificate(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column - File uploads and actions */}
          <div className="space-y-6">
            {/* CV Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2F4156]">
                  <FileUp className="h-5 w-5" /> CV / Resume Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.cvUrl ? (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-600 text-white">CV Uploaded</Badge>
                      <Button asChild variant="outline" size="sm">
                        <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
                          <FileDown className="mr-2 h-4 w-4" /> Download
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <FileUp className="h-4 w-4" />
                      No CV uploaded yet
                    </p>
                  )}
                  
                  <div className="rounded-xl border border-dashed border-[#C8D9E6] bg-[#F5EFEB]/40 p-6 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-full bg-emerald-100 p-3">
                        <Upload className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#2F4156]">
                          {profile.cvUrl ? 'Replace your CV' : 'Upload your CV'}
                        </p>
                        <p className="text-xs text-[#567C8D] mt-1">
                          PDF, DOC, or DOCX files up to 10MB
                        </p>
                      </div>
                      <Input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Validate file size (10MB limit)
                            if (file.size > 10 * 1024 * 1024) {
                              toast.error('File size must be less than 10MB');
                              return;
                            }
                            setCvFile(file);
                            handleFileUpload('cv', file);
                          }
                        }} 
                        className="w-full" 
                      />
                      <div className="text-xs text-[#567C8D] space-y-1">
                        <p>• Keep your CV up to date for better job matches</p>
                        <p>• Ensure your contact information is current</p>
                        <p>• Include relevant skills and experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2F4156]">
                  <BadgeCheck className="h-5 w-5" /> Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Select 
                    value={profile.status} 
                    onValueChange={(value) => updateProfileField('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="on_job">On Job</SelectItem>
                      <SelectItem value="internship_completed">Internship Completed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge 
                    className={
                      profile.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : profile.status === 'on_job' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {profile.status === 'available' && 'Available'}
                    {profile.status === 'on_job' && 'On Job'}
                    {profile.status === 'internship_completed' && 'Internship Completed'}
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Save button for mobile */}
            {isEditing && (
              <Button onClick={handleSave} disabled={saving} className="w-full bg-emerald-500 text-white hover:bg-emerald-600">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-5 w-5" /> Save All Changes
              </Button>
            )}
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-6 pb-10 text-center text-xs text-[#567C8D]">
        Last updated • {new Date().toLocaleDateString()}
      </footer>
    </div>
  );
}