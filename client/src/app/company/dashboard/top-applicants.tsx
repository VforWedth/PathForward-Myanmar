'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Mail, User2, ExternalLink, MapPin } from 'lucide-react';

export type CompanyApplicant = {
  id: string;
  name: string;
  email: string;
  position: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string; // ISO string
  skills: string[];
  experience: string;
  education: string;
  location?: string;
};

function StatusBadge({ status }: { status: CompanyApplicant['status'] }) {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case 'reviewed':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Reviewed</Badge>;
    case 'accepted':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>;
    case 'rejected':
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
  }
}

export function TopApplicants({
  applicants,
  limit = 5,
  title = 'Top Applicants',
  viewAllHref = '/company/applicants',
}: {
  applicants: CompanyApplicant[];
  limit?: number;
  title?: string;
  viewAllHref?: string;
}) {
  const list = applicants.slice(0, limit);

  return (
    <Card className="shadow-sm border-[#C8D9E6]">
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
        {list.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#C8D9E6] p-6 text-center text-[#567C8D]">
            No applicants yet.
          </div>
        )}

        {list.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-[#E3EAF1] bg-white p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <User2 className="h-4 w-4 text-[#567C8D]" />
                      <h4 className="text-base font-semibold text-[#2F4156]">{a.name}</h4>
                    </div>
                    <p className="text-sm text-[#567C8D]">{a.position}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>

                <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-[#567C8D] md:grid-cols-3">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Applied: {new Date(a.appliedDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <a href={`mailto:${a.email}`} className="underline underline-offset-2">
                      {a.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {a.location ?? '—'}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {a.skills.slice(0, 5).map((s, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-[#F5EFEB] px-2 py-1 text-xs text-[#2F4156] ring-1 ring-[#E3EAF1]"
                    >
                      {s}
                    </span>
                  ))}
                  {a.skills.length > 5 && (
                    <span className="text-xs text-[#567C8D]">+{a.skills.length - 5} more</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 md:ml-4">
                <Button asChild>
                  <Link href={`/company/applicants?select=${a.id}`}>Open</Link>
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
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
