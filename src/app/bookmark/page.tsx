"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Play, Trash2, Heart, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/supabase/provider";

export default function BookmarkPage() {
  const { bookmarks, removeBookmark, user } = useAuth();
  const [filter, setFilter] = useState<string>("all");

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2c40]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#6366f1]/20 text-[#38bdf8] border border-[#6366f1]/30">
            <Bookmark className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#f1f5f9]">Watchlist Saya</h1>
            <p className="text-xs sm:text-sm text-[#94a3b8]">
              {bookmarks.length} anime tersimpan di daftar tontonan Anda
            </p>
          </div>
        </div>

        {!user && (
          <div className="px-3.5 py-1.5 rounded-xl bg-[#131b2a] border border-[#1e2c40] text-xs text-[#94a3b8] flex items-center gap-2">
            <span>Tersimpan di browser lokal.</span>
            <Link href="/login" className="text-[#38bdf8] font-semibold hover:underline">
              Masuk untuk sinkronisasi cloud
            </Link>
          </div>
        )}
      </div>

      {/* Bookmarks Grid */}
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {bookmarks.map((bm) => (
            <div
              key={bm.id || bm.anime_id}
              className="group relative flex flex-col rounded-2xl bg-[#131b2a]/70 border border-[#1e2c40] hover:border-[#384d6b] transition-all overflow-hidden"
            >
              {/* Poster */}
              <Link href={`/anime/${bm.anime_id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[#0d1422]">
                <Image
                  src={bm.anime_poster || "https://placehold.co/300x400/131b2a/94a3b8?text=Poster"}
                  alt={bm.anime_title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent opacity-80" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6366f1] text-white shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </Link>

              {/* Info & Delete Button */}
              <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                <Link href={`/anime/${bm.anime_id}`} className="hover:text-[#38bdf8] transition-colors">
                  <h3 className="font-semibold text-xs text-[#f1f5f9] line-clamp-2 leading-snug">
                    {bm.anime_title}
                  </h3>
                </Link>

                <div className="flex items-center justify-between pt-2 border-t border-[#1e2c40]/60">
                  <Link
                    href={`/anime/${bm.anime_id}`}
                    className="text-[11px] font-semibold text-[#38bdf8] hover:underline"
                  >
                    Tonton &rarr;
                  </Link>

                  <button
                    onClick={() => removeBookmark(bm.anime_id)}
                    title="Hapus dari Watchlist"
                    className="p-1.5 rounded-lg text-[#64748b] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-[#131b2a]/50 border border-[#1e2c40] p-8 space-y-4">
          <Bookmark className="w-12 h-12 text-[#64748b] mx-auto opacity-50" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-[#f1f5f9]">Watchlist Anda masih kosong</h3>
            <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
              Simpan anime yang ingin Anda tonton dengan menekan ikon bookmark pada kartu anime atau halaman detail.
            </p>
          </div>
          <Link
            href="/ongoing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Jelajahi Anime Ongoing</span>
          </Link>
        </div>
      )}
    </div>
  );
}
