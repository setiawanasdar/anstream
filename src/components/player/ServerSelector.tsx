"use client";

import React from "react";
import { Server, Zap } from "lucide-react";
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

  return (
    <div className="w-full rounded-2xl bg-[#131b2a] border border-[#1e2c40] p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#f1f5f9]">
        <Server className="w-4 h-4 text-[#38bdf8]" />
        <span>Pilihan Server & Kualitas Video:</span>
      </div>

      <div className="space-y-2.5">
        {qualities.map((q, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="w-16 shrink-0 text-xs font-semibold text-[#94a3b8] px-2 py-1 rounded bg-[#0d1422] border border-[#1e2c40] text-center">
              {q.title}
            </span>
            <div className="flex flex-wrap gap-1.5 flex-1">
              {q.serverList.map((srv) => {
                const isSelected = selectedServer?.serverId === srv.serverId;
                return (
                  <button
                    key={srv.serverId}
                    onClick={() => onSelectServer(srv, q.title)}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#6366f1] text-white shadow-md shadow-[#6366f1]/30 font-semibold"
                        : "bg-[#172033] hover:bg-[#1e293b] text-[#cbd5e1] border border-[#273549]"
                    } ${isLoading ? "opacity-70 cursor-wait" : ""}`}
                  >
                    <Zap className={`w-3 h-3 ${isSelected ? "text-yellow-300" : "text-[#38bdf8]"}`} />
                    <span className="capitalize">{srv.title.trim()}</span>
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
