"use client";

import React, { useState, useEffect } from "react";
import { Activity, RefreshCcw, CheckCircle2, XCircle, Clock, Server, Zap } from "lucide-react";

export default function AdminApiMonitorPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function checkHealth() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/api-health");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error checking health:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Monitor & Diagnostik API Upstream</h1>
          <p className="text-xs text-[#94a3b8]">
            Uji status konektivitas dan waktu respon (latency) ke server API Sankavollerei
          </p>
        </div>

        <button
          onClick={checkHealth}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-lg shadow-[#6366f1]/25 transition-all"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Jalankan Tes Diagnostik</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-2">
          <span className="text-xs font-semibold text-[#94a3b8]">Status Keseluruhan</span>
          <div className="text-xl font-bold flex items-center gap-2">
            {data?.summary?.allHealthy ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" />
                Semua Endpoint Normal
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1.5">
                <Activity className="w-5 h-5" />
                {loading ? "Menguji..." : "Terdapat Gangguan"}
              </span>
            )}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-2">
          <span className="text-xs font-semibold text-[#94a3b8]">Rata-rata Latency</span>
          <div className="text-xl font-bold text-[#38bdf8] flex items-center gap-1.5 font-mono">
            <Zap className="w-5 h-5" />
            <span>{data?.summary?.avgLatency ? `${data.summary.avgLatency} ms` : "-"}</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-2">
          <span className="text-xs font-semibold text-[#94a3b8]">Upstream Server Base URL</span>
          <div className="text-sm font-semibold text-[#cbd5e1] truncate font-mono">
            {data?.summary?.baseUrl || "https://www.sankavollerei.web.id"}
          </div>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="rounded-3xl bg-[#131b2a] border border-[#1e2c40] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#cbd5e1]">
            <thead className="bg-[#0f172a] text-[#94a3b8] uppercase text-[10px] tracking-wider border-b border-[#1e2c40]">
              <tr>
                <th className="px-6 py-4">Endpoint Name</th>
                <th className="px-6 py-4">Path Request</th>
                <th className="px-6 py-4">HTTP Status</th>
                <th className="px-6 py-4">Response Time</th>
                <th className="px-6 py-4 text-right">Kondisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2c40]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#94a3b8]">
                    Menjalankan pengujian endpoint API...
                  </td>
                </tr>
              ) : data?.endpoints && data.endpoints.length > 0 ? (
                data.endpoints.map((ep: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#172033]/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#f1f5f9]">{ep.name}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-[#64748b]">{ep.path}</td>
                    <td className="px-6 py-4 font-mono font-bold">
                      <span className={ep.ok ? "text-emerald-400" : "text-red-400"}>
                        {ep.status || "ERR"} {ep.statusText}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#38bdf8]">
                      {ep.latencyMs} ms
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                          ep.ok
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-red-500/20 text-red-300 border border-red-500/40"
                        }`}
                      >
                        {ep.ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{ep.ok ? "Online" : "Gagal"}</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#94a3b8]">
                    Gagal memuat hasil pengujian API.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
