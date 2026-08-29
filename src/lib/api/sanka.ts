import {
  HomeAnimeData,
  AnimeDetail,
  EpisodeStreamData,
  ScheduleItem,
  SearchAnimeItem,
  GenreItem,
  OngoingAnimeItem,
  CompletedAnimeItem,
  Pagination,
} from "@/types/anime";

// Clean and normalize BASE_URL to prevent duplicate /anime or trailing slashes
const RAW_URL = process.env.SANKAVOLLEREI_API_BASE_URL || "https://www.sankavollerei.web.id";
const BASE_URL = RAW_URL.trim().replace(/\/+$/, "").replace(/\/anime$/, "");

interface ApiResponse<T> {
  status: string;
  statusCode?: number;
  message?: string;
  data: T;
  pagination?: Pagination | null;
}

// Fallback genres when API is temporarily unavailable or blocked by upstream rate limiter
export const DEFAULT_GENRES: GenreItem[] = [
  { title: "Action", genreId: "action" },
  { title: "Adventure", genreId: "adventure" },
  { title: "Comedy", genreId: "comedy" },
  { title: "Demons", genreId: "demons" },
  { title: "Drama", genreId: "drama" },
  { title: "Ecchi", genreId: "ecchi" },
  { title: "Fantasy", genreId: "fantasy" },
  { title: "Game", genreId: "game" },
  { title: "Harem", genreId: "harem" },
  { title: "Historical", genreId: "historical" },
  { title: "Horror", genreId: "horror" },
  { title: "Isekai", genreId: "isekai" },
  { title: "Josei", genreId: "josei" },
  { title: "Magic", genreId: "magic" },
  { title: "Martial Arts", genreId: "martial-arts" },
  { title: "Mecha", genreId: "mecha" },
  { title: "Military", genreId: "military" },
  { title: "Music", genreId: "music" },
  { title: "Mystery", genreId: "mystery" },
  { title: "Parody", genreId: "parody" },
  { title: "Psychological", genreId: "psychological" },
  { title: "Romance", genreId: "romance" },
  { title: "Samurai", genreId: "samurai" },
  { title: "School", genreId: "school" },
  { title: "Sci-Fi", genreId: "sci-fi" },
  { title: "Seinen", genreId: "seinen" },
  { title: "Shoujo", genreId: "shoujo" },
  { title: "Shounen", genreId: "shounen" },
  { title: "Slice of Life", genreId: "slice-of-life" },
  { title: "Space", genreId: "space" },
  { title: "Sports", genreId: "sports" },
  { title: "Super Power", genreId: "super-power" },
  { title: "Supernatural", genreId: "supernatural" },
  { title: "Thriller", genreId: "thriller" },
  { title: "Vampire", genreId: "vampire" },
];

// In-memory cache for speed and rate-limit mitigation
const memoryCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

async function fetchFromApi<T>(endpoint: string, revalidateSec: number = 60): Promise<ApiResponse<T> | null> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  const cached = memoryCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
      next: { revalidate: revalidateSec },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`API request warning: ${url} returned status ${res.status} (${res.statusText})`);
      if (cached) return cached.data;
      return null;
    }

    const json = (await res.json()) as ApiResponse<T>;
    memoryCache.set(url, { timestamp: Date.now(), data: json });
    return json;
  } catch (error) {
    console.warn(`Network/API error fetching ${url}:`, error);
    if (cached) return cached.data;
    return null;
  }
}

export const sankaApi = {
  // 1. Home
  async getHome(): Promise<HomeAnimeData> {
    const fallback: HomeAnimeData = {
      ongoing: { href: "/ongoing", animeList: [] },
      completed: { href: "/completed", animeList: [] },
    };
    try {
      const res = await fetchFromApi<HomeAnimeData>("/anime/home", 120);
      return res?.data || fallback;
    } catch {
      return fallback;
    }
  },

  // 2. Ongoing Anime with pagination
  async getOngoingAnime(page: number = 1): Promise<{ animeList: OngoingAnimeItem[]; pagination: Pagination | null }> {
    try {
      const res = await fetchFromApi<{ animeList: OngoingAnimeItem[] }>(`/anime/ongoing-anime?page=${page}`, 60);
      return {
        animeList: res?.data?.animeList || [],
        pagination: res?.pagination || null,
      };
    } catch {
      return { animeList: [], pagination: null };
    }
  },

  // 3. Completed Anime with pagination
  async getCompletedAnime(page: number = 1): Promise<{ animeList: CompletedAnimeItem[]; pagination: Pagination | null }> {
    try {
      const res = await fetchFromApi<{ animeList: CompletedAnimeItem[] }>(`/anime/complete-anime?page=${page}`, 300);
      return {
        animeList: res?.data?.animeList || [],
        pagination: res?.pagination || null,
      };
    } catch {
      return { animeList: [], pagination: null };
    }
  },

  // 4. Schedule
  async getSchedule(): Promise<ScheduleItem[]> {
    try {
      const res = await fetchFromApi<ScheduleItem[]>("/anime/schedule", 300);
      return Array.isArray(res?.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  // 5. All Genres (with reliable fallback)
  async getGenres(): Promise<GenreItem[]> {
    try {
      const res = await fetchFromApi<{ genreList: GenreItem[] }>("/anime/genre", 3600);
      if (res?.data?.genreList && Array.isArray(res.data.genreList) && res.data.genreList.length > 0) {
        return res.data.genreList;
      }
      return DEFAULT_GENRES;
    } catch {
      return DEFAULT_GENRES;
    }
  },

  // 6. Anime by Genre with pagination
  async getAnimeByGenre(genreId: string, page: number = 1): Promise<{ animeList: any[]; pagination: Pagination | null }> {
    try {
      const res = await fetchFromApi<{ animeList: any[] }>(`/anime/genre/${encodeURIComponent(genreId)}?page=${page}`, 120);
      return {
        animeList: res?.data?.animeList || [],
        pagination: res?.pagination || null,
      };
    } catch {
      return { animeList: [], pagination: null };
    }
  },

  // 7. Search Anime
  async searchAnime(query: string): Promise<SearchAnimeItem[]> {
    if (!query || query.trim().length === 0) return [];
    try {
      const res = await fetchFromApi<{ animeList: SearchAnimeItem[] }>(`/anime/search/${encodeURIComponent(query.trim())}`, 30);
      return res?.data?.animeList || [];
    } catch {
      return [];
    }
  },

  // 8. Anime Detail
  async getAnimeDetail(animeId: string): Promise<AnimeDetail | null> {
    try {
      const cleanId = animeId.replace(/^\/anime\/anime\//, "").replace(/^\//, "");
      const res = await fetchFromApi<AnimeDetail>(`/anime/anime/${encodeURIComponent(cleanId)}`, 180);
      return res?.data || null;
    } catch {
      return null;
    }
  },

  // 9. Episode Streaming Detail
  async getEpisodeStream(episodeId: string): Promise<EpisodeStreamData | null> {
    try {
      const cleanId = episodeId.replace(/^\/anime\/episode\//, "").replace(/^\//, "");
      const res = await fetchFromApi<EpisodeStreamData>(`/anime/episode/${encodeURIComponent(cleanId)}`, 60);
      return res?.data || null;
    } catch {
      return null;
    }
  },

  // 10. Server Stream Resolver
  async getServerStream(serverId: string): Promise<{ url: string } | null> {
    try {
      const cleanId = serverId.replace(/^\/anime\/server\//, "").replace(/^\//, "");
      const res = await fetchFromApi<{ url: string }>(`/anime/server/${encodeURIComponent(cleanId)}`, 300);
      return res?.data || null;
    } catch {
      return null;
    }
  },
};
