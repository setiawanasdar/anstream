"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Shield, Home } from "lucide-react";
import { useAuth } from "@/lib/supabase/provider";

export function AdminHeader() {
  const { user } = useAuth();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#0a0f18] border-b border-[#1e2c40] px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
        <Shield className="w-4 h-4 text-[#38bdf8]" />
        <span className="font-semibold text-[#f1f5f9]">NontonAnime Administrator System</span>
        <span>?</span>
        <span className="px-2 py-0.5 rounded bg-[#1e2c40] text-[10px] text-[#38bdf8] font-mono font-bold">
          v2.0 Desktop
        </span>
      </div>

      <div className="flex items-center gap-4">
        {time && (
          <div className="flex items-center gap-1.5 text-xs text-[#64748b] bg-[#131b2a] px-3 py-1.5 rounded-xl border border-[#1e2c40]">
            <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="font-mono">{time}</span>
          </div>
        )}

        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e293b] hover:bg-[#6366f1] text-[#cbd5e1] hover:text-white text-xs font-medium transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Kembali ke Web</span>
        </Link>
      </div>
    </header>
  );
}
