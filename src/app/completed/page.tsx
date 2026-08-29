import React from "react";
import { CheckCircle2 } from "lucide-react";
import { sankaApi } from "@/lib/api/sanka";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { Pagination } from "@/components/ui/Pagination";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata = {
  title: "Anime Tamat (Completed) Subtitle Indonesia",
  description: "Daftar anime yang sudah tamat dan lengkap untuk ditonton secara marathon.",
};

export default async function CompletedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  const { animeList, pagination } = await sankaApi.getCompletedAnime(page);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1e2c40]">
        <div className="p-2.5 rounded-2xl bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#f1f5f9]">Anime Tamat (Completed)</h1>
          <p className="text-xs sm:text-sm text-[#94a3b8]">
            Halaman {page} ? Tonton serial anime yang sudah selesai ditayangkan
          </p>
        </div>
      </div>

      {/* Grid */}
      {animeList && animeList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {animeList.map((anime, idx) => (
            <AnimeCard key={anime.animeId || idx} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-sm text-[#94a3b8]">
          Tidak ada anime yang ditemukan pada halaman ini.
        </div>
      )}

      {/* Pagination */}
      {pagination && <Pagination pagination={pagination} baseUrl="/completed" />}
    </div>
  );
}
