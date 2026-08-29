"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, ListFilter, Search, CheckCircle } from "lucide-react";
import { cleanSlug } from "@/lib/utils";
import type { EpisodeItem } from "@/types/anime";

interface EpisodeDrawerProps {
  episodes: EpisodeItem[];
  currentEpisodeId: string;
  animeTitle: string;
}

export function EpisodeDrawer({
  episodes,
  currentEpisodeId,
  animeTitle,
}: EpisodeDrawerProps) {
  const [filter, setFilter] = useState("");
  const [order, setOrder] = useState<"desc" | "asc">("asc");

  const cleanCurrentId = cleanSlug(currentEpisodeId);

  const filteredEpisodes = episodes
    .filter((ep) => {
      if (!filter.trim()) return true;
      return ep.title.toLowerCase().includes(filter.toLowerCase()) || String(ep.eps || "").includes(filter);
    })
    .sort((a, b) => {
      const numA = typeof a.eps === "number" ? a.eps : parseInt(String(a.eps || "0"), 10);
      const numB = typeof b.eps === "number" ? b.eps : parseInt(String(b.eps || "0"), 10);
      return order === "asc" ? numA - numB : numB - numA;
    });

  return (
    <div className="w-full rounded-2xl bg-[#131b2a] border border-[#1e2c40] p-4 flex flex-col h-full">
      {/* Header & Filter Controls */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#1e2c40]">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-[#38bdf8]" />
          <h3 className="font-semibold text-sm text-[#f1f5f9]">Daftar Episode</h3>
          <span className="text-xs text-[#94a3b8]">({episodes.length})</span>
        </div>

        <button
          onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1a2538] hover:bg-[#1e2c40] text-[#cbd5e1] border border-[#273549] transition-colors"
        >
          {order === "asc" ? "Urutkan: 1 ? End" : "Urutkan: End ? 1"}
        </button>
      </div>

      {/* Quick Search inside Episode List (useful for 50+ / 100+ episodes) */}
      {episodes.length > 12 && (
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-2.5" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Cari nomor episode..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0d1422] border border-[#1e2c40] text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#384d6b]"
          />
        </div>
      )}

      {/* Scrollable Episode Grid */}
      <div className="overflow-y-auto max-h-[380px] md:max-h-[500px] pr-1 space-y-1.5 no-scrollbar">
        {filteredEpisodes.map((ep) => {
          const epId = ep.episodeId || cleanSlug(ep.href || "");
          const isCurrent = cleanSlug(epId) === cleanCurrentId;

          return (
            <Link
              key={epId}
              href={`/watch/${epId}`}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                isCurrent
                  ? "bg-[#6366f1] text-white shadow-md shadow-[#6366f1]/20 font-semibold"
                  : "bg-[#172033]/60 hover:bg-[#1e293b] text-[#cbd5e1] border border-[#1e2c40]/60 hover:border-[#273549]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] ${
                  isCurrent ? "bg-white/20 text-white" : "bg-[#1e293b] text-[#38bdf8]"
                }`}>
                  {ep.eps || <Play className="w-3 h-3 fill-current" />}
                </div>
                <span className="line-clamp-1 leading-snug">
                  {ep.title || `Episode ${ep.eps}`}
                </span>
              </div>

              {isCurrent ? (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-white shrink-0">
                  Sedang Ditonton
                </span>
              ) : (
                ep.date && (
                  <span className="text-[10px] text-[#64748b] shrink-0 hidden sm:inline">
                    {ep.date}
                  </span>
                )
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
