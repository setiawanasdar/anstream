"use client";

import React, { useState } from "react";
import { Download, ChevronDown, ChevronUp, ExternalLink, HardDrive } from "lucide-react";
import type { DownloadQuality } from "@/types/anime";

interface DownloadBoxProps {
  qualities?: DownloadQuality[];
}

export function DownloadBox({ qualities }: DownloadBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!qualities || qualities.length === 0) return null;

  return (
    <div className="w-full rounded-2xl bg-[#131b2a] border border-[#1e2c40] overflow-hidden">
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1a2538] transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[#f1f5f9]">
          <Download className="w-4 h-4 text-[#38bdf8]" />
          <span>Tautan Download Video ({qualities.length} Pilihan Resolusi)</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#94a3b8]">
          <span>{isOpen ? "Sembunyikan" : "Tampilkan"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 border-t border-[#1e2c40] space-y-3 bg-[#0d1422]/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {qualities.map((q, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#172033] border border-[#273549] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-[#cbd5e1]">
                  <span className="flex items-center gap-1.5 text-[#38bdf8]">
                    <HardDrive className="w-3.5 h-3.5" />
                    {q.title}
                  </span>
                  {q.size && (
                    <span className="px-2 py-0.5 rounded bg-[#1e293b] text-[10px] text-[#94a3b8]">
                      {q.size}
                    </span>
                  )}
                </div>

                {/* Server Download Links */}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {q.urls.map((u, uIdx) => (
                    <a
                      key={uIdx}
                      href={u.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1e293b] hover:bg-[#6366f1] text-[11px] font-medium text-[#cbd5e1] hover:text-white border border-[#273549] transition-colors"
                    >
                      <span>{u.title}</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
