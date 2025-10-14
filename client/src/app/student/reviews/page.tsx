'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { ThumbsUp, Star, StarHalf, Filter, PencilLine } from 'lucide-react';

// Top nav (shadcn)
import { StudentTopNav } from '@/components/ui/student/top-nav';

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CompanyReview {
  id: string;
  companyName: string;
  rating: number; // 0-5, supports halves
  reviewTitle: string;
  reviewText: string;
  author: string;
  date: string; // ISO
  helpful: number;
  position: string;
  internship: boolean;
  compensation: number; // 1-5
  workLifeBalance: number; // 1-5
  culture: number; // 1-5
  management: number; // 1-5
  pros: string[];
  cons: string[];
}

export default function CompanyReviewsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');
  const [writeOpen, setWriteOpen] = useState(false);

  // Draft form for writing a review
  const [draft, setDraft] = useState({
    companyName: '',
    position: '',
    internship: true,
    rating: 4.5,
    reviewTitle: '',
    reviewText: '',
    compensation: 4,
    workLifeBalance: 4,
    culture: 4,
    management: 4,
    pros: '' as string, // comma separated
    cons: '' as string,
  });

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }
    // Mock data — replace with API call
    setReviews([
      {
        id: '1',
        companyName: 'Google',
        rating: 4.5,
        reviewTitle: 'Great internship experience',
        reviewText:
          'Excellent mentorship and learning opportunities. The projects were challenging and meaningful.',
        author: 'Anonymous Intern',
        date: '2024-01-15',
        helpful: 24,
        position: 'Software Engineering Intern',
        internship: true,
        compensation: 5,
        workLifeBalance: 4,
        culture: 5,
        management: 4,
        pros: ['Great mentorship', 'Competitive pay', 'Amazing office amenities'],
        cons: ['Can be bureaucratic', 'Large company politics'],
      },
      {
        id: '2',
        companyName: 'Microsoft',
        rating: 4.2,
        reviewTitle: 'Solid learning experience',
        reviewText:
          'Good work-life balance and supportive team. Projects were interesting but could be more challenging.',
        author: 'Former Intern',
        date: '2024-01-10',
        helpful: 18,
        position: 'Product Manager Intern',
        internship: true,
        compensation: 4,
        workLifeBalance: 5,
        culture: 4,
        management: 4,
        pros: ['Good work-life balance', 'Supportive culture', 'Great networking'],
        cons: ['Less challenging work', 'Slow career progression'],
      },
      {
        id: '3',
        companyName: 'Tech Startup',
        rating: 3.8,
        reviewTitle: 'Fast-paced but rewarding',
        reviewText:
          'Lots of responsibility and opportunity to make impact. Workload can be intense but you learn a lot.',
        author: 'Software Developer',
        date: '2024-01-20',
        helpful: 12,
        position: 'Full Stack Developer',
        internship: false,
        compensation: 3,
        workLifeBalance: 3,
        culture: 4,
        management: 3,
        pros: ['High impact work', 'Fast learning', 'Flexible environment'],
        cons: ['Work-life balance', 'Uncertainty', 'Less structure'],
      },
    ]);
  }, [user, router]);

  const companies = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.companyName))),
    [reviews]
  );

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const arr = reviews.filter((r) => {
      const matchesSearch = !term
        ? true
        : r.companyName.toLowerCase().includes(term) ||
          r.reviewTitle.toLowerCase().includes(term) ||
          r.reviewText.toLowerCase().includes(term);
      const matchesCompany = selectedCompany === 'all' || r.companyName === selectedCompany;
      return matchesSearch && matchesCompany;
    });

    switch (sortBy) {
      case 'rating':
        return arr.sort((a, b) => b.rating - a.rating);
      case 'helpful':
        return arr.sort((a, b) => b.helpful - a.helpful);
      default:
        return arr.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    }
  }, [reviews, searchTerm, selectedCompany, sortBy]);

  const submitDraft = () => {
    if (!draft.companyName || !draft.reviewTitle || !draft.reviewText) return;
    const newReview: CompanyReview = {
      id: crypto.randomUUID(),
      companyName: draft.companyName,
      rating: draft.rating,
      reviewTitle: draft.reviewTitle,
      reviewText: draft.reviewText,
      author: user?.name ?? 'Anonymous',
      date: new Date().toISOString(),
      helpful: 0,
      position: draft.position,
      internship: draft.internship,
      compensation: draft.compensation,
      workLifeBalance: draft.workLifeBalance,
      culture: draft.culture,
      management: draft.management,
      pros: draft.pros
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      cons: draft.cons
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    // Replace with API call
    setReviews((prev) => [newReview, ...prev]);
    setWriteOpen(false);
    setDraft({
      companyName: '',
      position: '',
      internship: true,
      rating: 4.5,
      reviewTitle: '',
      reviewText: '',
      compensation: 4,
      workLifeBalance: 4,
      culture: 4,
      management: 4,
      pros: '',
      cons: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#F5EFEB]">
      {/* ✅ shadcn Top Nav */}
      <StudentTopNav userName={user?.name} alertsCount={3} onLogout={logout} />

      <main className="mx-auto max-w-6xl p-6 md:p-8">
        {/* Search & Filters */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#2F4156]">
              <Filter className="h-5 w-5" /> Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="md:col-span-2">
                <Label className="text-[#567C8D]">Search</Label>
                <Input
                  placeholder="Search companies, titles, text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-[#567C8D]">Company</Label>
                <Select value={selectedCompany} onValueChange={(v) => setSelectedCompany(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Companies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Tabs value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <TabsList className="flex w-full flex-wrap gap-2 bg-[#F5EFEB] p-2">
                <TabsTrigger value="recent">Most recent</TabsTrigger>
                <TabsTrigger value="rating">Highest rating</TabsTrigger>
                <TabsTrigger value="helpful">Most helpful</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Reviews list */}
        <div className="mt-6 space-y-6">
          {filtered.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Main */}
                    <div className="flex-1">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-semibold text-[#2F4156]">{r.companyName}</h3>
                          <p className="text-[#567C8D]">
                            {r.position} {r.internship ? '(Internship)' : '(Full-time)'}
                          </p>
                        </div>
                        <Stars rating={r.rating} />
                      </div>

                      <h4 className="mb-2 text-lg font-semibold text-[#2F4156]">{r.reviewTitle}</h4>
                      <p className="text-[#374151] leading-relaxed">{r.reviewText}</p>

                      {/* Pros / Cons */}
                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="mb-2 font-semibold text-emerald-700">Pros</p>
                          <div className="flex flex-wrap gap-2">
                            {r.pros.map((p, i) => (
                              <Badge key={i} variant="secondary" className="bg-emerald-50 text-emerald-800">
                                {p}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="mb-2 font-semibold text-red-700">Cons</p>
                          <div className="flex flex-wrap gap-2">
                            {r.cons.map((c, i) => (
                              <Badge key={i} variant="secondary" className="bg-red-50 text-red-800">
                                {c}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm text-[#6B7280]">
                        <span>
                          By {r.author} • {new Date(r.date).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm" className="text-[#567C8D] hover:text-[#2F4156]">
                          <ThumbsUp className="mr-1 h-4 w-4" /> Helpful ({r.helpful})
                        </Button>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="lg:w-72">
                      <div className="rounded-xl bg-[#FAFAFA] p-4 ring-1 ring-[#E5E7EB]">
                        <p className="mb-3 font-semibold text-[#2F4156]">Rating Breakdown</p>
                        <Bar label="Compensation" value={r.compensation} />
                        <Bar label="Work-Life Balance" value={r.workLifeBalance} />
                        <Bar label="Culture" value={r.culture} />
                        <Bar label="Management" value={r.management} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <Card className="mt-6 text-center">
            <CardContent className="py-12">
              <div className="mb-4 text-6xl">🏢</div>
              <h3 className="mb-2 text-xl font-semibold text-[#2F4156]">No reviews found</h3>
              <p className="mb-6 text-[#567C8D]">
                {searchTerm || selectedCompany !== 'all'
                  ? 'No reviews match your search criteria.'
                  : 'No reviews available yet.'}
              </p>
              <Button onClick={() => { setSearchTerm(''); setSelectedCompany('all'); }}>Clear filters</Button>
            </CardContent>
          </Card>
        )}

        {/* Write Review CTA + Dialog */}
        <Card className="mt-10 overflow-hidden border-none bg-gradient-to-br from-[#2F4156] to-[#567C8D] text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold">Share Your Experience</h3>
            <p className="mx-auto mb-6 mt-2 max-w-2xl text-[#C8D9E6]">
              Help other students make informed decisions by sharing your internship or work experience.
            </p>
            <Dialog open={writeOpen} onOpenChange={setWriteOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-[#2F4156] hover:bg-[#C8D9E6]">
                  <PencilLine className="mr-2 h-4 w-4" /> Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Write a company review</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label>Company</Label>
                    <Input value={draft.companyName} onChange={(e) => setDraft({ ...draft, companyName: e.target.value })} />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input value={draft.position} onChange={(e) => setDraft({ ...draft, position: e.target.value })} />
                  </div>
                  <div>
                    <Label>Employment Type</Label>
                    <Select value={draft.internship ? 'intern' : 'full'} onValueChange={(v) => setDraft({ ...draft, internship: v === 'intern' })}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intern">Internship</SelectItem>
                        <SelectItem value="full">Full-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Overall Rating (0-5, halves OK)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      step={0.5}
                      value={draft.rating}
                      onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Title</Label>
                    <Input value={draft.reviewTitle} onChange={(e) => setDraft({ ...draft, reviewTitle: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Review</Label>
                    <Textarea rows={5} value={draft.reviewText} onChange={(e) => setDraft({ ...draft, reviewText: e.target.value })} />
                  </div>

                  {/* Sub ratings */}
                  <div>
                    <Label>Compensation (1-5)</Label>
                    <Input type="number" min={1} max={5} value={draft.compensation} onChange={(e) => setDraft({ ...draft, compensation: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>Work-Life Balance (1-5)</Label>
                    <Input type="number" min={1} max={5} value={draft.workLifeBalance} onChange={(e) => setDraft({ ...draft, workLifeBalance: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>Culture (1-5)</Label>
                    <Input type="number" min={1} max={5} value={draft.culture} onChange={(e) => setDraft({ ...draft, culture: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>Management (1-5)</Label>
                    <Input type="number" min={1} max={5} value={draft.management} onChange={(e) => setDraft({ ...draft, management: Number(e.target.value) })} />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Pros (comma separated)</Label>
                    <Input value={draft.pros} onChange={(e) => setDraft({ ...draft, pros: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Cons (comma separated)</Label>
                    <Input value={draft.cons} onChange={(e) => setDraft({ ...draft, cons: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={submitDraft}>Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div className="mb-2">
      <div className="mb-1 flex items-center justify-between text-sm text-[#6B7280]">
        <span className="w-40 truncate">{label}</span>
        <span className="font-medium text-[#374151]">{value}/5</span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  // supports halves (e.g., 4.5)
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return (
    <div className="flex items-center">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalf && <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} className="h-5 w-5 text-gray-300" />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}
