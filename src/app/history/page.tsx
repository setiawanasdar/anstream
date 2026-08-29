"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { History, Play, Trash2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/supabase/provider";
import { timeAgo } from "@/lib/utils";

export default function HistoryPage() {
  const { watchHistory, removeHistoryItem, clearHistory } = useAuth();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2c40]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#f1f5f9]">Riwayat Nonton</h1>
            <p className="text-xs sm:text-sm text-[#94a3b8]">
              Lanjutkan menonton episode anime yang terakhir Anda buka
            </p>
          </div>
        </div>

        {watchHistory.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin menghapus semua riwayat tontonan?")) {
                clearHistory();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#172033] hover:bg-red-500/10 text-xs font-medium text-[#94a3b8] hover:text-red-400 border border-[#273549] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua Riwayat</span>
          </button>
        )}
      </div>

      {/* History List */}
      {watchHistory.length > 0 ? (
        <div className="space-y-3">
          {watchHistory.map((item) => (
            <div
              key={item.id || item.anime_id}
              className="flex items-center justify-between gap-4 p-3 sm:p-4 rounded-2xl bg-[#131b2a] border border-[#1e2c40] hover:border-[#384d6b] transition-all group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Poster */}
                <div className="relative w-14 sm:w-16 aspect-[3/4] rounded-xl overflow-hidden bg-[#0d1422] shrink-0">
                  <Image
                    src={item.anime_poster || "https://placehold.co/100x140/131b2a/94a3b8?text=Poster"}
                    alt={item.anime_title}
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 space-y-1">
                  <Link
                    href={`/anime/${item.anime_id}`}
                    className="font-bold text-sm text-[#f1f5f9] hover:text-[#38bdf8] transition-colors line-clamp-1"
                  >
                    {item.anime_title}
                  </Link>
                  <p className="text-xs text-[#38bdf8] font-medium line-clamp-1">
                    Terakhir ditonton: {item.episode_title}
                  </p>
                  <span className="text-[11px] text-[#64748b] block">
                    {timeAgo(item.last_watched_at)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/watch/${item.episode_id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-xs font-semibold text-white shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Lanjutkan</span>
                </Link>

                <button
                  onClick={() => removeHistoryItem(item.anime_id)}
                  title="Hapus dari Riwayat"
                  className="p-2 rounded-xl text-[#64748b] hover:text-red-400 hover:bg-[#1e293b] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-[#131b2a]/50 border border-[#1e2c40] p-8 space-y-4">
          <History className="w-12 h-12 text-[#64748b] mx-auto opacity-50" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-[#f1f5f9]">Belum ada riwayat tontonan</h3>
            <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
              Setiap episode anime yang Anda tonton akan otomatis tersimpan di sini agar mudah dilanjutkan.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-md transition-all"
          >
            <span>Mulai Nonton Anime</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
