import React from "react";
import { Tag } from "lucide-react";
import { sankaApi } from "@/lib/api/sanka";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { Pagination } from "@/components/ui/Pagination";

interface PageProps {
  params: Promise<{ genreId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { genreId } = await params;
  const formattedGenre = genreId.charAt(0).toUpperCase() + genreId.slice(1);
  return {
    title: `Anime Genre ${formattedGenre} Subtitle Indonesia`,
    description: `Daftar anime dengan genre ${formattedGenre} terbaik subtitle Indonesia.`,
  };
}

export default async function GenreDetailPage({ params, searchParams }: PageProps) {
  const { genreId } = await params;
  const sParams = await searchParams;
  const page = parseInt(sParams.page || "1", 10);

  const { animeList, pagination } = await sankaApi.getAnimeByGenre(genreId, page);
  const formattedGenre = genreId.charAt(0).toUpperCase() + genreId.slice(1);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3 pb-4 border-b border-[#1e2c40]">
        <div className="p-2.5 rounded-2xl bg-[#6366f1]/20 text-[#38bdf8] border border-[#6366f1]/30">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#f1f5f9]">Genre: {formattedGenre}</h1>
          <p className="text-xs sm:text-sm text-[#94a3b8]">
            Halaman {page} ? Menampilkan koleksi anime dengan genre {formattedGenre}
          </p>
        </div>
      </div>

      {animeList && animeList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {animeList.map((anime, idx) => (
            <AnimeCard key={anime.animeId || idx} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-sm text-[#94a3b8]">
          Tidak ada anime yang ditemukan untuk genre ini.
        </div>
      )}

      {pagination && <Pagination pagination={pagination} baseUrl={`/genres/${genreId}`} />}
    </div>
  );
}
