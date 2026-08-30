"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Laptop, Lock } from "lucide-react";
import { useAuth } from "@/lib/supabase/provider";

export function DesktopGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, isLoading } = useAuth();
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDevice = () => {
      // Check user agent for Android, iPhone, iPad, mobile webviews
      const ua = navigator.userAgent || "";
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isSmallScreen = window.innerWidth < 1024; // Less than desktop breakpoint

      setIsMobileDevice(isMobileUA || isSmallScreen);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#070b12] flex items-center justify-center text-sm text-[#94a3b8]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
          <p>Memverifikasi sesi administrator...</p>
        </div>
      </div>
    );
  }

  // 1. Device Lock Screen (Mobile / Smartphone blocked)
  if (isMobileDevice) {
    return (
      <div className="min-h-screen bg-[#070b12] text-[#f1f5f9] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl bg-[#131b2a] border border-[#1e2c40] p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg">
            <Laptop className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#f1f5f9]">
              Akses Khusus PC Desktop / Laptop
            </h2>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Halaman Administrator <strong>NontonAnime</strong> hanya dapat dibuka melalui perangkat <strong>Komputer Desktop atau Laptop</strong> demi keamanan, kemudahan navigasi tabel, dan kenyamanan pengelolaan sistem.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#172033] border border-[#273549] text-[11px] text-[#cbd5e1] flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-[#38bdf8]" />
            <span>Resolusi layar minimum: 1024px</span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold shadow-lg shadow-[#6366f1]/25 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Utama</span>
          </Link>
        </div>
      </div>
    );
  }

  // 2. Role Check (Only 'admin' allowed)
  const isAdmin = profile?.role === "admin";
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#070b12] text-[#f1f5f9] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl bg-[#131b2a] border border-red-500/30 p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-red-500/15 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-red-300">
              Akses Ditolak (403 Forbidden)
            </h2>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Akun Anda <strong>({user ? user.email : "Belum Login"})</strong> tidak memiliki hak akses sebagai Administrator.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#172033] border border-[#273549] text-[11px] text-[#94a3b8]">
            Hubungi pengelola sistem jika Anda merasa memiliki hak akses admin.
          </div>

          <div className="flex gap-2">
            {!user ? (
              <Link
                href="/login"
                className="flex-1 py-2.5 rounded-xl bg-[#6366f1] text-white text-xs font-semibold text-center"
              >
                Masuk Akun Admin
              </Link>
            ) : null}
            <Link
              href="/"
              className="flex-1 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#273549] text-[#cbd5e1] text-xs font-semibold text-center"
            >
              Ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
