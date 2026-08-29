import React from "react";
import Link from "next/link";
import { Film } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#070b12] border-t border-[#1e2c40] mt-16 pb-20 md:pb-8 pt-10 text-xs text-[#94a3b8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#38bdf8] flex items-center justify-center text-white">
                <Film className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-[#f1f5f9]">
                Nonton<span className="text-[#38bdf8]">Anime</span>
              </span>
            </Link>
            <p className="text-xs text-[#64748b] leading-relaxed max-w-sm">
              Situs streaming anime subtitle Indonesia gratis dengan antarmuka modern yang nyaman di mata, responsif untuk smartphone Android dan PC Desktop.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#f1f5f9] mb-3 text-sm">Navigasi Cepat</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#38bdf8] transition-colors">Beranda</Link></li>
              <li><Link href="/ongoing" className="hover:text-[#38bdf8] transition-colors">Anime Ongoing</Link></li>
              <li><Link href="/completed" className="hover:text-[#38bdf8] transition-colors">Anime Tamat</Link></li>
              <li><Link href="/az-list" className="hover:text-[#38bdf8] transition-colors">Daftar Anime A?Z</Link></li>
              <li><Link href="/schedule" className="hover:text-[#38bdf8] transition-colors">Jadwal Rilis</Link></li>
              <li><Link href="/genres" className="hover:text-[#38bdf8] transition-colors">Daftar Genre</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#f1f5f9] mb-3 text-sm">Fitur Pengguna</h4>
            <ul className="space-y-2">
              <li><Link href="/bookmark" className="hover:text-[#38bdf8] transition-colors">Watchlist / Bookmark</Link></li>
              <li><Link href="/history" className="hover:text-[#38bdf8] transition-colors">Riwayat Tontonan</Link></li>
              <li><Link href="/profile" className="hover:text-[#38bdf8] transition-colors">Profil Akun</Link></li>
              <li><Link href="/login" className="hover:text-[#38bdf8] transition-colors">Masuk / Daftar</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1e2c40] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-[#64748b]">
          <p>? {new Date().getFullYear()} NontonAnime. Powered by Sankavollerei Anime API.</p>
          <p className="flex items-center justify-center gap-1">
            Dibuat untuk streaming anime cepat dan nyaman.
          </p>
        </div>
      </div>
    </footer>
  );
}
