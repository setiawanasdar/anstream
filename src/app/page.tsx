import React from "react";
import Link from "next/link";
import { Flame, CheckCircle2, Calendar, ArrowRight } from "lucide-react";
import { sankaApi } from "@/lib/api/sanka";
import { HeroBanner } from "@/components/home/HeroBanner";
import { AnimeCard } from "@/components/anime/AnimeCard";
import type { ScheduleItem, HomeAnimeData } from "@/types/anime";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let homeData: HomeAnimeData | null = null;
  let scheduleData: ScheduleItem[] = [];

  try {
    const [homeRes, scheduleRes] = await Promise.all([
      sankaApi.getHome(),
      sankaApi.getSchedule().catch(() => [] as ScheduleItem[]),
    ]);
    homeData = homeRes;
    scheduleData = scheduleRes;
  } catch (err) {
    console.error("Error loading home data:", err);
  }

  const ongoingList = homeData?.ongoing?.animeList || [];
  const completedList = homeData?.completed?.animeList || [];

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* 1. Hero Banner */}
      {ongoingList.length > 0 && <HeroBanner animeList={ongoingList} />}

      {/* 2. Ongoing Anime Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#6366f1]/15 text-[#38bdf8] border border-[#6366f1]/30">
              <Flame className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#f1f5f9]">Anime Ongoing Terkini</h2>
              <p className="text-xs text-[#94a3b8]">Episode terbaru rilis minggu ini dengan Sub Indo</p>
            </div>
          </div>

          <Link
            href="/ongoing"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#38bdf8] hover:text-[#6366f1] transition-colors group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {ongoingList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {ongoingList.slice(0, 12).map((anime, idx) => (
              <AnimeCard key={anime.animeId || idx} anime={anime} priority={idx < 4} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#131b2a] border border-[#1e2c40] text-center text-sm text-[#94a3b8]">
            Sedang memuat data anime ongoing...
          </div>
        )}
      </section>

      {/* 3. Completed Anime Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#f1f5f9]">Anime Tamat (Completed)</h2>
              <p className="text-xs text-[#94a3b8]">Tonton marathon anime tamat dengan kualitas terbaik</p>
            </div>
          </div>

          <Link
            href="/completed"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#38bdf8] hover:text-[#6366f1] transition-colors group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {completedList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {completedList.slice(0, 12).map((anime, idx) => (
              <AnimeCard key={anime.animeId || idx} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#131b2a] border border-[#1e2c40] text-center text-sm text-[#94a3b8]">
            Sedang memuat data anime tamat...
          </div>
        )}
      </section>

      {/* 4. Quick Schedule Preview */}
      {scheduleData.length > 0 && (
        <section className="p-5 md:p-6 rounded-3xl bg-[#131b2a] border border-[#1e2c40] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-bold text-[#f1f5f9]">Jadwal Rilis Mingguan</h2>
                <p className="text-xs text-[#94a3b8]">Cek jadwal tayang anime favoritmu setiap hari</p>
              </div>
            </div>

            <Link
              href="/schedule"
              className="text-xs font-semibold text-[#38bdf8] hover:underline"
            >
              Lihat Jadwal Lengkap &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {scheduleData.slice(0, 7).map((dayItem, idx) => (
              <Link
                key={idx}
                href="/schedule"
                className="p-3 rounded-2xl bg-[#172033]/70 hover:bg-[#1e293b] border border-[#273549] hover:border-[#38bdf8]/40 transition-all flex flex-col items-center text-center group"
              >
                <span className="font-bold text-sm text-[#f1f5f9] group-hover:text-[#38bdf8] transition-colors">
                  {dayItem.day}
                </span>
                <span className="text-[11px] text-[#94a3b8] mt-1">
                  {dayItem.anime_list?.length || 0} Anime
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
