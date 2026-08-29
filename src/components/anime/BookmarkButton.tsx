"use client";

import React, { useState } from "react";
import { Bookmark as BookmarkIcon, Check } from "lucide-react";
import { useAuth } from "@/lib/supabase/provider";

interface BookmarkButtonProps {
  anime: {
    id: string;
    title: string;
    poster?: string;
  };
  variant?: "icon" | "full";
  className?: string;
}

export function BookmarkButton({ anime, variant = "icon", className = "" }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useAuth();
  const bookmarked = isBookmarked(anime.id);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleBookmark(anime);
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleToggle}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
          bookmarked
            ? "bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8]/40 hover:bg-[#1e293b]/80"
            : "bg-[#1e293b]/80 text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1e293b] border border-[#273549]"
        } ${className}`}
      >
        {bookmarked ? (
          <>
            <Check className="w-4 h-4 text-[#38bdf8]" />
            <span>Tersimpan di Watchlist</span>
          </>
        ) : (
          <>
            <BookmarkIcon className="w-4 h-4" />
            <span>+ Tambah ke Watchlist</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      title={bookmarked ? "Hapus dari Watchlist" : "Simpan ke Watchlist"}
      className={`p-2 rounded-lg backdrop-blur-md transition-all duration-200 ${
        bookmarked
          ? "bg-[#6366f1] text-white shadow-sm"
          : "bg-[#0a0f18]/80 text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1e293b] border border-[#273549]/60"
      } ${className}`}
    >
      <BookmarkIcon className="w-4 h-4 fill-current" />
    </button>
  );
}
