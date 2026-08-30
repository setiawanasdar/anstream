"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, X, ExternalLink, AlertCircle, Sparkles } from "lucide-react";

export function GlobalAnnouncement() {
  const [announcement, setAnnouncement] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    async function loadAnnouncement() {
      try {
        const res = await fetch("/api/admin/announcement");
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const active = json.data.find((a: any) => a.is_active);
          if (active) {
            const dismissedId = sessionStorage.getItem("nontonanime_dismissed_announcement");
            if (dismissedId !== active.id) {
              setAnnouncement(active);
            }
          }
        }
      } catch {
        // Ignore
      }
    }
    loadAnnouncement();
  }, []);

  const handleDismiss = () => {
    if (announcement) {
      sessionStorage.setItem("nontonanime_dismissed_announcement", announcement.id);
    }
    setIsDismissed(true);
  };

  if (!announcement || isDismissed) return null;

  const bgStyles = {
    info: "bg-[#6366f1]/20 border-[#6366f1]/40 text-[#f1f5f9]",
    warning: "bg-amber-500/20 border-amber-500/40 text-amber-100",
    success: "bg-emerald-500/20 border-emerald-500/40 text-emerald-100",
    promo: "bg-purple-500/20 border-purple-500/40 text-purple-100",
  }[announcement.type as "info" | "warning" | "success" | "promo"] || "bg-[#6366f1]/20 border-[#6366f1]/40 text-[#f1f5f9]";

  return (
    <div className={`w-full border-b py-2.5 px-4 backdrop-blur-md transition-all ${bgStyles}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1 rounded-lg bg-white/10 shrink-0">
            <Megaphone className="w-3.5 h-3.5 text-[#38bdf8]" />
          </div>
          <p className="line-clamp-1">
            <strong className="font-semibold text-white mr-1.5">{announcement.title}:</strong>
            <span>{announcement.message}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {announcement.link_url && (
            <Link
              href={announcement.link_url}
              target="_blank"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium text-[11px] transition-colors"
            >
              <span>Pelajari</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}

          <button
            onClick={handleDismiss}
            title="Tutup Pengumuman"
            className="p-1 text-white/70 hover:text-white rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
