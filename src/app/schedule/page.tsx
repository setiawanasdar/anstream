import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Play } from "lucide-react";
import { sankaApi } from "@/lib/api/sanka";
import { cleanSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Jadwal Rilis Anime Mingguan",
  description: "Jadwal tayang anime harian dari Senin sampai Minggu update setiap minggu.",
};

export default async function SchedulePage() {
  const scheduleData = await sankaApi.getSchedule();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1e2c40]">
        <div className="p-2.5 rounded-2xl bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#f1f5f9]">Jadwal Rilis Anime Mingguan</h1>
          <p className="text-xs sm:text-sm text-[#94a3b8]">
            Jadwal pembaruan episode anime ongoing berdasarkan hari penayangan
          </p>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-8">
        {scheduleData && scheduleData.length > 0 ? (
          scheduleData.map((dayGroup, idx) => (
            <div key={idx} className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1e293b] border border-[#273549] text-sm font-bold text-[#38bdf8]">
                <Calendar className="w-4 h-4" />
                <span>Hari {dayGroup.day}</span>
                <span className="text-xs font-normal text-[#94a3b8]">
                  ({dayGroup.anime_list?.length || 0} Judul)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {dayGroup.anime_list?.map((anime, aIdx) => {
                  const animeId = anime.slug || cleanSlug(anime.url || "");
                  return (
                    <Link
                      key={aIdx}
                      href={`/anime/${animeId}`}
                      className="group relative flex flex-col rounded-2xl bg-[#131b2a]/70 border border-[#1e2c40] hover:border-[#384d6b] transition-all overflow-hidden"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0d1422]">
                        <Image
                          src={anime.poster || "https://placehold.co/300x400/131b2a/94a3b8?text=Poster"}
                          alt={anime.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized={true}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent opacity-70" />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6366f1] text-white shadow-lg">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3">
                        <h3 className="font-semibold text-xs text-[#f1f5f9] group-hover:text-[#38bdf8] line-clamp-2 transition-colors">
                          {anime.title}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-sm text-[#94a3b8]">
            Jadwal rilis sedang disinkronkan...
          </div>
        )}
      </div>
    </div>
  );
}
