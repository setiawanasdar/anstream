"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  FastForward,
  Play,
  X,
  Sparkles,
  Tv,
  Layers,
} from "lucide-react";
import { UnifiedCustomPlayer } from "./UnifiedCustomPlayer";
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
  const router = useRouter();
  const { saveWatchHistory } = useAuth();
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>(
    streamData.defaultStreamingUrl || ""
  );
  const [directStreamData, setDirectStreamData] = useState<{
    directUrl: string;
    type: "hls" | "mp4";
    isDirect: boolean;
  } | null>(null);

  const [playerMode, setPlayerMode] = useState<"custom" | "embed">("custom");
  const [selectedServer, setSelectedServer] = useState<ServerItem | null>(null);
  const [isLoadingServer, setIsLoadingServer] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(true);
  const [playerKey, setPlayerKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isVidhide =
    currentStreamUrl.toLowerCase().includes("vidhide") ||
    currentStreamUrl.toLowerCase().includes("odvidhide");

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

  // Resolve Direct Stream whenever currentStreamUrl changes
  useEffect(() => {
    async function resolveDirectStream() {
      if (!currentStreamUrl) return;
      try {
        const res = await fetch("/api/anime/stream-resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: currentStreamUrl,
            downloadQualities: streamData.downloadUrl?.qualities,
          }),
        });
        const json = await res.json();
        if (json.status === "success" && json.data?.isDirect) {
          setDirectStreamData(json.data);
          setPlayerMode("custom");
        } else {
          setDirectStreamData(null);
          // If cannot extract direct stream, gracefully use embed
          setPlayerMode("embed");
        }
      } catch (err) {
        console.warn("Direct stream resolve error:", err);
        setPlayerMode("embed");
      }
    }

    resolveDirectStream();
  }, [currentStreamUrl, streamData.downloadUrl]);

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

  const handleNextEpisodeNavigation = () => {
    if (streamData.hasNextEpisode && streamData.nextEpisode) {
      const nextId = cleanSlug(streamData.nextEpisode.episodeId || streamData.nextEpisode.href || "");
      router.push(`/watch/${nextId}`);
    }
  };

  return (
    <div className={`flex flex-col gap-3.5 sm:gap-4 ${isTheaterMode ? "max-w-none" : "w-full"}`}>
      {/* Main Player Screen Area */}
      {playerMode === "custom" && directStreamData?.directUrl ? (
        /* 1. Unified Custom HTML5 Player (Format Seragam & Bebas Iklan) */
        <UnifiedCustomPlayer
          key={playerKey}
          src={directStreamData.directUrl}
          type={directStreamData.type}
          title={streamData.title}
          onNextEpisode={handleNextEpisodeNavigation}
          nextEpisodeTitle={streamData.nextEpisode?.title}
          hasNextEpisode={streamData.hasNextEpisode}
        />
      ) : (
        /* 2. Embed Iframe Mode (Clean Sandboxed Fallback) */
        <div
          ref={containerRef}
          className={`relative w-full aspect-video min-h-[210px] sm:min-h-[320px] md:min-h-[420px] bg-[#05080f] rounded-2xl md:rounded-3xl overflow-hidden border border-[#1e2c40] shadow-2xl transition-all ${
            isFullscreen ? "!w-screen !h-screen !min-h-screen !m-0 !rounded-none !border-0 z-50 fixed inset-0 flex items-center justify-center bg-black" : ""
          }`}
        >
          {isLoadingServer && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0f18]/90 backdrop-blur-sm text-[#f1f5f9] gap-3">
              <Loader2 className="w-8 h-8 text-[#38bdf8] animate-spin" />
              <p className="text-xs sm:text-sm font-medium">Menghubungkan ke server streaming...</p>
            </div>
          )}

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
                !isVidhide && isAdBlockEnabled
                  ? "allow-scripts allow-same-origin allow-presentation allow-forms"
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
      )}

      {/* Player Mode Switcher & Security Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#131b2a] border border-[#1e2c40] text-xs text-[#94a3b8]">
        {/* Toggle Mode: Custom Player vs Embed Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPlayerMode(playerMode === "custom" ? "embed" : "custom")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold border transition-all ${
              playerMode === "custom"
                ? "bg-[#6366f1]/20 text-[#38bdf8] border-[#6366f1]/40 shadow-sm"
                : "bg-[#1e293b] text-[#cbd5e1] border-[#273549]"
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Format: {playerMode === "custom" ? "Custom Player (Seragam)" : "Mode Embed Alternatif"}</span>
          </button>

          {playerMode === "embed" && (
            <button
              onClick={() => {
                setIsAdBlockEnabled(!isAdBlockEnabled);
                setPlayerKey((k) => k + 1);
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                isVidhide
                  ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                  : isAdBlockEnabled
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/30"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Anti-Popup: {isAdBlockEnabled ? "AKTIF" : "NONAKTIF"}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {streamData.hasNextEpisode && (
            <button
              onClick={handleNextEpisodeNavigation}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1e293b] hover:bg-[#6366f1] text-[#cbd5e1] hover:text-white text-[11px] font-medium border border-[#273549] transition-colors"
            >
              <Sparkles className="w-3 h-3 text-[#38bdf8]" />
              <span>Next Episode</span>
            </button>
          )}

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
