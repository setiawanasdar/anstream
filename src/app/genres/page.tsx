import React from "react";
import Link from "next/link";
import { Sparkles, Tag } from "lucide-react";
import { sankaApi } from "@/lib/api/sanka";
import { cleanSlug } from "@/lib/utils";

export const metadata = {
  title: "Daftar Genre Anime Lengkap",
  description: "Jelajahi anime berdasarkan genre favorit seperti Action, Isekai, Romance, Fantasy, dan lainnya.",
};

export default async function GenresPage() {
  const genres = await sankaApi.getGenres();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3 pb-4 border-b border-[#1e2c40]">
        <div className="p-2.5 rounded-2xl bg-[#6366f1]/20 text-[#38bdf8] border border-[#6366f1]/30">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#f1f5f9]">Daftar Genre Anime</h1>
          <p className="text-xs sm:text-sm text-[#94a3b8]">
            Pilih genre untuk menemukan rekomendasi anime terbaik
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {genres.map((g) => {
          const slug = g.genreId || cleanSlug(g.href || "");
          return (
            <Link
              key={slug}
              href={`/genres/${slug}`}
              className="p-4 rounded-2xl bg-[#131b2a] hover:bg-[#1a2538] border border-[#1e2c40] hover:border-[#6366f1]/40 flex items-center justify-between transition-all group"
            >
              <span className="font-semibold text-sm text-[#f1f5f9] group-hover:text-[#38bdf8] transition-colors">
                {g.title}
              </span>
              <Sparkles className="w-4 h-4 text-[#64748b] group-hover:text-[#38bdf8] group-hover:scale-110 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
