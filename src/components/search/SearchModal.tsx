"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, Play, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cleanSlug } from "@/lib/utils";
import type { SearchAnimeItem } from "@/types/anime";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_GENRES = ["Action", "Adventure", "Isekai", "Romance", "Fantasy", "Comedy", "Shounen", "Sci-Fi"];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchAnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/anime/search?q=${encodeURIComponent(query.trim())}`);
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setResults(json.data);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 md:pt-20 px-4 bg-[#0a0f18]/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#131b2a] border border-[#1e2c40] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-[#1e2c40]">
          <Search className="w-5 h-5 text-[#94a3b8] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul anime (contoh: Solo Leveling, Bleach, One Piece)..."
            className="w-full bg-transparent text-sm md:text-base text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
          />
          {isLoading && <Loader2 className="w-4 h-4 text-[#6366f1] animate-spin shrink-0 mx-2" />}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1e2c40] mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-medium text-[#94a3b8] hover:text-[#f1f5f9] bg-[#1e2c40] rounded-lg ml-2 shrink-0"
          >
            Tutup
          </button>
        </div>

        {/* Results / Suggestion Body */}
        <div className="overflow-y-auto p-4 space-y-4 no-scrollbar">
          {!query && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#94a3b8] mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Pencarian Cepat Berdasarkan Genre:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_GENRES.map((genre) => (
                  <Link
                    key={genre}
                    href={`/genres/${genre.toLowerCase()}`}
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-xl bg-[#1a2538] hover:bg-[#6366f1]/20 hover:text-[#38bdf8] text-xs text-[#cbd5e1] border border-[#273549] transition-colors"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {query && results.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-[#94a3b8] px-1">
                Ditemukan {results.length} hasil untuk &quot;{query}&quot;
              </div>
              <div className="grid grid-cols-1 gap-2">
                {results.map((anime) => {
                  const id = anime.animeId || cleanSlug(anime.href || "");
                  return (
                    <Link
                      key={id}
                      href={`/anime/${id}`}
                      onClick={onClose}
                      className="flex items-center gap-3.5 p-2.5 rounded-xl bg-[#172033]/60 hover:bg-[#1e2c40] border border-transparent hover:border-[#384d6b] transition-all group"
                    >
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-[#0d1422]">
                        <Image
                          src={anime.poster || "https://placehold.co/100x140/131b2a/94a3b8?text=Poster"}
                          alt={anime.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                          unoptimized={true}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#f1f5f9] group-hover:text-[#38bdf8] line-clamp-1">
                          {anime.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[#94a3b8]">
                          {anime.status && (
                            <span className="px-2 py-0.5 rounded bg-[#1e2c40] text-[10px] text-[#cbd5e1]">
                              {anime.status}
                            </span>
                          )}
                          {anime.score && (
                            <span className="flex items-center gap-1 text-[#fbbf24] text-[11px]">
                              <Star className="w-3 h-3 fill-current" />
                              {anime.score}
                            </span>
                          )}
                          {anime.genreList && anime.genreList.length > 0 && (
                            <span className="line-clamp-1 text-[11px] text-[#64748b]">
                              {anime.genreList.slice(0, 3).map((g) => g.title).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-[#1e2c40] text-[#94a3b8] group-hover:text-white group-hover:bg-[#6366f1] transition-colors shrink-0">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {query && !isLoading && results.length === 0 && (
            <div className="py-12 text-center text-[#94a3b8]">
              <p className="text-sm">Tidak menemukan anime untuk &quot;{query}&quot;.</p>
              <p className="text-xs text-[#64748b] mt-1">Coba gunakan kata kunci yang lebih singkat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
