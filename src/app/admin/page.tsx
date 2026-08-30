"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Bookmark,
  History,
  Activity,
  TrendingUp,
  Shield,
  ArrowUpRight,
  Loader2,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [apiHealth, setApiHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const [statsRes, healthRes] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/admin/api-health").then((r) => r.json()),
      ]);
      setStats(statsRes.data || null);
      setApiHealth(healthRes.summary || null);
    } catch (err) {
      console.error("Error loading admin stats:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Title & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Dashboard Overview</h1>
          <p className="text-xs text-[#94a3b8]">
            Ringkasan data pengguna, watchlist, riwayat tontonan, dan status server upstream
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#131b2a] hover:bg-[#1e2c40] text-xs font-semibold text-[#cbd5e1] hover:text-[#38bdf8] border border-[#1e2c40] transition-colors"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#38bdf8]" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94a3b8]">Total Pengguna</span>
            <div className="p-2 rounded-xl bg-[#6366f1]/15 text-[#38bdf8]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#f1f5f9]">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-[#6366f1]" /> : stats?.totalUsers ?? 0}
          </div>
          <p className="text-[11px] text-[#64748b]">Pengguna terdaftar di database Supabase</p>
        </div>

        {/* Total Bookmarks */}
        <div className="p-5 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94a3b8]">Total Watchlist</span>
            <div className="p-2 rounded-xl bg-[#38bdf8]/15 text-[#38bdf8]">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#f1f5f9]">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-[#38bdf8]" /> : stats?.totalBookmarks ?? 0}
          </div>
          <p className="text-[11px] text-[#64748b]">Anime yang disimpan ke favorit/bookmark</p>
        </div>

        {/* Total Watch History */}
        <div className="p-5 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94a3b8]">Total Putar Episode</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#f1f5f9]">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-emerald-400" /> : stats?.totalHistory ?? 0}
          </div>
          <p className="text-[11px] text-[#64748b]">Sesi tontonan tersimpan di riwayat</p>
        </div>

        {/* Upstream API Health */}
        <div className="p-5 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94a3b8]">API Sankavollerei</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-lg font-bold text-emerald-400">
              {apiHealth ? (apiHealth.allHealthy ? "Online 100%" : "Sebagian Normal") : "Memeriksa..."}
            </span>
          </div>
          <p className="text-[11px] text-[#64748b]">
            Latency: {apiHealth ? `${apiHealth.avgLatency} ms` : "-"}
          </p>
        </div>
      </div>

      {/* Grid: Top Anime Bookmarked & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Bookmarked Anime */}
        <div className="p-6 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#38bdf8]" />
              <h3 className="font-bold text-sm text-[#f1f5f9]">Anime Paling Banyak Disimpan</h3>
            </div>
            <Link href="/ongoing" className="text-xs text-[#38bdf8] hover:underline flex items-center gap-1">
              <span>Katalog</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="py-10 text-center text-xs text-[#94a3b8]">Memuat data peringkat...</div>
            ) : stats?.topAnimeList && stats.topAnimeList.length > 0 ? (
              stats.topAnimeList.map((anime: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#172033]/60 border border-[#1e2c40] text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className="w-5 h-5 rounded-lg bg-[#1e293b] text-[#38bdf8] font-bold text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-[#cbd5e1] truncate">{anime.title}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-[#6366f1]/20 text-[#38bdf8] font-bold text-[11px] shrink-0">
                    {anime.count} Tersimpan
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-[#94a3b8]">Belum ada anime yang di-bookmark.</div>
            )}
          </div>
        </div>

        {/* Recent Registered Users */}
        <div className="p-6 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#38bdf8]" />
              <h3 className="font-bold text-sm text-[#f1f5f9]">Pengguna Terbaru</h3>
            </div>
            <Link href="/admin/users" className="text-xs text-[#38bdf8] hover:underline flex items-center gap-1">
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="py-10 text-center text-xs text-[#94a3b8]">Memuat data pengguna...</div>
            ) : stats?.recentUsers && stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((u: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#172033]/60 border border-[#1e2c40] text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-7 h-7 rounded-full bg-[#6366f1]/30 text-[#38bdf8] flex items-center justify-center font-bold text-[11px]">
                      {u.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-[#f1f5f9] truncate">{u.username || "Anonymous"}</span>
                      <span className="text-[10px] text-[#64748b]">
                        {new Date(u.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      u.role === "admin"
                        ? "bg-[#6366f1] text-white shadow-sm"
                        : "bg-[#1e293b] text-[#94a3b8]"
                    }`}
                  >
                    {u.role || "user"}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-[#94a3b8]">Belum ada pengguna terdaftar.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
