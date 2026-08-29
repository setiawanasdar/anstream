"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Search, Bookmark, User, BookOpen } from "lucide-react";
import { SearchModal } from "@/components/search/SearchModal";
import { useAuth } from "@/lib/supabase/provider";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { bookmarks, user } = useAuth();

  const handleNavClick = () => {
    // Haptic vibration feedback for Android devices
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  const navItems = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Jadwal", href: "/schedule", icon: Calendar },
    { label: "Cari", isAction: true, onClick: () => { handleNavClick(); setIsSearchOpen(true); }, icon: Search },
    { label: "A?Z", href: "/az-list", icon: BookOpen },
    { label: "Watchlist", href: "/bookmark", icon: Bookmark, badge: bookmarks.length },
    { label: user ? "Akun" : "Masuk", href: user ? "/profile" : "/login", icon: User },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-bottom-nav pb-safe">
        <div className="flex items-center justify-around h-16 px-1.5 max-w-md mx-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon;

            if (item.isAction) {
              return (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[#94a3b8] hover:text-[#38bdf8] active:scale-90 transition-transform"
                >
                  <div className="relative p-1 rounded-xl">
                    <Icon className="w-5 h-5 mb-0.5 text-[#38bdf8]" />
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={handleNavClick}
                className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90 ${
                  isActive ? "text-[#38bdf8]" : "text-[#94a3b8] hover:text-[#f1f5f9]"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-[#6366f1] text-[9px] font-bold text-white flex items-center justify-center shadow">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] ${isActive ? "font-bold text-[#38bdf8]" : "font-medium"}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-5 h-0.5 rounded-full bg-[#38bdf8] shadow-sm shadow-[#38bdf8]/50" />
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
