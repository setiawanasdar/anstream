"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Calendar, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { BookmarkButton } from "@/components/anime/BookmarkButton";
import { cleanSlug } from "@/lib/utils";
import type { OngoingAnimeItem } from "@/types/anime";

interface HeroBannerProps {
  animeList: OngoingAnimeItem[];
}

export function HeroBanner({ animeList }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featured = animeList.slice(0, 5);

  if (!featured || featured.length === 0) return null;

  const current = featured[currentIndex];
  const animeId = current.animeId || cleanSlug(current.href || "");

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#131b2a] border border-[#1e2c40] shadow-xl">
      {/* Background Poster with Blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src={current.poster}
          alt={current.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-30 filter blur-xl scale-110"
          unoptimized={true}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f18] via-[#0a0f18]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 min-h-[360px] md:min-h-[420px]">
        {/* Poster Card */}
        <div className="relative w-44 md:w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[#273549] shrink-0 group">
          <Image
            src={current.poster}
            alt={current.title}
            fill
            priority
            sizes="250px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized={true}
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#6366f1]/90 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3" />
            <span>Sedang Tayang</span>
          </div>
        </div>

        {/* Text & Actions */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Release badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
            {current.releaseDay && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e293b] border border-[#273549] text-xs text-[#38bdf8] font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Rilis Setiap {current.releaseDay}</span>
              </span>
            )}
            {current.episodes && (
              <span className="px-3 py-1 rounded-full bg-[#1e293b] border border-[#273549] text-xs text-[#cbd5e1] font-medium">
                Episode {current.episodes}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold text-[#f1f5f9] leading-tight mb-3">
            {current.title}
          </h1>

          <p className="text-sm text-[#94a3b8] line-clamp-3 mb-6 max-w-xl">
            Tonton episode terbaru dari {current.title} dengan subtitle Indonesia resmi dan kualitas video HD. Nikmati streaming lancar di semua perangkat Android & PC.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 w-full">
            <Link
              href={`/anime/${animeId}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium text-sm shadow-lg shadow-[#6366f1]/30 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Nonton Sekarang</span>
            </Link>

            <BookmarkButton
              anime={{
                id: animeId,
                title: current.title,
                poster: current.poster,
              }}
              variant="full"
            />
          </div>
        </div>
      </div>

      {/* Slider Nav Controls */}
      <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
        <button
          onClick={handlePrev}
          aria-label="Previous Banner"
          className="p-2 rounded-xl bg-[#1e293b]/80 hover:bg-[#1e293b] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#273549] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-[#94a3b8] px-1 font-medium">
          {currentIndex + 1} / {featured.length}
        </span>
        <button
          onClick={handleNext}
          aria-label="Next Banner"
          className="p-2 rounded-xl bg-[#1e293b]/80 hover:bg-[#1e293b] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#273549] transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
