"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, Plus, Trash2, CheckCircle2, XCircle, AlertCircle, Sparkles, ExternalLink } from "lucide-react";

export default function AdminBroadcastPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [isActive, setIsActive] = useState(true);
  const [linkUrl, setLinkUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadAnnouncements() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/announcement");
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setAnnouncements(json.data);
      }
    } catch (err) {
      console.error("Error loading announcements:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          type,
          is_active: isActive,
          link_url: linkUrl || null,
        }),
      });
      const json = await res.json();
      if (json.status === "success") {
        setTitle("");
        setMessage("");
        setLinkUrl("");
        loadAnnouncements();
      } else {
        alert("Gagal membuat pengumuman: " + json.message);
      }
    } catch (err) {
      console.error("Error creating announcement:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (item: any) => {
    try {
      await fetch("/api/admin/announcement", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, is_active: !item.is_active }),
      });
      loadAnnouncements();
    } catch (err) {
      console.error("Error toggling active:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pengumuman ini?")) return;
    try {
      await fetch(`/api/admin/announcement?id=${id}`, { method: "DELETE" });
      loadAnnouncements();
    } catch (err) {
      console.error("Error deleting announcement:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#f1f5f9]">Pengumuman Situs & Broadcast</h1>
        <p className="text-xs text-[#94a3b8]">
          Atur banner pengumuman global yang akan muncul di bagian atas seluruh halaman website
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1e2c40]">
            <Plus className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="font-bold text-sm text-[#f1f5f9]">Buat Pengumuman Baru</h3>
          </div>

          <form onSubmit={handleCreateAnnouncement} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">Judul Singkat</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Info Jadwal Rilis"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#0d1422] border border-[#1e2c40] text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">Pesan Pengumuman</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Episode baru Solo Leveling Season 2 sudah tayang dengan subtitle Indonesia..."
                rows={3}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#0d1422] border border-[#1e2c40] text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">Tipe Banner</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0d1422] border border-[#1e2c40] text-xs text-[#f1f5f9] focus:outline-none focus:border-[#6366f1]"
                >
                  <option value="info">Info (Biru)</option>
                  <option value="warning">Peringatan (Kuning)</option>
                  <option value="success">Sukses (Hijau)</option>
                  <option value="promo">Promo (Ungu)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">Status</label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-[#1e293b] text-[#94a3b8] border-[#273549]"
                  }`}
                >
                  {isActive ? "Langsung Aktif" : "Draft / Nonaktif"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">Link URL Tujuan (Opsional)</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#0d1422] border border-[#1e2c40] text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-lg shadow-[#6366f1]/25 transition-all mt-2"
            >
              {submitting ? "Menerbitkan..." : "Terbitkan Pengumuman"}
            </button>
          </form>
        </div>

        {/* Existing Announcements List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e2c40]">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#38bdf8]" />
              <h3 className="font-bold text-sm text-[#f1f5f9]">Daftar Pengumuman Situs</h3>
            </div>
            <span className="text-xs text-[#94a3b8]">({announcements.length})</span>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-12 text-center text-xs text-[#94a3b8]">Memuat data pengumuman...</div>
            ) : announcements.length > 0 ? (
              announcements.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#172033]/60 border border-[#1e2c40] space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#f1f5f9]">{item.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1e2c40] text-[#38bdf8]">
                        {item.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                          item.is_active
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-[#1e293b] text-[#94a3b8] border-[#273549]"
                        }`}
                      >
                        {item.is_active ? "Aktif di Web" : "Nonaktif"}
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-[#64748b] hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[#cbd5e1] leading-relaxed">{item.message}</p>

                  {item.link_url && (
                    <div className="flex items-center gap-1 text-[11px] text-[#38bdf8]">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">{item.link_url}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-[#94a3b8]">
                Belum ada pengumuman yang dibuat.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
