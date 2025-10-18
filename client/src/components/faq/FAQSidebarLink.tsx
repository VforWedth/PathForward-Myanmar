'use client';

import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

interface FAQSidebarLinkProps {
  className?: string;
}

export function FAQSidebarLink({ className = '' }: FAQSidebarLinkProps) {
  return (
    <Link
      href="/faq"
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ${className}`}
    >
      <HelpCircle className="h-5 w-5 text-gray-500" />
      <span>Help & FAQ</span>
    </Link>
  );
}
