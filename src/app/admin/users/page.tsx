"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Shield, ShieldCheck, ShieldAlert, RefreshCcw, Check } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setUsers(json.data);
      }
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleRole = async (user: any) => {
    const nextRole = user.role === "admin" ? "user" : "admin";
    if (!confirm(`Ubah peran akun "${user.username || user.id}" menjadi ${nextRole.toUpperCase()}?`)) {
      return;
    }

    setUpdatingId(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: nextRole }),
      });
      const json = await res.json();
      if (json.status === "success") {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
        );
      } else {
        alert("Gagal memperbarui peran: " + (json.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.id && u.id.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">Manajemen Pengguna</h1>
          <p className="text-xs text-[#94a3b8]">
            Kelola hak akses pengguna dan atur peran Administrator sistem
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari username atau ID..."
              className="w-full pl-9 pr-3 py-2 rounded-2xl bg-[#131b2a] border border-[#1e2c40] text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          <button
            onClick={loadUsers}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-[#131b2a] hover:bg-[#1e2c40] text-[#cbd5e1] hover:text-[#38bdf8] border border-[#1e2c40] transition-colors"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin text-[#38bdf8]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-[#131b2a] border border-[#1e2c40] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#cbd5e1]">
            <thead className="bg-[#0f172a] text-[#94a3b8] uppercase text-[10px] tracking-wider border-b border-[#1e2c40]">
              <tr>
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">User ID (UUID)</th>
                <th className="px-6 py-4">Peran (Role)</th>
                <th className="px-6 py-4">Tanggal Daftar</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2c40]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#94a3b8]">
                    Memuat daftar pengguna...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#172033]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6366f1]/30 text-[#38bdf8] flex items-center justify-center font-bold text-xs border border-[#6366f1]/50">
                          {u.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="font-semibold text-[#f1f5f9]">{u.username || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-[#64748b]">{u.id}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                          u.role === "admin"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                            : "bg-[#1e293b] text-[#94a3b8] border border-[#273549]"
                        }`}
                      >
                        {u.role === "admin" ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        <span>{u.role || "user"}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#94a3b8]">
                      {new Date(u.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleRole(u)}
                        disabled={updatingId === u.id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          u.role === "admin"
                            ? "bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30"
                            : "bg-[#6366f1]/15 hover:bg-[#6366f1]/30 text-[#38bdf8] border border-[#6366f1]/30"
                        }`}
                      >
                        {updatingId === u.id
                          ? "Menyimpan..."
                          : u.role === "admin"
                          ? "Turunkan ke User"
                          : "Jadikan Admin"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#94a3b8]">
                    Tidak ditemukan pengguna yang sesuai.
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
