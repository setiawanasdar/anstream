"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bookmark, History, Film, User } from "lucide-react";
import { SearchModal } from "@/components/search/SearchModal";
import { useAuth } from "@/lib/supabase/provider";

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, profile, bookmarks } = useAuth();

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Ongoing", href: "/ongoing" },
    { name: "Tamat", href: "/completed" },
    { name: "Jadwal", href: "/schedule" },
    { name: "Genre", href: "/genres" },
    { name: "Daftar A-Z", href: "/az-list" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#38bdf8] flex items-center justify-center text-white shadow-md shadow-[#6366f1]/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg text-[#f1f5f9] tracking-tight">
                Nonton<span className="text-[#38bdf8]">Anime</span>
              </span>
              <span className="text-[10px] text-[#64748b] -mt-1 hidden sm:inline">Sub Indo HD</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#1e293b] text-[#38bdf8] shadow-sm"
                      : "text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#131b2a]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Quick Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131b2a] hover:bg-[#1a2538] text-xs md:text-sm text-[#94a3b8] hover:text-[#f1f5f9] border border-[#1e2c40] transition-colors"
            >
              <Search className="w-4 h-4 text-[#38bdf8]" />
              <span className="hidden sm:inline">Cari anime...</span>
              <kbd className="hidden lg:inline px-1.5 py-0.5 rounded bg-[#1e293b] text-[10px] text-[#64748b] border border-[#273549]">
                Ctrl+K
              </kbd>
            </button>

            {/* Watchlist Bookmark Icon (Desktop) */}
            <Link
              href="/bookmark"
              title="Watchlist Saya"
              className="relative p-2 rounded-xl text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#131b2a] border border-transparent hover:border-[#1e2c40] transition-colors hidden sm:flex"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#6366f1] text-[10px] font-bold text-white flex items-center justify-center">
                  {bookmarks.length > 9 ? "9+" : bookmarks.length}
                </span>
              )}
            </Link>

            {/* History Icon (Desktop) */}
            <Link
              href="/history"
              title="Riwayat Nonton"
              className="p-2 rounded-xl text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#131b2a] border border-transparent hover:border-[#1e2c40] transition-colors hidden sm:flex"
            >
              <History className="w-4 h-4" />
            </Link>

            {/* Profile / Login Button */}
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-[#131b2a] hover:bg-[#1a2538] border border-[#1e2c40] transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#6366f1]/30 text-[#38bdf8] flex items-center justify-center text-xs font-bold border border-[#6366f1]/50">
                  {profile?.username ? profile.username.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-[#f1f5f9] max-w-[80px] truncate hidden md:inline">
                  {profile?.username || user.email?.split("@")[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1e293b] hover:bg-[#6366f1] text-xs font-medium text-[#f1f5f9] hover:text-white border border-[#273549] transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
