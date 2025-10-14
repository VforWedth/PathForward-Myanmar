'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { StudentTopNav } from '@/components/ui/student/top-nav'; // ✅ corrected path

// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  graduationYear: string;
  gpa: string;
  skills: string[];
  bio: string;
  cvUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
}

export default function StudentProfilePage() {
  const router = useRouter();
  // ✅ need logout for the loading header
  const { user, logout } = useAuthStore();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [draft, setDraft] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Redirect + mock load
  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }
    const mock: StudentProfile = {
      id: user.id,
      name: user.name || 'John Doe',
      email: user.email,
      phone: '+95 9 123 456 789',
      university: 'Bright Hill International / Stanford University',
      major: 'Computer Science',
      graduationYear: '2026',
      gpa: '3.8',
      skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python'],
      bio: 'Passionate CS student interested in web, mobile, and ML. Looking for a 2026 summer internship.',
      cvUrl: '/documents/cv.pdf',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      portfolioUrl: 'https://johndoe.dev',
    };
    setProfile(mock);
    setDraft(mock);
  }, [user, router]);

  const unsaved = useMemo(() => JSON.stringify(profile) !== JSON.stringify(draft), [profile, draft]);

  const startEdit = () => setIsEditing(true);
  const cancelEdit = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!draft) return;
    // pretend API
    setProfile(draft);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const updateDraft = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s || !draft) return;
    if (draft.skills.includes(s)) return;
    updateDraft('skills', [...draft.skills, s]);
    setNewSkill('');
  };

  const removeSkill = (name: string) => {
    if (!draft) return;
    updateDraft('skills', draft.skills.filter((s) => s !== name));
  };

  const handleCVUpload = () => {
    if (!cvFile) return;
    // fake upload
    alert(`CV uploaded: ${cvFile.name}`);
    setCvFile(null);
  };

  // ---- Loading skeleton (with TopNav) ----
  if (!draft) {
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
      {/* ✅ Top Nav replaces the old custom header */}
      <StudentTopNav userName={user?.name} alertsCount={3} onLogout={logout} />

      {/* Unsaved changes bar */}
      {unsaved && !isEditing && (
        <div className="sticky top-0 z-20 bg-amber-50 py-2 shadow-sm ring-1 ring-amber-200/60">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 text-amber-900">
            <span className="text-sm">You have unsaved changes (from previous edit).</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setDraft(profile)}>Discard</Button>
              <Button className="bg-amber-600 text-white hover:bg-amber-700" onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Header card */}
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card className="overflow-hidden">
            <CardContent className="relative p-6">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
              <div className="relative z-10 flex items-start justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#F5EFEB] ring-1 ring-[#E3EAF1]">
                    <UserCircle2 className="h-8 w-8 text-[#2F4156]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#2F4156]">{draft.name}</h2>
                    <p className="text-sm text-[#567C8D]">{draft.major} • {draft.university}</p>
                  </div>
                </div>
                <div className="hidden text-right md:block">
                  <p className="text-xs uppercase tracking-wide text-[#567C8D]">Readiness</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 w-40 overflow-hidden rounded-full bg-[#E3EAF1]">
                      <div className="h-full w-[72%] rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-sm font-medium text-[#2F4156]">72%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left (form) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2F4156]"><User2 className="h-5 w-5" /> Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-[#567C8D]">Full Name</Label>
                    {isEditing ? (
                      <Input value={draft.name} onChange={(e) => updateDraft('name', e.target.value)} />
                    ) : (
                      <p className="mt-2 text-[#2F4156]">{draft.name}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#567C8D] flex items-center gap-1"><Mail className="h-4 w-4" /> Email</Label>
                    {isEditing ? (
                      <Input type="email" value={draft.email} onChange={(e) => updateDraft('email', e.target.value)} />
                    ) : (
                      <p className="mt-2 text-[#2F4156]">{draft.email}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#567C8D] flex items-center gap-1"><Phone className="h-4 w-4" /> Phone</Label>
                    {isEditing ? (
                      <Input value={draft.phone} onChange={(e) => updateDraft('phone', e.target.value)} />
                    ) : (
                      <p className="mt-2 text-[#2F4156]">{draft.phone}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#567C8D] flex items-center gap-1"><Building2 className="h-4 w-4" /> University</Label>
                    {isEditing ? (
                      <Input value={draft.university} onChange={(e) => updateDraft('university', e.target.value)} />
                    ) : (
                      <p className="mt-2 text-[#2F4156]">{draft.university}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#567C8D] flex items-center gap-1"><BookOpen className="h-4 w-4" /> Major</Label>
                    {isEditing ? (
                      <Input value={draft.major} onChange={(e) => updateDraft('major', e.target.value)} />
                    ) : (
                      <p className="mt-2 text-[#2F4156]">{draft.major}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#567C8D] flex items-center gap-1"><Calendar className="h-4 w-4" /> Graduation Year</Label>
                    {isEditing ? (
                      <Input value={draft.graduationYear} onChange={(e) => updateDraft('graduationYear', e.target.value)} />
                    ) : (
                      <p className="mt-2 text-[#2F4156]">{draft.graduationYear}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#567C8D] flex items-center gap-1"><BadgeCheck className="h-4 w-4" /> GPA</Label>
                    {isEditing ? (
                      <Input value={draft.gpa} onChange={(e) => updateDraft('gpa', e.target.value)} />
                    ) : (
                      <p className="mt-2 text-[#2F4156]">{draft.gpa}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2F4156]"><GraduationCap className="h-5 w-5" /> Bio</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea rows={5} value={draft.bio} onChange={(e) => updateDraft('bio', e.target.value)} />
                ) : (
                  <p className="text-[#2F4156]">{draft.bio}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2F4156]"><Pencil className="h-5 w-5" /> Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {draft.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="bg-[#C8D9E6] text-[#2F4156]">
                      <span className="mr-1">{s}</span>
                      {isEditing && (
                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-[#2F4156]/70" onClick={() => removeSkill(s)}>
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
                      onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                      placeholder="Add a skill and press Enter"
                    />
                    <Button onClick={addSkill}>
                      <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2F4156]"><FileUp className="h-5 w-5" /> CV / Resume</CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.cvUrl ? (
                  <Badge className="mb-3 bg-emerald-600 text-white">CV on file</Badge>
                ) : (
                  <p className="mb-3 text-sm text-red-600">No CV uploaded</p>
                )}
                <div className="rounded-xl border border-dashed border-[#C8D9E6] bg-[#F5EFEB]/40 p-4 text-center">
                  <Upload className="mx-auto h-6 w-6 text-[#567C8D]" />
                  <p className="mt-2 text-sm text-[#2F4156]">Drag & drop or choose a file</p>
                  <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files?.[0] || null)} className="mt-3" />
                  <Button onClick={handleCVUpload} disabled={!cvFile} className="mt-3 w-full">
                    <FileUp className="mr-2 h-4 w-4" /> Upload
                  </Button>
                  {profile?.cvUrl && (
                    <Button asChild variant="secondary" className="mt-2 w-full">
                      <Link href={profile.cvUrl} target="_blank">
                        <FileDown className="mr-2 h-4 w-4" /> Download current CV
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2F4156]"><Link2 className="h-5 w-5" /> Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-[#567C8D]">LinkedIn</Label>
                    {isEditing ? (
                      <Input value={draft.linkedinUrl} onChange={(e) => updateDraft('linkedinUrl', e.target.value)} />
                    ) : (
                      <Link
                        href={draft.linkedinUrl}
                        target="_blank"
                        className="mt-2 inline-flex items-center gap-1 text-[#567C8D] underline underline-offset-4 hover:text-[#2F4156]"
                      >
                        {draft.linkedinUrl} <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                  <div>
                    <Label className="text-[#567C8D]">Portfolio</Label>
                    {isEditing ? (
                      <Input value={draft.portfolioUrl} onChange={(e) => updateDraft('portfolioUrl', e.target.value)} />
                    ) : (
                      <Link
                        href={draft.portfolioUrl}
                        target="_blank"
                        className="mt-2 inline-flex items-center gap-1 text-[#567C8D] underline underline-offset-4 hover:text-[#2F4156]"
                      >
                        {draft.portfolioUrl} <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save button (for small screens) */}
            {isEditing && (
              <Button onClick={handleSave} className="w-full bg-emerald-500 text-[#1b2b24] hover:bg-emerald-600">
                <Save className="mr-2 h-5 w-5" /> Save Changes
              </Button>
            )}
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-6 pb-10 text-center text-xs text-[#567C8D]">
        Updated • {new Date().toLocaleDateString()}
      </footer>
    </div>
  );
}
