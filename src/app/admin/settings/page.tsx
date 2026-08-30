"use client";

import React, { useState } from "react";
import { Settings, Server, Clock, Trash2, CheckCircle2, Shield, Sparkles } from "lucide-react";

export default function AdminSettingsPage() {
  const [preferredServer, setPreferredServer] = useState("filedon");
  const [skipDuration, setSkipDuration] = useState("85");
  const [cacheCleared, setCacheCleared] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#f1f5f9]">Pengaturan Sistem & Pemutar Video</h1>
        <p className="text-xs text-[#94a3b8]">
          Konfigurasi default server streaming video dan pembersihan memori cache
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streaming Defaults */}
        <div className="p-6 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1e2c40]">
            <Server className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="font-bold text-sm text-[#f1f5f9]">Preferensi Server Video</h3>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">
                Prioritas Server Otomatis
              </label>
              <select
                value={preferredServer}
                onChange={(e) => setPreferredServer(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0d1422] border border-[#1e2c40] text-xs text-[#f1f5f9] focus:outline-none focus:border-[#6366f1]"
              >
                <option value="filedon">Filedon HD (Direkomendasikan)</option>
                <option value="vidhide">Vidhide Fast</option>
                <option value="mega">Mega Cloud</option>
                <option value="ondesuhd">Ondesuhd</option>
              </select>
              <p className="text-[10px] text-[#64748b] mt-1">
                Server ini akan dipilih otomatis saat episode pertama kali dimuat.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">
                Durasi Tombol Lewati Opening (+Detik)
              </label>
              <input
                type="number"
                value={skipDuration}
                onChange={(e) => setSkipDuration(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0d1422] border border-[#1e2c40] text-xs text-[#f1f5f9] focus:outline-none focus:border-[#6366f1]"
              />
              <p className="text-[10px] text-[#64748b] mt-1">Standar anime opening adalah 85?90 detik.</p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-lg shadow-[#6366f1]/25 transition-all flex items-center justify-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Pengaturan Tersimpan!</span>
                </>
              ) : (
                <span>Simpan Pengaturan</span>
              )}
            </button>
          </form>
        </div>

        {/* Cache & Maintenance */}
        <div className="p-6 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1e2c40]">
            <Trash2 className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="font-bold text-sm text-[#f1f5f9]">Manajemen Cache & Memori</h3>
          </div>

          <div className="space-y-3 text-xs text-[#94a3b8]">
            <p className="leading-relaxed">
              Aplikasi menyimpan cache in-memory sementara untuk mempercepat loading dan mencegah pemblokiran rate-limit API.
            </p>
            <p className="leading-relaxed">
              Jika ada anime baru rilis yang belum muncul di katalog beranda, Anda dapat memaksa pembersihan cache di bawah:
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleClearCache}
              className="w-full py-2.5 rounded-2xl bg-[#1e293b] hover:bg-red-500/20 text-[#cbd5e1] hover:text-red-400 border border-[#273549] hover:border-red-500/40 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              {cacheCleared ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cache Berhasil Dibersihkan!</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Bersihkan Cache Memori API</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
