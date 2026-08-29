"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Search, Bookmark, User } from "lucide-react";
import { SearchModal } from "@/components/search/SearchModal";
import { useAuth } from "@/lib/supabase/provider";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { bookmarks, user } = useAuth();

  const navItems = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Jadwal", href: "/schedule", icon: Calendar },
    { label: "Cari", isAction: true, onClick: () => setIsSearchOpen(true), icon: Search },
    { label: "Watchlist", href: "/bookmark", icon: Bookmark, badge: bookmarks.length },
    { label: user ? "Akun" : "Masuk", href: user ? "/profile" : "/login", icon: User },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-bottom-nav">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item, idx) => {
            const Icon = item.icon;

            if (item.isAction) {
              return (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[#94a3b8] hover:text-[#38bdf8] transition-colors"
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
                  isActive ? "text-[#38bdf8]" : "text-[#94a3b8] hover:text-[#f1f5f9]"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 mb-1 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-[#6366f1] text-[9px] font-bold text-white flex items-center justify-center">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] ${isActive ? "font-semibold text-[#38bdf8]" : "font-medium"}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[#38bdf8]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
