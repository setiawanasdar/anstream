"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination as PaginationType } from "@/types/anime";

interface PaginationProps {
  pagination: PaginationType;
  baseUrl: string;
}

export function Pagination({ pagination, baseUrl }: PaginationProps) {
  const { currentPage, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = pagination;

  if (totalPages <= 1) return null;

  const createPageUrl = (p: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${p}`;
  };

  // Generate visible page numbers
  const pages: number[] = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-8">
      {/* Previous Button */}
      {hasPrevPage && prevPage ? (
        <Link
          href={createPageUrl(prevPage)}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#131b2a] hover:bg-[#1e2c40] text-xs font-medium text-[#cbd5e1] border border-[#1e2c40] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#131b2a]/40 text-xs font-medium text-[#64748b] border border-[#1e2c40]/40 cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>
      )}

      {/* First Page if far */}
      {startPage > 1 && (
        <>
          <Link
            href={createPageUrl(1)}
            className="px-3 py-2 rounded-xl bg-[#131b2a] hover:bg-[#1e2c40] text-xs font-medium text-[#cbd5e1] border border-[#1e2c40] transition-colors"
          >
            1
          </Link>
          {startPage > 2 && <span className="text-[#64748b] px-1 text-xs">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((p) => {
        const isCurrent = p === currentPage;
        return (
          <Link
            key={p}
            href={createPageUrl(p)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              isCurrent
                ? "bg-[#6366f1] text-white shadow-md shadow-[#6366f1]/30"
                : "bg-[#131b2a] hover:bg-[#1e2c40] text-[#cbd5e1] border border-[#1e2c40]"
            }`}
          >
            {p}
          </Link>
        );
      })}

      {/* Last Page if far */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-[#64748b] px-1 text-xs">...</span>}
          <Link
            href={createPageUrl(totalPages)}
            className="px-3 py-2 rounded-xl bg-[#131b2a] hover:bg-[#1e2c40] text-xs font-medium text-[#cbd5e1] border border-[#1e2c40] transition-colors"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next Button */}
      {hasNextPage && nextPage ? (
        <Link
          href={createPageUrl(nextPage)}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#131b2a] hover:bg-[#1e2c40] text-xs font-medium text-[#cbd5e1] border border-[#1e2c40] transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#131b2a]/40 text-xs font-medium text-[#64748b] border border-[#1e2c40]/40 cursor-not-allowed"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
