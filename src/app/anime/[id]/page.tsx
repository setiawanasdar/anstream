import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Play,
  Clock,
  Film,
  Tv,
  Sparkles,
  ChevronRight,
  ListOrdered,
} from "lucide-react";
import { sankaApi } from "@/lib/api/sanka";
import { BookmarkButton } from "@/components/anime/BookmarkButton";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { getCleanSynopsis, cleanSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const anime = await sankaApi.getAnimeDetail(id);
  if (!anime) return { title: "Anime Detail" };

  return {
    title: `Nonton ${anime.title} Subtitle Indonesia`,
    description: `Streaming dan download anime ${anime.title} subtitle indonesia gratis kualitas HD.`,
  };
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const anime = await sankaApi.getAnimeDetail(id);

  if (!anime) {
    notFound();
  }

  const synopsisText = getCleanSynopsis(anime.synopsis);
  const latestEpisode = anime.episodeList && anime.episodeList.length > 0
    ? anime.episodeList[0]
    : null;

  return (
    <div className="space-y-8 pb-10">
      <div className="relative rounded-3xl overflow-hidden bg-[#131b2a] border border-[#1e2c40] p-5 sm:p-8 shadow-xl">
        <div className="absolute inset-0 z-0">
          <Image
            src={anime.poster || "https://placehold.co/300x400/131b2a/94a3b8?text=Poster"}
            alt={anime.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-20 filter blur-2xl scale-110"
            unoptimized={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131b2a] via-[#131b2a]/95 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="relative w-48 sm:w-56 md:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-[#273549] shrink-0 mx-auto md:mx-0">
            <Image
              src={anime.poster || "https://placehold.co/300x400/131b2a/94a3b8?text=Poster"}
              alt={anime.title}
              fill
              priority
              sizes="300px"
              className="object-cover"
              unoptimized={true}
            />
            {anime.status && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#0a0f18]/80 backdrop-blur-md text-[11px] font-semibold text-[#38bdf8] border border-[#38bdf8]/30 shadow-md">
                {anime.status}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            {anime.japanese && (
              <span className="text-xs font-medium text-[#94a3b8] mb-1">
                {anime.japanese}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#f1f5f9] leading-tight mb-3">
              {anime.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-5">
              {anime.score && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/30 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>Skor: {anime.score}</span>
                </div>
              )}
              {anime.type && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1e293b] text-[#cbd5e1] border border-[#273549] text-xs font-medium">
                  <Tv className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>{anime.type}</span>
                </div>
              )}
              {anime.episodes && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1e293b] text-[#cbd5e1] border border-[#273549] text-xs font-medium">
                  <Film className="w-3.5 h-3.5 text-[#818cf8]" />
                  <span>{anime.episodes} Episode</span>
                </div>
              )}
              {anime.duration && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1e293b] text-[#cbd5e1] border border-[#273549] text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#94a3b8]" />
                  <span>{anime.duration}</span>
                </div>
              )}
            </div>

            {anime.genreList && anime.genreList.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mb-6">
                {anime.genreList.map((g) => {
                  const genreSlug = g.genreId || cleanSlug(g.href || "");
                  return (
                    <Link
                      key={genreSlug}
                      href={`/genres/${genreSlug}`}
                      className="px-3 py-1 rounded-xl bg-[#172033] hover:bg-[#6366f1]/20 hover:text-[#38bdf8] text-xs text-[#cbd5e1] border border-[#273549] transition-colors"
                    >
                      {g.title}
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 w-full pt-2">
              {latestEpisode && (
                <Link
                  href={`/watch/${cleanSlug(latestEpisode.episodeId || latestEpisode.href || "")}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-sm shadow-lg shadow-[#6366f1]/30 transition-all hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Tonton Episode Terbaru</span>
                </Link>
              )}

              <BookmarkButton
                anime={{
                  id: cleanSlug(id),
                  title: anime.title,
                  poster: anime.poster,
                }}
                variant="full"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 pt-6 border-t border-[#1e2c40] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs text-[#94a3b8]">
          <div>
            <span className="text-[#64748b] block mb-0.5">Studio:</span>
            <span className="font-semibold text-[#f1f5f9]">{anime.studios || "-"}</span>
          </div>
          <div>
            <span className="text-[#64748b] block mb-0.5">Produser:</span>
            <span className="font-semibold text-[#f1f5f9]">{anime.producers || "-"}</span>
          </div>
          <div>
            <span className="text-[#64748b] block mb-0.5">Tayang (Aired):</span>
            <span className="font-semibold text-[#f1f5f9]">{anime.aired || "-"}</span>
          </div>
          <div>
            <span className="text-[#64748b] block mb-0.5">Status:</span>
            <span className="font-semibold text-[#38bdf8]">{anime.status || "-"}</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-[#131b2a] border border-[#1e2c40] p-6 space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-[#f1f5f9] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#38bdf8]" />
          <span>Sinopsis Cerita</span>
        </h2>
        <div className="text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-line space-y-3 font-normal">
          {synopsisText}
        </div>
      </div>

      <div className="rounded-3xl bg-[#131b2a] border border-[#1e2c40] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#f1f5f9] flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-[#6366f1]" />
            <span>Semua Episode ({anime.episodeList?.length || 0})</span>
          </h2>
          <span className="text-xs text-[#94a3b8]">Subtitle Indonesia HD</span>
        </div>

        {anime.episodeList && anime.episodeList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {anime.episodeList.map((ep) => {
              const epId = cleanSlug(ep.episodeId || ep.href || "");
              return (
                <Link
                  key={epId}
                  href={`/watch/${epId}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#172033]/70 hover:bg-[#1e293b] border border-[#273549] hover:border-[#38bdf8]/40 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-xl bg-[#1e293b] group-hover:bg-[#6366f1] group-hover:text-white text-[#38bdf8] flex items-center justify-center text-xs font-bold shrink-0 transition-colors">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs text-[#f1f5f9] group-hover:text-[#38bdf8] line-clamp-1 transition-colors">
                        {ep.title}
                      </span>
                      {ep.date && (
                        <span className="text-[10px] text-[#64748b]">{ep.date}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#64748b] group-hover:text-[#38bdf8] group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#94a3b8]">
            Daftar episode belum tersedia atau anime ini berupa movie.
          </div>
        )}
      </div>

      {anime.recommendedAnimeList && anime.recommendedAnimeList.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-[#f1f5f9] flex items-center gap-2">
            <Film className="w-4 h-4 text-[#38bdf8]" />
            <span>Rekomendasi Anime Terkait</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {anime.recommendedAnimeList.slice(0, 6).map((rec, idx) => (
              <AnimeCard key={rec.animeId || idx} anime={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
