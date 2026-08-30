"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  FastForward,
  Settings,
  PictureInPicture,
  Loader2,
  Film,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react";
import { formatTime } from "@/lib/utils";

interface UnifiedCustomPlayerProps {
  src: string;
  type?: "hls" | "mp4";
  poster?: string;
  title: string;
  onNextEpisode?: () => void;
  nextEpisodeTitle?: string;
  hasNextEpisode?: boolean;
}

export function UnifiedCustomPlayer({
  src,
  type = "mp4",
  poster,
  title,
  onNextEpisode,
  nextEpisodeTitle,
  hasNextEpisode,
}: UnifiedCustomPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [skipNotice, setSkipNotice] = useState(false);

  // Mobile Gesture Feedback States
  const [gestureFeedback, setGestureFeedback] = useState<{
    type: "forward" | "rewind" | null;
    show: boolean;
  }>({ type: null, show: false });

  // Auto-Next countdown
  const [showAutoNext, setShowAutoNext] = useState(false);
  const [autoNextSeconds, setAutoNextSeconds] = useState(5);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });

  // 1. Initialize HLS or MP4 playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setIsLoading(true);
    setCurrentTime(0);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHlsStream = src.includes(".m3u8") || type === "hls";

    if (isHlsStream && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn("HLS Fatal error:", data);
        }
      });
      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl") && isHlsStream) {
      video.src = src;
    } else {
      video.src = src;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, type]);

  // 2. Video Events
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);

    // Buffer tracking
    if (video.buffered.length > 0) {
      for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) <= video.currentTime && video.buffered.end(i) >= video.currentTime) {
          setBuffered(video.buffered.end(i));
          break;
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration || 0);
    setIsLoading(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (hasNextEpisode && onNextEpisode) {
      setShowAutoNext(true);
      setAutoNextSeconds(5);
    }
  };

  // 3. Play / Pause Toggle
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  // 4. Auto-Hide Controls Timer
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false);
      }, 3500);
    }
  }, [isPlaying]);

  // 5. Seek / Scrubber
  const handleScrub = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progress = progressRef.current;
    if (!video || !progress) return;

    const rect = progress.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    video.currentTime = pos * duration;
    setCurrentTime(video.currentTime);
  };

  // 6. Volume Control
  const handleVolumeChange = (newVol: number) => {
    const video = videoRef.current;
    if (!video) return;
    const v = Math.max(0, Math.min(1, newVol));
    video.volume = v;
    video.muted = v === 0;
    setVolume(v);
    setIsMuted(v === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      video.volume = volume || 1;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  // 7. Skip Opening (+85s)
  const handleSkipOpening = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(duration, video.currentTime + 85);
    setSkipNotice(true);
    setTimeout(() => setSkipNotice(false), 2500);
  };

  // 8. Seek ?10s
  const handleSeek = (deltaSeconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + deltaSeconds));
  };

  // 9. Playback Rate
  const handleRateChange = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  // 10. Picture-in-Picture
  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (e) {
      console.warn("PiP error:", e);
    }
  };

  // 11. Fullscreen Toggle
  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      try {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        }
        if (screen.orientation && (screen.orientation as any).lock) {
          (screen.orientation as any).lock("landscape").catch(() => {});
        }
        setIsFullscreen(true);
      } catch (err) {
        console.warn("Fullscreen error:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // 12. Touch / Double Tap Seek Handler for Mobile
  const handleScreenTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    resetControlsTimer();
    const now = Date.now();
    const touch = e.changedTouches[0];
    const containerWidth = containerRef.current?.clientWidth || 300;
    const isDoubleTap = now - lastTapRef.current.time < 300;

    if (isDoubleTap) {
      const isLeft = touch.clientX < containerWidth / 2;
      if (isLeft) {
        handleSeek(-10);
        setGestureFeedback({ type: "rewind", show: true });
      } else {
        handleSeek(10);
        setGestureFeedback({ type: "forward", show: true });
      }
      setTimeout(() => setGestureFeedback({ type: null, show: false }), 800);
    }

    lastTapRef.current = { time: now, x: touch.clientX };
  };

  // 13. Auto-Next Countdown Loop
  useEffect(() => {
    let interval: any;
    if (showAutoNext && autoNextSeconds > 0) {
      interval = setInterval(() => setAutoNextSeconds((s) => s - 1), 1000);
    } else if (showAutoNext && autoNextSeconds === 0) {
      setShowAutoNext(false);
      if (onNextEpisode) onNextEpisode();
    }
    return () => clearInterval(interval);
  }, [showAutoNext, autoNextSeconds, onNextEpisode]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={resetControlsTimer}
      onTouchStart={handleScreenTouch}
      className={`relative w-full aspect-video bg-black select-none overflow-hidden group font-sans transition-all ${
        isFullscreen ? "fixed inset-0 z-50 !w-screen !h-screen !rounded-none" : "rounded-2xl md:rounded-3xl border border-[#1e2c40]"
      }`}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onClick={togglePlay}
        playsInline
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs pointer-events-none">
          <Loader2 className="w-10 h-10 text-[#38bdf8] animate-spin mb-2" />
          <span className="text-xs font-semibold text-white/90">Memuat Video...</span>
        </div>
      )}

      {/* Gesture Ripple Animations on Mobile Double Tap */}
      {gestureFeedback.show && (
        <div
          className={`absolute inset-y-0 z-20 w-1/3 flex items-center justify-center bg-white/10 backdrop-blur-xs pointer-events-none animate-in fade-in zoom-in-75 duration-200 ${
            gestureFeedback.type === "rewind" ? "left-0 rounded-r-full" : "right-0 rounded-l-full"
          }`}
        >
          <div className="flex flex-col items-center text-white gap-1">
            {gestureFeedback.type === "rewind" ? (
              <>
                <RotateCcw className="w-8 h-8 text-[#38bdf8]" />
                <span className="text-xs font-bold">-10s</span>
              </>
            ) : (
              <>
                <RotateCw className="w-8 h-8 text-[#38bdf8]" />
                <span className="text-xs font-bold">+10s</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Skip Opening Notice Toast */}
      {skipNotice && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-[#6366f1]/95 text-white text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <FastForward className="w-4 h-4 text-amber-300" />
          <span>Melompati Opening (+85s)</span>
        </div>
      )}

      {/* Auto-Next Countdown Modal Card */}
      {showAutoNext && (
        <div className="absolute bottom-16 right-4 z-30 p-4 rounded-3xl bg-[#0a0f18]/95 border border-[#38bdf8]/50 shadow-2xl backdrop-blur-xl max-w-xs flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#38bdf8] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Episode Selanjutnya
            </span>
            <button onClick={() => setShowAutoNext(false)} className="text-white/60 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-white font-medium line-clamp-1">
            {nextEpisodeTitle || "Episode Berikutnya"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowAutoNext(false);
                if (onNextEpisode) onNextEpisode();
              }}
              className="flex-1 py-1.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold flex items-center justify-center gap-1 shadow"
            >
              <span>Nonton Sekarang ({autoNextSeconds}s)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowAutoNext(false)}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 text-white/80 hover:text-white text-xs"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Controls Overlay Wrapper */}
      <div
        className={`absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-5 bg-gradient-to-t from-black/80 via-transparent to-black/60 transition-opacity duration-300 ${
          showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top Bar: Title & Brand */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <div className="w-7 h-7 rounded-xl bg-[#6366f1] flex items-center justify-center shadow-md">
              <Film className="w-3.5 h-3.5 text-white" />
            </div>
            <h4 className="text-xs sm:text-sm font-semibold truncate text-white/95">{title}</h4>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Skip Opening Button */}
            <button
              onClick={handleSkipOpening}
              title="Lewati Opening (+85s)"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-[#6366f1] text-white text-[11px] font-bold backdrop-blur-md transition-all active:scale-95 shadow"
            >
              <FastForward className="w-3.5 h-3.5 text-amber-300" />
              <span>+85s Lewati Intro</span>
            </button>
          </div>
        </div>

        {/* Center Giant Play/Pause (Desktop Click Area) */}
        <div className="self-center flex items-center gap-6">
          <button
            onClick={() => handleSeek(-10)}
            title="Mundur 10 Detik"
            className="p-3 rounded-full bg-black/40 hover:bg-[#6366f1]/80 text-white/90 hover:text-white backdrop-blur-md transition-all active:scale-90"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            title={isPlaying ? "Jeda" : "Putar"}
            className="w-14 h-14 rounded-full bg-[#6366f1] hover:bg-[#4f46e5] text-white flex items-center justify-center shadow-2xl shadow-[#6366f1]/50 transition-all transform hover:scale-110 active:scale-95"
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
          </button>

          <button
            onClick={() => handleSeek(10)}
            title="Maju 10 Detik"
            className="p-3 rounded-full bg-black/40 hover:bg-[#6366f1]/80 text-white/90 hover:text-white backdrop-blur-md transition-all active:scale-90"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Bar: Timeline & Control Action Icons */}
        <div className="space-y-2.5">
          {/* Custom Timeline Progress Bar */}
          <div
            ref={progressRef}
            onClick={handleScrub}
            className="relative w-full h-2 hover:h-3 bg-white/20 rounded-full cursor-pointer transition-all flex items-center group/scrub"
          >
            {/* Buffer Progress */}
            <div
              style={{ width: `${bufferPercent}%` }}
              className="absolute left-0 top-0 bottom-0 bg-white/30 rounded-full"
            />
            {/* Played Progress */}
            <div
              style={{ width: `${progressPercent}%` }}
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#6366f1] to-[#38bdf8] rounded-full"
            />
            {/* Scrub Handle Thumb */}
            <div
              style={{ left: `${progressPercent}%` }}
              className="absolute w-3.5 h-3.5 rounded-full bg-white shadow-lg -translate-x-1/2 opacity-0 group-hover/scrub:opacity-100 transition-opacity"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              {/* Play/Pause icon button */}
              <button onClick={togglePlay} className="text-white hover:text-[#38bdf8] transition-colors">
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 group/vol">
                <button onClick={toggleMute} className="text-white hover:text-[#38bdf8]">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 h-1 accent-[#6366f1] bg-white/30 rounded-lg cursor-pointer hidden sm:inline"
                />
              </div>

              {/* Time display */}
              <span className="text-[11px] font-mono text-white/90">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Icons: Speed, PiP, Fullscreen */}
            <div className="flex items-center gap-2">
              {/* Speed / Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{playbackRate}x</span>
                </button>

                {showSettings && (
                  <div className="absolute bottom-8 right-0 p-2 rounded-2xl bg-[#131b2a] border border-[#1e2c40] shadow-2xl flex flex-col gap-1 min-w-[90px] z-30">
                    <span className="text-[10px] text-[#94a3b8] font-bold px-2 py-0.5">Kecepatan</span>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRateChange(r)}
                        className={`px-2 py-1 rounded-xl text-[11px] text-left transition-colors ${
                          playbackRate === r ? "bg-[#6366f1] text-white font-bold" : "text-[#cbd5e1] hover:bg-[#1e293b]"
                        }`}
                      >
                        {r === 1 ? "1.0x (Normal)" : `${r}x`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Picture-in-Picture */}
              <button
                onClick={togglePiP}
                title="Picture-in-Picture"
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors hidden sm:inline"
              >
                <PictureInPicture className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                title="Layar Penuh"
                className="p-1.5 rounded-lg text-white hover:text-[#38bdf8] hover:bg-white/10 transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
