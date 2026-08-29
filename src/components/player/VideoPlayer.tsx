"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Smartphone,
  Expand,
  Zap,
} from "lucide-react";
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Track Fullscreen Change Events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
    };
  }, []);

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

  // Android & Desktop Optimized Fullscreen with Landscape Auto-Orientation
  const handleToggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      try {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }

        // On mobile Android, attempt to lock to landscape mode for cinema experience
        if (screen.orientation && (screen.orientation as any).lock) {
          try {
            await (screen.orientation as any).lock("landscape");
          } catch {
            // Ignore if permission not granted
          }
        }
      } catch (err) {
        console.warn("Fullscreen request error:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      }
    }
  };

  return (
    <div className={`flex flex-col gap-3 sm:gap-4 ${isTheaterMode ? "max-w-none" : "w-full"}`}>
      {/* 
        Video Player Screen Wrapper
        - On mobile: edge-to-edge (-mx-4 sm:mx-0), rounded-none sm:rounded-2xl
        - Height / Aspect ratio: aspect-video with min-height guarantee for mobile touch controls
      */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-video min-h-[220px] sm:min-h-[340px] md:min-h-[420px] -mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full bg-[#05080f] sm:rounded-2xl md:rounded-3xl overflow-hidden border-y sm:border border-[#1e2c40] shadow-2xl transition-all ${
          isFullscreen ? "!w-screen !h-screen !min-h-screen !m-0 !rounded-none !border-0 z-50 fixed inset-0" : ""
        }`}
      >
        {/* Loading Overlay */}
        {isLoadingServer && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0f18]/90 backdrop-blur-sm text-[#f1f5f9] gap-3">
            <Loader2 className="w-8 h-8 text-[#38bdf8] animate-spin" />
            <p className="text-xs sm:text-sm font-medium">Menghubungkan ke server streaming...</p>
          </div>
        )}

        {/* Floating Android Fullscreen Overlay Button (Always visible on mobile & desktop) */}
        {currentStreamUrl && (
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={handleToggleFullscreen}
              title="Perbesar Layar Penuh (Rotasi Otomatis)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a0f18]/85 hover:bg-[#6366f1] text-white backdrop-blur-md text-[11px] font-semibold border border-[#384d6b]/70 shadow-lg transition-all active:scale-95"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar Layar Penuh</span>
                </>
              ) : (
                <>
                  <Expand className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Layar Penuh (Full)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Video Embed Iframe with Full Touch & Fullscreen Capabilities */}
        {currentStreamUrl ? (
          <iframe
            ref={iframeRef}
            key={playerKey}
            src={currentStreamUrl}
            title={streamData.title}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen={true}
            // @ts-ignore
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            scrolling="no"
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

      {/* Quick Mobile Assistance Bar (Khusus Layar HP / Android) */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131b2a] border border-[#1e2c40] text-xs text-[#94a3b8]">
        <div className="flex items-center gap-1.5 text-[11px]">
          <Smartphone className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>Tips Android: Tekan tombol <strong>&quot;Layar Penuh&quot;</strong> di atas untuk nonton tanpa terpotong.</span>
        </div>

        {currentStreamUrl && (
          <a
            href={currentStreamUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka pemutar langsung di tab baru"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1e293b] hover:bg-[#6366f1] text-[#cbd5e1] hover:text-white text-[11px] font-medium border border-[#273549] transition-colors shrink-0 ml-2"
          >
            <span>Tab Baru</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Player Utility Bar (Prev, Next, Reload, Theater, Fullscreen) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#131b2a] border border-[#1e2c40]">
        <div className="flex items-center gap-2">
          {/* Previous Episode Button */}
          {streamData.hasPrevEpisode && streamData.prevEpisode ? (
            <Link
              href={`/watch/${cleanSlug(streamData.prevEpisode.episodeId || streamData.prevEpisode.href || "")}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e293b] hover:bg-[#6366f1] text-xs font-medium text-[#cbd5e1] hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Episode Sebelumnya</span>
              <span className="sm:hidden">Prev Ep</span>
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1e293b]/40 text-xs font-medium text-[#64748b] cursor-not-allowed border border-[#1e2c40]/40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Episode Pertama</span>
              <span className="sm:hidden">Ep 1</span>
            </button>
          )}

          {/* Next Episode Button */}
          {streamData.hasNextEpisode && streamData.nextEpisode ? (
            <Link
              href={`/watch/${cleanSlug(streamData.nextEpisode.episodeId || streamData.nextEpisode.href || "")}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-xs font-semibold text-white shadow-md shadow-[#6366f1]/30 transition-all hover:scale-105"
            >
              <span className="hidden sm:inline">Episode Selanjutnya</span>
              <span className="sm:hidden">Next Ep</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e293b]/40 text-xs font-medium text-[#64748b] cursor-not-allowed border border-[#1e2c40]/40"
            >
              <span>Tamat / Terakhir</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            title="Layar Penuh"
            className="p-2 rounded-xl bg-[#1e293b] hover:bg-[#6366f1] text-[#94a3b8] hover:text-white border border-[#273549] transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

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
