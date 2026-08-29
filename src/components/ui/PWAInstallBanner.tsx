"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Film, Sparkles } from "lucide-react";

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed
    const dismissed = localStorage.getItem("nontonanime_pwa_dismissed");
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 7 * 24 * 60 * 60 * 1000) {
      return; // don't show for 7 days if dismissed
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("nontonanime_pwa_dismissed", String(Date.now()));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 md:hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 rounded-3xl bg-[#131b2a]/95 border border-[#38bdf8]/40 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#38bdf8] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#6366f1]/30">
            <Film className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs text-[#f1f5f9] line-clamp-1 flex items-center gap-1">
              <span>Pasang NontonAnime App</span>
              <Sparkles className="w-3 h-3 text-[#38bdf8]" />
            </span>
            <span className="text-[11px] text-[#94a3b8] line-clamp-1">
              Akses cepat streaming di layar utama HP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-md shadow-[#6366f1]/30 transition-all active:scale-95"
          >
            Pasang
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-[#64748b] hover:text-[#f1f5f9] rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
