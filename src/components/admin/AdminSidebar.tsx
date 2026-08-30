"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Activity,
  Settings,
  ExternalLink,
  Film,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/supabase/provider";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, profile } = useAuth();

  const navLinks = [
    { name: "Overview & Statistik", href: "/admin", icon: LayoutDashboard },
    { name: "Manajemen Pengguna", href: "/admin/users", icon: Users },
    { name: "Pengumuman Situs", href: "/admin/broadcast", icon: Megaphone },
    { name: "Monitor & Diagnostik API", href: "/admin/api-monitor", icon: Activity },
    { name: "Pengaturan Sistem", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0f18] border-r border-[#1e2c40] flex flex-col justify-between p-4 shrink-0 min-h-screen">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#38bdf8] flex items-center justify-center text-white shadow-md shadow-[#6366f1]/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-[#f1f5f9] tracking-tight">
              Admin<span className="text-[#38bdf8]">Panel</span>
            </span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Admin</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#6366f1] text-white shadow-md shadow-[#6366f1]/25"
                    : "text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#131b2a]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin Profile Snapshot & Back Link */}
      <div className="space-y-3 pt-4 border-t border-[#1e2c40]">
        <div className="p-3 rounded-2xl bg-[#131b2a] border border-[#1e2c40] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#6366f1]/30 text-[#38bdf8] flex items-center justify-center font-bold text-xs border border-[#6366f1]/50">
            {profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-[#f1f5f9] truncate">
              {profile?.username || user?.email?.split("@")[0]}
            </span>
            <span className="text-[10px] text-[#64748b] truncate">{user?.email}</span>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#1e293b] hover:bg-[#273549] text-xs font-medium text-[#cbd5e1] hover:text-white transition-colors"
        >
          <span>Lihat Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#38bdf8]" />
        </Link>
      </div>
    </aside>
  );
}
