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

const BASE_URL = process.env.SANKAVOLLEREI_API_BASE_URL || "https://www.sankavollerei.web.id";

interface ApiResponse<T> {
  status: string;
  statusCode?: number;
  message?: string;
  data: T;
  pagination?: Pagination | null;
}

// In-memory cache for speed and rate-limit mitigation
const memoryCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

async function fetchFromApi<T>(endpoint: string, revalidateSec: number = 60): Promise<ApiResponse<T>> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  const cached = memoryCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
      next: { revalidate: revalidateSec },
    });

    if (!res.ok) {
      throw new Error(`API request failed with status: ${res.status} (${res.statusText})`);
    }

    const json = (await res.json()) as ApiResponse<T>;
    memoryCache.set(url, { timestamp: Date.now(), data: json });
    return json;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    // If cached stale data exists, return it
    if (cached) {
      return cached.data;
    }
    throw error;
  }
}

export const sankaApi = {
  // 1. Home
  async getHome(): Promise<HomeAnimeData> {
    const res = await fetchFromApi<HomeAnimeData>("/anime/home", 120);
    return res.data;
  },

  // 2. Ongoing Anime with pagination
  async getOngoingAnime(page: number = 1): Promise<{ animeList: OngoingAnimeItem[]; pagination: Pagination | null }> {
    const res = await fetchFromApi<{ animeList: OngoingAnimeItem[] }>(`/anime/ongoing-anime?page=${page}`, 60);
    return {
      animeList: res.data?.animeList || [],
      pagination: res.pagination || null,
    };
  },

  // 3. Completed Anime with pagination
  async getCompletedAnime(page: number = 1): Promise<{ animeList: CompletedAnimeItem[]; pagination: Pagination | null }> {
    const res = await fetchFromApi<{ animeList: CompletedAnimeItem[] }>(`/anime/complete-anime?page=${page}`, 300);
    return {
      animeList: res.data?.animeList || [],
      pagination: res.pagination || null,
    };
  },

  // 4. Schedule
  async getSchedule(): Promise<ScheduleItem[]> {
    const res = await fetchFromApi<ScheduleItem[]>("/anime/schedule", 300);
    return Array.isArray(res.data) ? res.data : [];
  },

  // 5. All Genres
  async getGenres(): Promise<GenreItem[]> {
    const res = await fetchFromApi<{ genreList: GenreItem[] }>("/anime/genre", 3600);
    return res.data?.genreList || [];
  },

  // 6. Anime by Genre with pagination
  async getAnimeByGenre(genreId: string, page: number = 1): Promise<{ animeList: any[]; pagination: Pagination | null }> {
    const res = await fetchFromApi<{ animeList: any[] }>(`/anime/genre/${encodeURIComponent(genreId)}?page=${page}`, 120);
    return {
      animeList: res.data?.animeList || [],
      pagination: res.pagination || null,
    };
  },

  // 7. Search Anime
  async searchAnime(query: string): Promise<SearchAnimeItem[]> {
    if (!query || query.trim().length === 0) return [];
    try {
      const res = await fetchFromApi<{ animeList: SearchAnimeItem[] }>(`/anime/search/${encodeURIComponent(query.trim())}`, 30);
      return res.data?.animeList || [];
    } catch (err) {
      console.warn("Search returned error or empty:", err);
      return [];
    }
  },

  // 8. Anime Detail
  async getAnimeDetail(animeId: string): Promise<AnimeDetail | null> {
    try {
      const cleanId = animeId.replace(/^\/anime\/anime\//, "").replace(/^\//, "");
      const res = await fetchFromApi<AnimeDetail>(`/anime/anime/${encodeURIComponent(cleanId)}`, 180);
      return res.data || null;
    } catch (err) {
      console.error("Error getting anime detail:", err);
      return null;
    }
  },

  // 9. Episode Streaming Detail
  async getEpisodeStream(episodeId: string): Promise<EpisodeStreamData | null> {
    try {
      const cleanId = episodeId.replace(/^\/anime\/episode\//, "").replace(/^\//, "");
      const res = await fetchFromApi<EpisodeStreamData>(`/anime/episode/${encodeURIComponent(cleanId)}`, 60);
      return res.data || null;
    } catch (err) {
      console.error("Error getting episode stream:", err);
      return null;
    }
  },

  // 10. Server Stream Resolver
  async getServerStream(serverId: string): Promise<{ url: string } | null> {
    try {
      const cleanId = serverId.replace(/^\/anime\/server\//, "").replace(/^\//, "");
      const res = await fetchFromApi<{ url: string }>(`/anime/server/${encodeURIComponent(cleanId)}`, 300);
      return res.data || null;
    } catch (err) {
      console.error("Error getting server stream:", err);
      return null;
    }
  },
};
