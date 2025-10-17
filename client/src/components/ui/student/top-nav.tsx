'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Briefcase, LogOut, School, Star, User2, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type TopNavProps = {
  userName?: string;
  alertsCount?: number;
  onLogout: () => void;
};

function getInitials(name?: string) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  return (first + last).toUpperCase() || 'U';
}

export function StudentTopNav({ userName, alertsCount = 0, onLogout }: TopNavProps) {
  const pathname = usePathname();
  const onDashboard = pathname?.startsWith('/student/dashboard');

  const quickLinks = [
    {
      href: '/student/applications',
      label: 'Applications',
      icon: <Briefcase className="h-4 w-4" />,
      active: pathname?.startsWith('/student/applications'),
    },
    {
      href: '/student/reviews',
      label: 'Reviews',
      icon: <Star className="h-4 w-4" />,
      active: pathname?.startsWith('/student/reviews'),
    },
  ];

  return (
    <div className="relative isolate border-b border-black/5 bg-gradient-to-r from-[#2F4156] via-[#2F4156] to-[#567C8D] text-white shadow-lg">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <School className="h-6 w-6" />
          <span className="text-base font-semibold leading-none sm:text-lg">
            Student Dashboard
          </span>
        </div>

        {/* Desktop actions */}
        <TooltipProvider delayDuration={200}>
          <div className="hidden items-center gap-2 md:flex">
            {/* Dashboard (always visible; replaces Back) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  size="sm"
                  variant={onDashboard ? 'default' : 'secondary'}
                  className={onDashboard ? 'bg-white text-[#2F4156]' : 'bg-white/10 text-white hover:bg-white/20'}
                >
                  <Link href="/student/dashboard" className="inline-flex items-center gap-2">
                    <School className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go to Dashboard</TooltipContent>
            </Tooltip>

            {/* Quick links */}
            {quickLinks.map((q) => (
              <Tooltip key={q.href}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    size="sm"
                    variant={q.active ? 'default' : 'secondary'}
                    className={q.active ? 'bg-white text-[#2F4156]' : 'bg-white/10 text-white hover:bg-white/20'}
                  >
                    <Link href={q.href} className="inline-flex items-center gap-2">
                      {q.icon}
                      <span className="hidden sm:inline">{q.label}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{q.label}</TooltipContent>
              </Tooltip>
            ))}

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="relative bg-white/10 text-white hover:bg-white/20"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {alertsCount > 0 && (
                    <Badge className="absolute -right-2 -top-2 h-5 min-w-5 rounded-full bg-emerald-400 px-1 text-xs font-bold text-[#2F4156]">
                      {alertsCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Alerts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-sm">✅ CV uploaded successfully</DropdownMenuItem>
                <DropdownMenuItem className="text-sm">⏳ Application under review (Nebula Labs – UI/UX Intern)</DropdownMenuItem>
                <DropdownMenuItem className="text-sm">💬 New company feedback received</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User dropdown: Profile + Logout */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/10 text-white hover:bg-white/20 inline-flex items-center gap-2"
                  aria-label="Account menu"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-sm font-bold">
                    {getInitials(userName)}
                  </span>
                  <span className="hidden sm:inline text-sm">{userName ?? 'Account'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <User2 className="h-4 w-4" />
                  {userName ?? 'Student'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/student/profile" className="inline-flex w-full items-center gap-2">
                    <User2 className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={onLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" /> Student Dashboard
                </SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-2">
                {/* Dashboard (mobile) */}
                <Button asChild className="w-full justify-start" variant={onDashboard ? 'default' : 'secondary'}>
                  <Link href="/student/dashboard" className="inline-flex items-center gap-2">
                    <School className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>

                {/* Quick links */}
                {quickLinks.map((q) => (
                  <Button
                    key={q.href}
                    asChild
                    variant={q.active ? 'default' : 'secondary'}
                    className="w-full justify-start"
                  >
                    <Link href={q.href} className="inline-flex items-center gap-2">
                      {q.icon}
                      {q.label}
                    </Link>
                  </Button>
                ))}

                {/* Alerts summary */}
                <div className="mt-4 flex items-center justify-between rounded-lg bg-[#F5EFEB] p-3">
                  <span className="text-sm font-medium text-[#2F4156]">Alerts</span>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-[#2F4156]" />
                    {alertsCount > 0 && (
                      <Badge className="bg-emerald-500 text-[#1b2b24]">{alertsCount}</Badge>
                    )}
                  </div>
                </div>

                {/* Account section (mobile) */}
                <div className="mt-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Account
                  </div>
                  <Button asChild variant="secondary" className="w-full justify-start">
                    <Link href="/student/profile" className="inline-flex items-center gap-2">
                      <User2 className="h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button onClick={onLogout} className="mt-2 w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
