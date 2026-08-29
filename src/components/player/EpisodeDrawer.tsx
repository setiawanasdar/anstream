"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Play, ListFilter, Search, Layers, ArrowUpDown } from "lucide-react";
import { cleanSlug } from "@/lib/utils";
import type { EpisodeItem } from "@/types/anime";

interface EpisodeDrawerProps {
  episodes: EpisodeItem[];
  currentEpisodeId: string;
  animeTitle: string;
}

const BATCH_SIZE = 50;

export function EpisodeDrawer({
  episodes,
  currentEpisodeId,
  animeTitle,
}: EpisodeDrawerProps) {
  const [filter, setFilter] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(0);

  const cleanCurrentId = cleanSlug(currentEpisodeId);

  // Split into batches if episodes > 25 (e.g. 1-50, 51-100, 101-150)
  const batches = useMemo(() => {
    if (episodes.length <= 25) return [];
    const chunks = [];
    for (let i = 0; i < episodes.length; i += BATCH_SIZE) {
      const start = i + 1;
      const end = Math.min(i + BATCH_SIZE, episodes.length);
      chunks.push({
        label: `Eps ${start}?${end}`,
        startIdx: i,
        endIdx: end,
      });
    }
    return chunks;
  }, [episodes]);

  // Determine which batch the current episode is in, and focus it
  React.useEffect(() => {
    if (batches.length > 0) {
      const currentIdx = episodes.findIndex(
        (ep) => cleanSlug(ep.episodeId || ep.href || "") === cleanCurrentId
      );
      if (currentIdx !== -1) {
        const batchIdx = Math.floor(currentIdx / BATCH_SIZE);
        setSelectedBatchIndex(batchIdx);
      }
    }
  }, [cleanCurrentId, episodes, batches.length]);

  // Filter and sort
  const displayEpisodes = useMemo(() => {
    let list = episodes;

    // Apply batch slice only if not searching
    if (batches.length > 0 && !filter.trim()) {
      const batch = batches[selectedBatchIndex] || batches[0];
      if (batch) {
        list = episodes.slice(batch.startIdx, batch.endIdx);
      }
    }

    if (filter.trim()) {
      const q = filter.toLowerCase();
      list = episodes.filter(
        (ep) =>
          ep.title.toLowerCase().includes(q) || String(ep.eps || "").includes(q)
      );
    }

    return [...list].sort((a, b) => {
      const numA = typeof a.eps === "number" ? a.eps : parseInt(String(a.eps || "0"), 10);
      const numB = typeof b.eps === "number" ? b.eps : parseInt(String(b.eps || "0"), 10);
      return order === "asc" ? numA - numB : numB - numA;
    });
  }, [episodes, filter, batches, selectedBatchIndex, order]);

  return (
    <div className="w-full rounded-2xl md:rounded-3xl bg-[#131b2a] border border-[#1e2c40] p-4 sm:p-5 flex flex-col h-full shadow-xl">
      {/* Header & Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e2c40] gap-2">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-[#38bdf8]" />
          <h3 className="font-bold text-sm text-[#f1f5f9]">Daftar Episode</h3>
          <span className="text-xs text-[#94a3b8]">({episodes.length})</span>
        </div>

        <button
          onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
          className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-xl bg-[#1e293b] hover:bg-[#273549] text-[#cbd5e1] border border-[#273549] transition-colors"
        >
          <ArrowUpDown className="w-3 h-3 text-[#38bdf8]" />
          <span>{order === "asc" ? "1 ? End" : "End ? 1"}</span>
        </button>
      </div>

      {/* Episode Range Selector Tabs (Eps 1-50, 51-100, etc.) */}
      {batches.length > 0 && !filter.trim() && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
          <Layers className="w-3.5 h-3.5 text-[#64748b] shrink-0 mr-1" />
          {batches.map((batch, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedBatchIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedBatchIndex === idx
                  ? "bg-[#6366f1] text-white shadow-md shadow-[#6366f1]/30"
                  : "bg-[#172033] text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1e293b] border border-[#273549]"
              }`}
            >
              {batch.label}
            </button>
          ))}
        </div>
      )}

      {/* Quick Search filter inside long episode lists */}
      {episodes.length > 10 && (
        <div className="relative my-2.5">
          <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-2.5" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Cari nomor episode (misal: 12)..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0d1422] border border-[#1e2c40] text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6366f1]"
          />
        </div>
      )}

      {/* Scrollable Episode List */}
      <div className="overflow-y-auto max-h-[380px] md:max-h-[500px] pr-1 space-y-1.5 no-scrollbar mt-1">
        {displayEpisodes.map((ep) => {
          const epId = ep.episodeId || cleanSlug(ep.href || "");
          const isCurrent = cleanSlug(epId) === cleanCurrentId;

          return (
            <Link
              key={epId}
              href={`/watch/${epId}`}
              className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-xs transition-all ${
                isCurrent
                  ? "bg-[#6366f1] text-white shadow-md shadow-[#6366f1]/20 font-semibold"
                  : "bg-[#172033]/60 hover:bg-[#1e293b] text-[#cbd5e1] border border-[#1e2c40]/60 hover:border-[#273549]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold ${
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
                  Ditonton
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
