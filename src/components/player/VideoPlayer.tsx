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
  ShieldCheck,
  ShieldAlert,
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
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(true);
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

  // Smart Auto-Select Server on mount to bypass CSP frame-ancestors block on default stream
  useEffect(() => {
    async function autoPickServer() {
      if (!streamData.server?.qualities || streamData.server.qualities.length === 0) return;

      const isDesuStream = (streamData.defaultStreamingUrl || "").includes("desustream");
      
      if (isDesuStream || !streamData.defaultStreamingUrl) {
        const qual720 = streamData.server.qualities.find((q) => q.title.includes("720"));
        const qual480 = streamData.server.qualities.find((q) => q.title.includes("480"));
        const targetQual = qual720 || qual480 || streamData.server.qualities[0];

        if (targetQual && targetQual.serverList.length > 0) {
          const preferredServer =
            targetQual.serverList.find((s) =>
              s.title.toLowerCase().includes("filedon") ||
              s.title.toLowerCase().includes("vidhide") ||
              s.title.toLowerCase().includes("mega") ||
              s.title.toLowerCase().includes("ondesuhd")
            ) || targetQual.serverList[0];

          if (preferredServer) {
            setSelectedServer(preferredServer);
            try {
              const res = await fetch(`/api/anime/server/${cleanSlug(preferredServer.serverId)}`);
              const json = await res.json();
              if (json.data && json.data.url) {
                setCurrentStreamUrl(json.data.url);
                setPlayerKey((k) => k + 1);
              }
            } catch (err) {
              console.warn("Auto-switch server error:", err);
            }
          }
        }
      }
    }

    autoPickServer();
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
    <div className={`flex flex-col gap-3.5 sm:gap-4 ${isTheaterMode ? "max-w-none" : "w-full"}`}>
      {/* 
        Video Player Screen Wrapper
        - Centered container matching cards width
        - 16:9 Aspect Ratio
      */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-video min-h-[210px] sm:min-h-[320px] md:min-h-[420px] bg-[#05080f] rounded-2xl md:rounded-3xl overflow-hidden border border-[#1e2c40] shadow-2xl transition-all ${
          isFullscreen ? "!w-screen !h-screen !min-h-screen !m-0 !rounded-none !border-0 z-50 fixed inset-0 flex items-center justify-center bg-black" : ""
        }`}
      >
        {/* Loading Overlay */}
        {isLoadingServer && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0f18]/90 backdrop-blur-sm text-[#f1f5f9] gap-3">
            <Loader2 className="w-8 h-8 text-[#38bdf8] animate-spin" />
            <p className="text-xs sm:text-sm font-medium">Menghubungkan ke server streaming...</p>
          </div>
        )}

        {/* Floating Android Fullscreen Overlay Button */}
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

        {/* 
          Video Embed Iframe with Strict Sandbox Protection against Redirects & Popups
          - When isAdBlockEnabled is true: sandbox blocks window.open, top.location redirect, and popup ads
        */}
        {currentStreamUrl ? (
          <iframe
            ref={iframeRef}
            key={playerKey}
            src={currentStreamUrl}
            title={streamData.title}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen={true}
            sandbox={
              isAdBlockEnabled
                ? "allow-scripts allow-same-origin allow-presentation allow-fullscreen allow-forms"
                : undefined
            }
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

      {/* Quick Mobile Assistance & AdBlock Security Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#131b2a] border border-[#1e2c40] text-xs text-[#94a3b8]">
        {/* AdBlock / Anti-Redirect Status Badge & Toggle */}
        <button
          onClick={() => {
            setIsAdBlockEnabled(!isAdBlockEnabled);
            setPlayerKey((k) => k + 1);
          }}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
            isAdBlockEnabled
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25"
              : "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
          }`}
        >
          {isAdBlockEnabled ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Anti-Popup & Iklan: AKTIF</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Anti-Popup: NONAKTIF</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#64748b]">
            <Smartphone className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Mode Anti-Popup mencegah tab Anda diarahkan ke situs lain saat diklik.</span>
          </div>

          {currentStreamUrl && (
            <a
              href={currentStreamUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Buka pemutar langsung di tab baru"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1e293b] hover:bg-[#6366f1] text-[#cbd5e1] hover:text-white text-[11px] font-medium border border-[#273549] transition-colors shrink-0"
            >
              <span>Tab Baru</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e293b]/40 text-xs font-medium text-[#64748b] cursor-not-allowed border border-[#1e2c40]/40"
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
