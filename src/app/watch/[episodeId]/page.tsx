import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Calendar, Clapperboard } from "lucide-react";
import { sankaApi } from "@/lib/api/sanka";
import { movieboxApi } from "@/lib/api/moviebox";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { EpisodeDrawer } from "@/components/player/EpisodeDrawer";
import { cleanSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ episodeId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { episodeId } = await params;
  const cleanEpId = cleanSlug(episodeId);

  const streamData = cleanEpId.startsWith("mbx-")
    ? await movieboxApi.getEpisodeStream(cleanEpId)
    : await sankaApi.getEpisodeStream(cleanEpId);

  if (!streamData) return { title: "Nonton Anime Episode" };

  return {
    title: `Nonton ${streamData.title}`,
    description: `Streaming online ${streamData.title} Subtitle Indonesia gratis kualitas HD.`,
  };
}

export default async function WatchPage({ params }: PageProps) {
  const { episodeId } = await params;
  const cleanEpId = cleanSlug(episodeId);

  const isMovieBox = cleanEpId.startsWith("mbx-");

  const streamData = isMovieBox
    ? await movieboxApi.getEpisodeStream(cleanEpId)
    : await sankaApi.getEpisodeStream(cleanEpId);

  if (!streamData) {
    notFound();
  }

  let animeDetail = null;
  if (streamData.animeId) {
    animeDetail = streamData.animeId.startsWith("mbx-")
      ? await movieboxApi.getAnimeDetail(streamData.animeId)
      : await sankaApi.getAnimeDetail(cleanSlug(streamData.animeId));
  }

  const episodes = animeDetail?.episodeList || [];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <Link
          href={streamData.animeId ? `/anime/${cleanSlug(streamData.animeId)}` : "/"}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131b2a] hover:bg-[#1e2c40] text-[#cbd5e1] hover:text-[#38bdf8] border border-[#1e2c40] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Detail Anime</span>
        </Link>

        {isMovieBox ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>MovieBox Direct MP4 (HD)</span>
          </div>
        ) : streamData.releaseTime ? (
          <div className="flex items-center gap-1 text-[#94a3b8]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Diperbarui: {streamData.releaseTime}</span>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <VideoPlayer streamData={streamData} episodeId={cleanEpId} />

          <div className="rounded-2xl bg-[#131b2a] border border-[#1e2c40] p-5 space-y-2">
            <h1 className="text-lg md:text-xl font-bold text-[#f1f5f9] leading-snug">
              {streamData.title}
            </h1>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              {isMovieBox
                ? "Video ini diputar langsung via direct stream MovieBox berkualitas HD tanpa iklan eksternal."
                : "Jika video mengalami buffering atau tidak dapat diputar, gunakan pilihan server alternatif di atas atau gunakan tombol unduh untuk menonton secara offline."}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <EpisodeDrawer
            episodes={episodes}
            currentEpisodeId={cleanEpId}
            animeTitle={streamData.title}
          />
        </div>
      </div>
    </div>
  );
}
