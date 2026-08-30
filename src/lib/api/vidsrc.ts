import type { AnimeDetail, SearchAnimeItem, EpisodeStreamData, GenreItem } from "@/types/anime";

export interface VidSrcOptions {
  ds_lang?: string;
  autonext?: boolean;
  autoplay?: boolean;
  startAt?: number;
}

export function buildVidSrcTvUrl(
  tmdbOrImdbId: string,
  season: number = 1,
  episode: number = 1,
  options: VidSrcOptions = { ds_lang: "id,en", autonext: true }
): string {
  const baseUrl = "https://vsembed.ru/embed/tv";
  const params = new URLSearchParams();

  if (options.ds_lang) params.append("ds_lang", options.ds_lang);
  if (options.autonext) params.append("autonext", "1");
  if (options.autoplay) params.append("autoplay", "1");
  if (options.startAt && options.startAt > 0) params.append("startAt", options.startAt.toString());

  const queryString = params.toString();
  return `${baseUrl}/${encodeURIComponent(tmdbOrImdbId)}/${season}/${episode}${queryString ? `?${queryString}` : ""}`;
}

export function buildVidSrcMovieUrl(
  tmdbOrImdbId: string,
  options: VidSrcOptions = { ds_lang: "id,en" }
): string {
  const baseUrl = "https://vsembed.ru/embed/movie";
  const params = new URLSearchParams();

  if (options.ds_lang) params.append("ds_lang", options.ds_lang);
  if (options.autoplay) params.append("autoplay", "1");
  if (options.startAt && options.startAt > 0) params.append("startAt", options.startAt.toString());

  const queryString = params.toString();
  return `${baseUrl}/${encodeURIComponent(tmdbOrImdbId)}${queryString ? `?${queryString}` : ""}`;
}

// Catalog of Global Anime on VidSrc / TMDB
export interface GlobalAnimeEntry {
  tmdbId: string;
  imdbId?: string;
  title: string;
  japanese?: string;
  poster: string;
  episodes: number;
  score: string;
  status: string;
  type: string;
  genres: string[];
  synopsis: string;
  studios?: string;
  aired?: string;
}

export const GLOBAL_ANIME_CATALOG: GlobalAnimeEntry[] = [
  {
    tmdbId: "46580",
    imdbId: "tt2330612",
    title: "Hyouka",
    japanese: "??",
    poster: "https://image.tmdb.org/t/p/w500/2L2Wq8cEcwZzS2uJcW18Wd9M0eH.jpg",
    episodes: 22,
    score: "8.1",
    status: "Completed",
    type: "TV (VidSrc HD)",
    genres: ["Mystery", "Slice of Life", "School"],
    synopsis: "Houtarou Oreki adalah seorang siswa SMA yang hemat energi. Atas permintaan kakaknya, ia bergabung dengan Klub Sastra Klasik untuk mencegah pembubaran klub tersebut, di mana ia bertemu dengan Eru Chitanda yang penuh rasa penasaran.",
    studios: "Kyoto Animation",
    aired: "2012"
  },
  {
    tmdbId: "46083",
    imdbId: "tt2298711",
    title: "Danshi Koukousei no Nichijou (Daily Lives of High School Boys)",
    japanese: "????????",
    poster: "https://image.tmdb.org/t/p/w500/rJ98h07Yk5X4VzH2l2Z5jL3cK0Z.jpg",
    episodes: 12,
    score: "8.2",
    status: "Completed",
    type: "TV (VidSrc HD)",
    genres: ["Comedy", "Slice of Life", "School"],
    synopsis: "Mengikuti keseharian Tadakuni, Hidenori, dan Yoshitake di SMA Khusus Laki-laki Sanada North dengan berbagai imajinasi konyol dan kejadian lucu sehari-hari.",
    studios: "Sunrise",
    aired: "2012"
  },
  {
    tmdbId: "36729",
    title: "Seitokai Yakuindomo",
    japanese: "??????",
    poster: "https://image.tmdb.org/t/p/w500/6A7kY9oT6uXq9vC1tqE6rQk9qK9.jpg",
    episodes: 13,
    score: "7.5",
    status: "Completed",
    type: "TV (VidSrc HD)",
    genres: ["Comedy", "School", "Shounen"],
    synopsis: "Takatoshi Tsuda bergabung dengan Akademi Ousai yang baru saja beralih dari sekolah khusus putri menjadi sekolah campuran, dan langsung diangkat menjadi wakil ketua OSIS.",
    studios: "GoHands",
    aired: "2010"
  },
  {
    tmdbId: "34874",
    title: "Kaichou wa Maid-sama!",
    japanese: "???????!",
    poster: "https://image.tmdb.org/t/p/w500/y6wN5Z3XjK2m3V4fX6Z1qT6uQ9a.jpg",
    episodes: 26,
    score: "8.0",
    status: "Completed",
    type: "TV (VidSrc HD)",
    genres: ["Romance", "Comedy", "School"],
    synopsis: "Misaki Ayuzawa adalah ketua OSIS wanita pertama di SMA Seika yang sangat disiplin. Namun, ia memiliki rahasia bekerja paruh waktu di sebuah Maid Cafe yang kemudian diketahui oleh Takumi Usui.",
    studios: "J.C.Staff",
    aired: "2010"
  },
  {
    tmdbId: "37943",
    title: "Steins;Gate",
    japanese: "??????????",
    poster: "https://image.tmdb.org/t/p/w500/5mzp2a6G9x3q1vC6zT6uQ9aX2Y1.jpg",
    episodes: 24,
    score: "9.1",
    status: "Completed",
    type: "TV (VidSrc HD)",
    genres: ["Sci-Fi", "Suspense", "Thriller"],
    synopsis: "Rintarou Okabe, seorang ilmuwan gila yang memproklamirkan diri, tanpa sengaja menemukan cara mengirim pesan ke masa lalu menggunakan oven microwave.",
    studios: "White Fox",
    aired: "2011"
  },
  {
    tmdbId: "20695",
    title: "Yu-Gi-Oh! 5D's",
    japanese: "?????5D's",
    poster: "https://image.tmdb.org/t/p/w500/8uK9rT6yqE6vC1tqE6rQk9qK9b.jpg",
    episodes: 154,
    score: "7.6",
    status: "Completed",
    type: "TV (VidSrc HD)",
    genres: ["Action", "Sci-Fi", "Game"],
    synopsis: "Berlatar di New Domino City, para duelis bertarung dalam Riding Duels berkecepatan tinggi menggunakan D-Wheels.",
    studios: "Gallop",
    aired: "2008"
  },
  {
    tmdbId: "95479",
    title: "Jujutsu Kaisen",
    japanese: "????",
    poster: "https://image.tmdb.org/t/p/w500/hDD083c072ZJ12V9V9qT6uQ9aX2.jpg",
    episodes: 24,
    score: "8.6",
    status: "Completed",
    type: "TV (VidSrc HD)",
    genres: ["Action", "Fantasy", "Supernatural"],
    synopsis: "Yuuji Itadori menelan jari terkutuk Ryomen Sukuna dan memasuki dunia Jujutsu untuk menyelamatkan orang lain dari kutukan berbahaya.",
    studios: "MAPPA",
    aired: "2020"
  },
  {
    tmdbId: "209867",
    title: "Sousou no Frieren (Frieren: Beyond Journey's End)",
    japanese: "????????",
    poster: "https://image.tmdb.org/t/p/w500/dqZENchTd7lp5zht7BdlqM7RBhD.jpg",
    episodes: 28,
    score: "9.3",
    status: "Completed",
    type: "TV (VidSrc HD)",
    genres: ["Adventure", "Drama", "Fantasy"],
    synopsis: "Penyihir elf Frieren memulai perjalanan baru setelah kelompok pahlawannya berhasil mengalahkan Raja Iblis puluhan tahun lalu.",
    studios: "Madhouse",
    aired: "2023"
  },
  {
    tmdbId: "127532",
    title: "Solo Leveling (Ore dake Level Up na Ken)",
    japanese: "???????????",
    poster: "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0yqtvJuSYHGcw.jpg",
    episodes: 12,
    score: "8.5",
    status: "Completed",
    type: "TV (VidSrc HD)",
    genres: ["Action", "Adventure", "Fantasy"],
    synopsis: "Sung Jinwoo, hunter terlemah umat manusia, mendapatkan kemampuan sistem misterius yang memungkinkan dirinya naik level tanpa batas.",
    studios: "A-1 Pictures",
    aired: "2024"
  },
  {
    tmdbId: "1429",
    title: "Attack on Titan (Shingeki no Kyojin)",
    japanese: "?????",
    poster: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    episodes: 25,
    score: "9.0",
    status: "Completed",
    type: "TV (VidSrc HD)",
    genres: ["Action", "Drama", "Mystery"],
    synopsis: "Setelah umat manusia dikurung di dalam dinding raksasa dari ancaman Titan pemakan manusia, Eren Yeager bersumpah memusnahkan semua Titan.",
    studios: "WIT Studio / MAPPA",
    aired: "2013"
  },
  {
    tmdbId: "37854",
    title: "One Piece",
    japanese: "?????",
    poster: "https://image.tmdb.org/t/p/w500/cMD9Ygz11yjEzAgtUR4h0muZvmC.jpg",
    episodes: 1100,
    score: "8.9",
    status: "Ongoing",
    type: "TV (VidSrc HD)",
    genres: ["Action", "Adventure", "Comedy"],
    synopsis: "Monkey D. Luffy bersama kru Bajak Laut Topi Jerami mengarungi lautan Grand Line demi mencari harta karun legendaris One Piece.",
    studios: "Toei Animation",
    aired: "1999"
  },
  {
    tmdbId: "85937",
    title: "Demon Slayer: Kimetsu no Yaiba",
    japanese: "????",
    poster: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
    episodes: 26,
    score: "8.7",
    status: "Completed",
    type: "TV (VidSrc HD)",
    genres: ["Action", "Fantasy", "Historical"],
    synopsis: "Tanjiro Kamado bergabung dengan Korps Pembasmi Iblis untuk mengembalikan adiknya, Nezuko, yang berubah menjadi iblis kembali menjadi manusia.",
    studios: "ufotable",
    aired: "2019"
  }
];

const normalizeStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export function searchVidSrcCatalog(query: string): SearchAnimeItem[] {
  if (!query || query.trim().length === 0) return [];
  const qNorm = normalizeStr(query);

  return GLOBAL_ANIME_CATALOG.filter((item) => {
    const titleNorm = normalizeStr(item.title);
    const jpNorm = item.japanese ? normalizeStr(item.japanese) : "";
    return (
      titleNorm.includes(qNorm) ||
      qNorm.includes(titleNorm) ||
      (jpNorm && (jpNorm.includes(qNorm) || qNorm.includes(jpNorm))) ||
      item.genres.some((g) => normalizeStr(g).includes(qNorm))
    );
  }).map((item) => ({
    animeId: `vidsrc-${item.tmdbId}`,
    title: `${item.title} [1080p Ultra HD]`,
    poster: item.poster,
    score: item.score,
    status: item.status,
    href: `vidsrc-${item.tmdbId}`,
    genreList: item.genres.map((g) => ({
      title: g,
      genreId: g.toLowerCase().replace(/\s+/g, "-"),
      href: `/genres/${g.toLowerCase().replace(/\s+/g, "-")}`,
    })),
  }));
}

export function getVidSrcAnimeDetail(animeId: string): AnimeDetail | null {
  const cleanId = animeId.replace(/^vidsrc-/, "");
  const normId = normalizeStr(cleanId);

  const entry = GLOBAL_ANIME_CATALOG.find(
    (item) => item.tmdbId === cleanId || normalizeStr(item.title) === normId || normalizeStr(item.title).includes(normId)
  );

  if (!entry) {
    return {
      title: `Anime #${cleanId}`,
      poster: "https://placehold.co/300x400/131b2a/94a3b8?text=VidSrc+1080p",
      score: "8.0",
      status: "Completed",
      type: "TV (VidSrc HD)",
      episodes: 24,
      synopsis: "Anime ini tersedia untuk streaming langsung dalam kualitas 1080p Ultra HD melalui server VidSrc.",
      genreList: [
        { title: "Action", genreId: "action", href: "/genres/action" },
        { title: "Fantasy", genreId: "fantasy", href: "/genres/fantasy" }
      ],
      episodeList: Array.from({ length: 24 }, (_, i) => ({
        episodeId: `vidsrc-${cleanId}-1-${i + 1}`,
        title: `Episode ${i + 1}`,
        href: `/watch/vidsrc-${cleanId}-1-${i + 1}`,
      })),
    };
  }

  return {
    title: entry.title,
    japanese: entry.japanese,
    poster: entry.poster,
    score: entry.score,
    status: entry.status,
    type: entry.type,
    episodes: entry.episodes,
    synopsis: entry.synopsis,
    studios: entry.studios,
    aired: entry.aired,
    genreList: entry.genres.map((g) => ({
      title: g,
      genreId: g.toLowerCase().replace(/\s+/g, "-"),
      href: `/genres/${g.toLowerCase().replace(/\s+/g, "-")}`,
    })),
    episodeList: Array.from({ length: entry.episodes }, (_, i) => ({
      episodeId: `vidsrc-${entry.tmdbId}-1-${i + 1}`,
      title: `${entry.title} Episode ${i + 1}`,
      href: `/watch/vidsrc-${entry.tmdbId}-1-${i + 1}`,
    })),
  };
}

export function buildVidSrcStreamData(episodeId: string): EpisodeStreamData {
  // Pattern: vidsrc-{tmdbId}-{season}-{episode}
  const parts = episodeId.replace(/^vidsrc-/, "").split("-");
  const tmdbId = parts[0] || "95479";
  const season = parseInt(parts[1] || "1", 10);
  const episode = parseInt(parts[2] || "1", 10);

  const entry = GLOBAL_ANIME_CATALOG.find((item) => item.tmdbId === tmdbId);
  const animeTitle = entry ? entry.title : `Anime #${tmdbId}`;
  const totalEps = entry ? entry.episodes : 24;

  const streamUrl = buildVidSrcTvUrl(tmdbId, season, episode, {
    ds_lang: "id,en",
    autonext: true,
  });

  const hasNext = episode < totalEps;
  const hasPrev = episode > 1;

  return {
    animeId: `vidsrc-${tmdbId}`,
    title: `${animeTitle} Episode ${episode} (Sub Indo 1080p HD)`,
    defaultStreamingUrl: streamUrl,
    hasPrevEpisode: hasPrev,
    prevEpisode: hasPrev
      ? {
          episodeId: `vidsrc-${tmdbId}-${season}-${episode - 1}`,
          title: `Episode ${episode - 1}`,
        }
      : undefined,
    hasNextEpisode: hasNext,
    nextEpisode: hasNext
      ? {
          episodeId: `vidsrc-${tmdbId}-${season}-${episode + 1}`,
          title: `Episode ${episode + 1}`,
        }
      : undefined,
    server: {
      qualities: [
        {
          title: "1080p Ultra HD",
          serverList: [
            {
              title: "VidSrc Global (Multi-Sub)",
              serverId: "vidsrc-1080p",
              href: streamUrl,
            },
          ],
        },
      ],
    },
  };
}
