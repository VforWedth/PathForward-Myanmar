'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle, ExternalLink } from 'lucide-react';
import { FAQ } from './FAQData';

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  showViewAllLink?: boolean;
}

export function FAQSection({ faqs, title = 'Frequently Asked Questions', showViewAllLink = true }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const displayFAQs = faqs.slice(0, 5); // Show max 5 FAQs in dashboard

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="rounded-2xl border border-[#C8D9E6] bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-100 p-2">
            <HelpCircle className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-[#2F4156]">{title}</h3>
        </div>
        {showViewAllLink && (
          <Link
            href="/faq"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
          >
            View All <ExternalLink className="h-4 w-4" />
          </Link>
        )}
      </div>

      <p className="mb-4 text-[#567C8D]">
        Quick answers to common questions
      </p>

      <div className="space-y-3">
        {displayFAQs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border border-[#E3EAF1] bg-white overflow-hidden hover:shadow-sm transition"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition"
            >
              <span className="font-medium text-[#2F4156] text-sm pr-4">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-4 pb-3 text-sm text-[#567C8D] leading-relaxed border-t border-[#E3EAF1]">
                <div className="pt-3">{faq.answer}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {faqs.length > 5 && showViewAllLink && (
        <div className="mt-4 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-white text-sm shadow-sm transition hover:translate-y-[-1px] hover:bg-indigo-700"
          >
            <HelpCircle className="h-4 w-4" />
            View All FAQs
          </Link>
        </div>
      )}
    </div>
  );
}
