'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, DollarSign, MapPin, FileText, ExternalLink } from 'lucide-react';

export type JobApplication = {
  id: string;
  jobTitle: string;
  company: string;
  status: 'applied' | 'under-review' | 'interview' | 'rejected' | 'accepted';
  appliedDate: string;
  location: string;
  salary?: string;
  interviewDate?: string;
  companyLogo?: string;
};

function StatusBadge({ status }: { status: JobApplication['status'] }) {
  switch (status) {
    case 'applied':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Applied</Badge>;
    case 'under-review':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
    case 'interview':
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Interview</Badge>;
    case 'rejected':
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
    case 'accepted':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>;
  }
}

export function TopApplications({
  applications,
  limit = 5,
  title = 'Top Applications',
  viewAllHref = '/student/applications',
}: {
  applications: JobApplication[];
  limit?: number;
  title?: string;
  viewAllHref?: string;
}) {
  const sliced = applications.slice(0, limit);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-[#2F4156]">{title}</CardTitle>
        <Button
          asChild
          variant="outline"
          className="border-[#567C8D] text-[#567C8D] hover:bg-[#567C8D] hover:text-white"
        >
          <Link href={viewAllHref}>
            View all <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {sliced.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#C8D9E6] p-6 text-center text-[#567C8D]">
            No applications yet. <Link href="/jobs" className="underline underline-offset-4">Browse jobs</Link>
          </div>
        )}

        {sliced.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: i * 0.03 }}
            className="rounded-xl border border-[#E3EAF1] bg-white p-4"
          >
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#2F4156]">{a.jobTitle}</h3>
                    <p className="text-sm font-medium text-[#567C8D]">{a.company}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm text-[#567C8D] md:grid-cols-3">
                  <div className="flex items-center"><MapPin className="mr-2 h-4 w-4" /> {a.location}</div>
                  <div className="flex items-center"><DollarSign className="mr-2 h-4 w-4" /> {a.salary ?? '—'}</div>
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" /> Applied: {new Date(a.appliedDate).toLocaleDateString()}
                  </div>
                </div>

                {a.interviewDate && (
                  <div className="mt-2 rounded-md bg-blue-50 p-2 text-xs text-blue-800">
                    <span className="font-medium">Interview:</span> {new Date(a.interviewDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex gap-2 md:ml-4">
                <Button asChild>
                  <Link href={`/student/applications/${a.id}`}>
                    <FileText className="mr-2 h-4 w-4" /> Details
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#567C8D] text-[#567C8D] hover:bg-[#567C8D] hover:text-white"
                >
                  <Link href={viewAllHref}>Manage</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
