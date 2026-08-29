"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Search, Sparkles, Film, ArrowUp } from "lucide-react";
import { cleanSlug } from "@/lib/utils";
import type { UnlimitedGroupItem } from "@/types/anime";

export default function AZListPage() {
  const [groups, setGroups] = useState<UnlimitedGroupItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/anime/unlimited");
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setGroups(json.data);
        }
      } catch (err) {
        console.error("Error loading unlimited anime:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Total anime count calculation
  const totalAnime = useMemo(() => {
    return groups.reduce((acc, g) => acc + (g.animeList?.length || 0), 0);
  }, [groups]);

  // Filtered groups based on search & selected letter
  const filteredGroups = useMemo(() => {
    let result = groups;

    if (selectedLetter !== "ALL") {
      result = result.filter((g) => g.startWith.toUpperCase() === selectedLetter.toUpperCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result
        .map((g) => ({
          ...g,
          animeList: g.animeList.filter((a) => a.title.toLowerCase().includes(q)),
        }))
        .filter((g) => g.animeList.length > 0);
    }

    return result;
  }, [groups, selectedLetter, search]);

  const availableLetters = useMemo(() => {
    return groups.map((g) => g.startWith.toUpperCase());
  }, [groups]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e2c40]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#6366f1]/20 text-[#38bdf8] border border-[#6366f1]/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#f1f5f9]">
              Daftar Anime Lengkap A?Z
            </h1>
            <p className="text-xs sm:text-sm text-[#94a3b8]">
              Direktori lengkap seluruh {totalAnime > 0 ? `${totalAnime} judul` : ""} anime subtitle Indonesia
            </p>
          </div>
        </div>

        {/* Quick Search Bar within A-Z Directory */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari dalam direktori A-Z..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#131b2a] border border-[#1e2c40] text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6366f1]"
          />
        </div>
      </div>

      {/* Alphabet Quick Filter Buttons */}
      <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-[#131b2a] border border-[#1e2c40]">
        <button
          onClick={() => setSelectedLetter("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedLetter === "ALL"
              ? "bg-[#6366f1] text-white shadow-md"
              : "bg-[#1e293b] hover:bg-[#1a2538] text-[#cbd5e1] border border-[#273549]"
          }`}
        >
          SEMUA ({totalAnime})
        </button>

        {availableLetters.map((letter) => {
          const isSelected = selectedLetter === letter;
          return (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`w-8 h-8 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                isSelected
                  ? "bg-[#6366f1] text-white shadow-md"
                  : "bg-[#1e293b] hover:bg-[#1a2538] text-[#cbd5e1] border border-[#273549]"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Directory Content */}
      {isLoading ? (
        <div className="py-20 text-center text-sm text-[#94a3b8] space-y-2">
          <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Memuat direktori anime A-Z...</p>
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="space-y-6">
          {filteredGroups.map((group, gIdx) => (
            <div
              key={gIdx}
              id={`letter-${group.startWith}`}
              className="rounded-3xl bg-[#131b2a] border border-[#1e2c40] p-5 sm:p-6 space-y-3 shadow-lg"
            >
              {/* Group Header Letter */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1e2c40]">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#6366f1] text-white font-extrabold text-base flex items-center justify-center shadow-md">
                    {group.startWith.toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-[#94a3b8]">
                    ({group.animeList.length} Anime)
                  </span>
                </div>

                <button
                  onClick={scrollToTop}
                  title="Kembali ke atas"
                  className="p-1.5 rounded-lg text-[#64748b] hover:text-[#38bdf8] hover:bg-[#1e293b] transition-colors text-xs flex items-center gap-1"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ke Atas</span>
                </button>
              </div>

              {/* Anime Links List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pt-1">
                {group.animeList.map((anime, aIdx) => {
                  const id = anime.animeId || cleanSlug(anime.href || "");
                  return (
                    <Link
                      key={aIdx}
                      href={`/anime/${id}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#172033]/60 hover:bg-[#1e293b] border border-transparent hover:border-[#384d6b] transition-all group"
                    >
                      <Film className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 opacity-70 group-hover:opacity-100" />
                      <span className="text-xs font-medium text-[#cbd5e1] group-hover:text-[#f1f5f9] line-clamp-1">
                        {anime.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-[#131b2a] border border-[#1e2c40] p-8 text-sm text-[#94a3b8]">
          Tidak ada anime yang cocok dengan filter atau kata kunci &quot;{search}&quot;.
        </div>
      )}
    </div>
  );
}
