import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  itemName?: string; // e.g., "jobs", "students", "applicants"
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = '',
  itemName = 'items'
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 7;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null; // Don't show pagination if only one page
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Item count info */}
      <p className="text-sm text-[#567C8D]">
        Showing <span className="font-medium text-[#2F4156]">{startItem}</span> to{' '}
        <span className="font-medium text-[#2F4156]">{endItem}</span> of{' '}
        <span className="font-medium text-[#2F4156]">{totalItems}</span> {itemName}
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-2 text-sm text-[#567C8D]"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isCurrentPage = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isCurrentPage
                    ? 'bg-[#2F4156] text-white ring-2 ring-[#2F4156]'
                    : 'bg-white text-[#2F4156] ring-1 ring-[#C8D9E6] hover:bg-[#C8D9E6]/30'
                }`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Compact version for smaller spaces
export function CompactPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}: Omit<PaginationProps, 'totalItems' | 'itemsPerPage' | 'itemName'>) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg bg-white p-2 text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="text-sm text-[#567C8D]">
        Page <span className="font-medium text-[#2F4156]">{currentPage}</span> of{' '}
        <span className="font-medium text-[#2F4156]">{totalPages}</span>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-lg bg-white p-2 text-[#2F4156] ring-1 ring-[#C8D9E6] transition hover:bg-[#C8D9E6]/30 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
