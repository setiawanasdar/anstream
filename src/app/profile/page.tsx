"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Bookmark, History, LogOut, Shield, Heart } from "lucide-react";
import { useAuth } from "@/lib/supabase/provider";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, bookmarks, watchHistory, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Profile Header */}
      <div className="rounded-3xl bg-[#131b2a] border border-[#1e2c40] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 shadow-xl">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#38bdf8] flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-[#6366f1]/30">
          {profile?.username ? profile.username.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "A"}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#f1f5f9]">
            {profile?.username || user?.email?.split("@")[0] || "Pengguna Tamu"}
          </h1>
          <p className="text-xs text-[#94a3b8]">
            {user?.email || "Akun lokal di browser Anda"}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 text-[11px] font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {user ? "Akun Terverifikasi" : "Mode Tamu (Lokal)"}
            </span>
          </div>
        </div>

        {user && (
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-red-500/10 text-xs font-semibold text-[#94a3b8] hover:text-red-400 border border-[#273549] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/bookmark"
          className="p-5 rounded-2xl bg-[#131b2a] hover:bg-[#1a2538] border border-[#1e2c40] hover:border-[#6366f1]/40 transition-all flex flex-col gap-2 group"
        >
          <div className="flex items-center justify-between">
            <Bookmark className="w-5 h-5 text-[#6366f1]" />
            <span className="text-xl font-bold text-[#f1f5f9]">{bookmarks.length}</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#f1f5f9] group-hover:text-[#38bdf8] transition-colors">
              Watchlist Tersimpan
            </h3>
            <p className="text-xs text-[#94a3b8]">Daftar anime favorit Anda</p>
          </div>
        </Link>

        <Link
          href="/history"
          className="p-5 rounded-2xl bg-[#131b2a] hover:bg-[#1a2538] border border-[#1e2c40] hover:border-[#38bdf8]/40 transition-all flex flex-col gap-2 group"
        >
          <div className="flex items-center justify-between">
            <History className="w-5 h-5 text-[#38bdf8]" />
            <span className="text-xl font-bold text-[#f1f5f9]">{watchHistory.length}</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#f1f5f9] group-hover:text-[#38bdf8] transition-colors">
              Riwayat Tontonan
            </h3>
            <p className="text-xs text-[#94a3b8]">Episode yang sedang ditonton</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
