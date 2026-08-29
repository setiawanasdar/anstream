import React from "react";
import { Search } from "lucide-react";
import { sankaApi } from "@/lib/api/sanka";
import { AnimeCard } from "@/components/anime/AnimeCard";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Hasil Pencarian "${q}"` : "Pencarian Anime",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q || "";
  const results = query ? await sankaApi.searchAnime(query) : [];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3 pb-4 border-b border-[#1e2c40]">
        <div className="p-2.5 rounded-2xl bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#f1f5f9]">
            {query ? `Hasil Pencarian: "${query}"` : "Pencarian Anime"}
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8]">
            {query ? `Ditemukan ${results.length} judul anime` : "Ketik kata kunci untuk mencari anime"}
          </p>
        </div>
      </div>

      {results && results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {results.map((anime, idx) => (
            <AnimeCard key={anime.animeId || idx} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-sm text-[#94a3b8]">
          {query
            ? `Tidak ada anime yang ditemukan untuk kata kunci "${query}".`
            : "Silakan gunakan kotak pencarian di atas untuk mulai mencari."}
        </div>
      )}
    </div>
  );
}
