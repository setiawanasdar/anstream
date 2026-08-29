"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Star, Calendar, Film } from "lucide-react";
import { BookmarkButton } from "./BookmarkButton";
import { cleanSlug } from "@/lib/utils";

interface AnimeCardProps {
  anime: {
    title: string;
    poster: string;
    episodes?: number | string | null;
    score?: string;
    releaseDay?: string;
    latestReleaseDate?: string;
    lastReleaseDate?: string;
    animeId?: string;
    slug?: string;
    url?: string;
    href?: string;
    type?: string;
  };
  priority?: boolean;
}

export function AnimeCard({ anime, priority = false }: AnimeCardProps) {
  const [imageError, setImageError] = useState(false);
  const animeId = anime.animeId || anime.slug || cleanSlug(anime.href || anime.url || "");
  const episodeCount = anime.episodes ? `Ep ${anime.episodes}` : null;
  const badgeInfo = anime.releaseDay || anime.latestReleaseDate || anime.lastReleaseDate || episodeCount;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#131b2a]/70 border border-[#1e2c40] hover:border-[#384d6b] transition-all duration-300 hover:shadow-lg hover:shadow-[#0a0f18]/50 overflow-hidden">
      {/* Poster Image Container */}
      <Link href={`/anime/${animeId}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[#0d1422]">
        <Image
          src={imageError || !anime.poster ? "https://placehold.co/300x400/131b2a/94a3b8?text=No+Image" : anime.poster}
          alt={anime.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
          priority={priority}
          unoptimized={true}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Score Badge (Top Left) */}
        {anime.score && anime.score !== "" && anime.score !== "0" && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-lg bg-[#0a0f18]/80 backdrop-blur-md px-2 py-0.5 text-xs font-semibold text-[#fbbf24] border border-[#fbbf24]/30">
            <Star className="w-3 h-3 fill-current" />
            <span>{anime.score}</span>
          </div>
        )}

        {/* Bookmark Quick Action (Top Right) */}
        <div className="absolute top-2.5 right-2.5 opacity-90 transition-opacity">
          <BookmarkButton
            anime={{
              id: animeId,
              title: anime.title,
              poster: anime.poster,
            }}
          />
        </div>

        {/* Release / Episode Badge (Bottom Left) */}
        {badgeInfo && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-md bg-[#1e293b]/90 backdrop-blur-md px-2 py-0.5 text-[11px] font-medium text-[#cbd5e1] border border-[#334155]/60">
            {anime.releaseDay ? <Calendar className="w-3 h-3 text-[#38bdf8]" /> : <Film className="w-3 h-3 text-[#818cf8]" />}
            <span>{badgeInfo}</span>
          </div>
        )}

        {/* Hover Play Button Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/40 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </Link>

      {/* Info Container */}
      <div className="flex flex-col flex-1 p-3">
        <Link href={`/anime/${animeId}`} className="hover:text-[#38bdf8] transition-colors">
          <h3 className="font-semibold text-sm text-[#f1f5f9] line-clamp-2 leading-snug" title={anime.title}>
            {anime.title}
          </h3>
        </Link>
        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-[#94a3b8]">
          <span className="text-[11px] text-[#64748b]">{anime.type || "Anime"}</span>
          <span className="text-[11px] font-medium text-[#38bdf8] hover:underline">
            Lihat Detail &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}
