"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, RotateCcw, ChevronLeft, ChevronRight, Maximize2, Minimize2, AlertCircle, Loader2 } from "lucide-react";
import { ServerSelector } from "./ServerSelector";
import { DownloadBox } from "./DownloadBox";
import { useAuth } from "@/lib/supabase/provider";
import { cleanSlug, extractEpisodeNumber } from "@/lib/utils";
import type { EpisodeStreamData, ServerItem } from "@/types/anime";

interface VideoPlayerProps {
  streamData: EpisodeStreamData;
  episodeId: string;
}

export function VideoPlayer({ streamData, episodeId }: VideoPlayerProps) {
  const { saveWatchHistory } = useAuth();
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>(
    streamData.defaultStreamingUrl || ""
  );
  const [selectedServer, setSelectedServer] = useState<ServerItem | null>(null);
  const [isLoadingServer, setIsLoadingServer] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);

  // Auto save watch history on load
  useEffect(() => {
    if (streamData) {
      const epNum = extractEpisodeNumber(streamData.title);
      saveWatchHistory({
        animeId: streamData.animeId,
        animeTitle: streamData.title.split("Episode")[0]?.trim() || streamData.animeId,
        episodeId: cleanSlug(episodeId),
        episodeTitle: streamData.title,
        episodeNumber: epNum,
      });
    }
  }, [episodeId, streamData]);

  // Handle server switcher
  const handleSelectServer = async (server: ServerItem, quality: string) => {
    setSelectedServer(server);
    setIsLoadingServer(true);

    try {
      const res = await fetch(`/api/anime/server/${cleanSlug(server.serverId)}`);
      const json = await res.json();
      if (json.data && json.data.url) {
        setCurrentStreamUrl(json.data.url);
        setPlayerKey((prev) => prev + 1);
      } else {
        alert("Gagal memuat server ini. Silakan coba server alternatif.");
      }
    } catch (err) {
      console.error("Error switching server:", err);
      alert("Terjadi kesalahan saat mengganti server.");
    } finally {
      setIsLoadingServer(false);
    }
  };

  const handleReloadPlayer = () => {
    setPlayerKey((prev) => prev + 1);
  };

  return (
    <div className={`flex flex-col gap-4 ${isTheaterMode ? "max-w-none" : "w-full"}`}>
      {/* Main Video Screen Container */}
      <div className="relative w-full aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-[#070b12] border border-[#1e2c40] shadow-2xl">
        {isLoadingServer && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0f18]/90 backdrop-blur-sm text-[#f1f5f9] gap-3">
            <Loader2 className="w-8 h-8 text-[#38bdf8] animate-spin" />
            <p className="text-sm font-medium">Menghubungkan ke server streaming...</p>
          </div>
        )}

        {currentStreamUrl ? (
          <iframe
            key={playerKey}
            src={currentStreamUrl}
            title={streamData.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-[#94a3b8]">
            <AlertCircle className="w-10 h-10 text-[#f59e0b] mb-2" />
            <p className="text-sm font-medium text-[#f1f5f9]">Pemutar video belum tersedia.</p>
            <p className="text-xs text-[#64748b] mt-1 max-w-sm">
              Silakan pilih salah satu server alternatif di bawah untuk memutar video.
            </p>
          </div>
        )}
      </div>

      {/* Player Utility Bar (Prev, Next, Reload, Theater) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#131b2a] border border-[#1e2c40]">
        <div className="flex items-center gap-2">
          {/* Previous Episode Button */}
          {streamData.hasPrevEpisode && streamData.prevEpisode ? (
            <Link
              href={`/watch/${cleanSlug(streamData.prevEpisode.episodeId || streamData.prevEpisode.href || "")}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e293b] hover:bg-[#6366f1] text-xs font-medium text-[#cbd5e1] hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Episode Sebelumnya</span>
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e293b]/40 text-xs font-medium text-[#64748b] cursor-not-allowed border border-[#1e2c40]/40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Episode Pertama</span>
            </button>
          )}

          {/* Next Episode Button */}
          {streamData.hasNextEpisode && streamData.nextEpisode ? (
            <Link
              href={`/watch/${cleanSlug(streamData.nextEpisode.episodeId || streamData.nextEpisode.href || "")}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-xs font-semibold text-white shadow-md shadow-[#6366f1]/30 transition-all hover:scale-105"
            >
              <span>Episode Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e293b]/40 text-xs font-medium text-[#64748b] cursor-not-allowed border border-[#1e2c40]/40"
            >
              <span>Episode Terakhir</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Reload Player Button */}
          <button
            onClick={handleReloadPlayer}
            title="Refresh Pemutar Video"
            className="p-2 rounded-xl bg-[#1e293b] hover:bg-[#1a2538] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#273549] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Theater Mode Toggle (Desktop only) */}
          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            title={isTheaterMode ? "Mode Normal" : "Mode Bioskop"}
            className="hidden md:flex p-2 rounded-xl bg-[#1e293b] hover:bg-[#1a2538] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#273549] transition-colors"
          >
            {isTheaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Server & Quality Selection Panel */}
      <ServerSelector
        qualities={streamData.server?.qualities}
        selectedServer={selectedServer}
        onSelectServer={handleSelectServer}
        isLoading={isLoadingServer}
      />

      {/* Download Options Panel */}
      <DownloadBox qualities={streamData.downloadUrl?.qualities} />
    </div>
  );
}
