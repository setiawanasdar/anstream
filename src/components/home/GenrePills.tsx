import React from "react";
import Link from "next/link";
import { Sparkles, Flame } from "lucide-react";

const TOP_GENRES = [
  { name: "Semua Anime", href: "/ongoing", icon: Flame, isSpecial: true },
  { name: "Action", href: "/genres/action" },
  { name: "Isekai", href: "/genres/isekai" },
  { name: "Fantasy", href: "/genres/fantasy" },
  { name: "Romance", href: "/genres/romance" },
  { name: "Comedy", href: "/genres/comedy" },
  { name: "Adventure", href: "/genres/adventure" },
  { name: "Shounen", href: "/genres/shounen" },
  { name: "Sci-Fi", href: "/genres/sci-fi" },
  { name: "Supernatural", href: "/genres/supernatural" },
  { name: "Drama", href: "/genres/drama" },
  { name: "Slice of Life", href: "/genres/slice-of-life" },
  { name: "Daftar A?Z", href: "/az-list", isSpecial: true },
];

export function GenrePills() {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-2 min-w-max">
        {TOP_GENRES.map((genre, idx) => {
          const Icon = genre.icon || Sparkles;
          return (
            <Link
              key={idx}
              href={genre.href}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all active:scale-95 ${
                genre.isSpecial
                  ? "bg-[#6366f1] text-white shadow-md shadow-[#6366f1]/25 hover:bg-[#4f46e5]"
                  : "bg-[#131b2a] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-[#38bdf8] border border-[#1e2c40] hover:border-[#384d6b]"
              }`}
            >
              <Icon className="w-3.5 h-3.5 opacity-80" />
              <span>{genre.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
