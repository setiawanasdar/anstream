"use client";

import React from "react";
import { Server, Zap, ExternalLink, CheckCircle2 } from "lucide-react";
import type { QualityServer, ServerItem } from "@/types/anime";

interface ServerSelectorProps {
  qualities?: QualityServer[];
  selectedServer: ServerItem | null;
  onSelectServer: (server: ServerItem, quality: string) => void;
  isLoading: boolean;
}

export function ServerSelector({
  qualities,
  selectedServer,
  onSelectServer,
  isLoading,
}: ServerSelectorProps) {
  if (!qualities || qualities.length === 0) return null;

  const getServerBadge = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("filedon")) return { label: "HD Bebas Iklan", color: "text-emerald-400" };
    if (t.includes("vidhide")) return { label: "Cepat", color: "text-sky-400" };
    if (t.includes("mega")) return { label: "Cloud HD", color: "text-purple-400" };
    if (t.includes("ondesuhd")) return { label: "HD", color: "text-indigo-400" };
    if (t.includes("otakuplay") || t.includes("odstream")) return { label: "Tab Baru", color: "text-amber-400" };
    return null;
  };

  return (
    <div className="w-full rounded-2xl bg-[#131b2a] border border-[#1e2c40] p-4 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#f1f5f9]">
          <Server className="w-4 h-4 text-[#38bdf8]" />
          <span>Pilihan Server & Kualitas Video:</span>
        </div>
        <span className="text-[11px] text-[#94a3b8] hidden sm:inline">
          Disarankan: <strong className="text-emerald-400 font-medium">Filedon</strong> / <strong className="text-sky-400 font-medium">Vidhide</strong>
        </span>
      </div>

      <div className="space-y-2.5">
        {qualities.map((q, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="w-16 shrink-0 text-xs font-bold text-[#f1f5f9] px-2 py-1 rounded-xl bg-[#0d1422] border border-[#1e2c40] text-center shadow-inner">
              {q.title}
            </span>
            <div className="flex flex-wrap gap-1.5 flex-1">
              {q.serverList.map((srv) => {
                const isSelected = selectedServer?.serverId === srv.serverId;
                const badge = getServerBadge(srv.title);
                return (
                  <button
                    key={srv.serverId}
                    onClick={() => onSelectServer(srv, q.title)}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#6366f1] text-white shadow-md shadow-[#6366f1]/30 font-bold scale-[1.02]"
                        : "bg-[#172033] hover:bg-[#1e293b] text-[#cbd5e1] border border-[#273549]"
                    } ${isLoading ? "opacity-70 cursor-wait" : ""}`}
                  >
                    <Zap className={`w-3 h-3 ${isSelected ? "text-yellow-300" : "text-[#38bdf8]"}`} />
                    <span className="capitalize">{srv.title.trim()}</span>
                    {badge && !isSelected && (
                      <span className={`text-[9px] font-semibold opacity-90 ${badge.color}`}>
                        ? {badge.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
