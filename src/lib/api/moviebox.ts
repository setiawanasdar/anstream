import type {
  AnimeDetail,
  SearchAnimeItem,
  EpisodeStreamData,
  QualityServer,
  ServerItem,
} from "@/types/anime";

const MOVIEBOX_BASE_URL = "https://nyawit-moviebox.vercel.app";

interface MovieBoxSearchItem {
  subject_id: string;
  detail_path: string;
  subject_type: number;
  title: string;
  release_date?: string;
  genre?: string[];
  country_name?: string;
  imdb_rating?: string;
  cover?: string;
}

interface MovieBoxDetailData {
  subject_id: string;
  title: string;
  description?: string;
  release_date?: string;
  genre?: string[];
  cover?: string;
  country_name?: string;
  imdb_rating?: string;
  detail_path?: string;
  subject_type?: number;
  stars?: Array<{
    name: string;
    character: string;
  }>;
  seasons?: Array<{
    season_num: number;
    max_ep: number;
    all_ep: string;
  }>;
}

interface MovieBoxPlayData {
  streams?: Array<{
    format: string;
    id: string;
    url: string;
    resolutions: string;
    size?: string;
    duration?: number;
  }>;
  subtitles?: Array<{
    id: string;
    lan: string;
    lan_name: string;
    url: string;
  }>;
}

export class MovieBoxApi {
  private baseUrl = MOVIEBOX_BASE_URL;

  private async fetchApi<T>(endpoint: string): Promise<T | null> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) return null;
      const json = await res.json();
      if (json && (json.code === 200 || json.code === 0)) {
        return json.data as T;
      }
      return null;
    } catch (err) {
      console.warn(`MovieBox API fetch failed for ${endpoint}:`, err);
      return null;
    }
  }

  async searchAnime(query: string, lang = "id"): Promise<SearchAnimeItem[]> {
    if (!query || query.trim().length === 0) return [];
    const data = await this.fetchApi<MovieBoxSearchItem[]>(
      `/search?keyword=${encodeURIComponent(query.trim())}&lang=${lang}`
    );

    if (!data || !Array.isArray(data)) return [];

    return data.map((item) => ({
      animeId: `mbx-${item.subject_id}`,
      title: `${item.title.replace(/^\[Original Audio\]\s*/i, "").replace(/^\[English.*?\]\s*/i, "")} [MovieBox HD]`,
      poster: item.cover || "https://placehold.co/300x400/131b2a/94a3b8?text=MovieBox",
      score: item.imdb_rating || "8.0",
      status: item.release_date ? `Rilis: ${item.release_date}` : "Completed HD",
      href: `/anime/mbx-${item.subject_id}`,
      genreList: (item.genre || []).map((g) => ({
        title: g,
        genreId: g.toLowerCase().replace(/\s+/g, "-"),
        href: `/genres/${g.toLowerCase().replace(/\s+/g, "-")}`,
      })),
    }));
  }

  async getAnimeDetail(animeId: string, lang = "id"): Promise<AnimeDetail | null> {
    const cleanId = animeId.replace(/^mbx-/, "");
    const data = await this.fetchApi<MovieBoxDetailData>(
      `/detail?subjectId=${encodeURIComponent(cleanId)}&lang=${lang}`
    );

    if (!data) return null;

    const cleanTitle = (data.title || "Anime")
      .replace(/^\[Original Audio\]\s*/i, "")
      .replace(/^\[English.*?\]\s*/i, "");

    // Extract episodes from seasons
    let totalEpisodes = 1;
    const episodeList = [];

    if (data.seasons && data.seasons.length > 0) {
      for (const season of data.seasons) {
        const eps = season.all_ep ? season.all_ep.split(",") : [];
        const count = eps.length > 0 ? eps.length : season.max_ep || 1;
        totalEpisodes = Math.max(totalEpisodes, count);

        for (let i = 1; i <= count; i++) {
          episodeList.push({
            episodeId: `mbx-${cleanId}-${i}`,
            title: `${cleanTitle} Episode ${i}`,
            href: `/watch/mbx-${cleanId}-${i}`,
          });
        }
      }
    } else {
      episodeList.push({
        episodeId: `mbx-${cleanId}-1`,
        title: `${cleanTitle} Movie / Full HD`,
        href: `/watch/mbx-${cleanId}-1`,
      });
    }

    const director = data.stars?.find(
      (s) => s.character && s.character.toLowerCase().includes("director")
    )?.name;

    return {
      title: cleanTitle,
      poster: data.cover || "https://placehold.co/300x400/131b2a/94a3b8?text=Poster",
      score: data.imdb_rating || "8.0",
      status: "Tersedia HD",
      type: data.subject_type === 1 ? "Movie (MovieBox)" : "TV Series (MovieBox)",
      episodes: totalEpisodes,
      aired: data.release_date || "-",
      studios: director ? `Sutradara: ${director}` : "MovieBox Studio",
      synopsis: data.description || "Sinopsis tidak tersedia untuk anime ini.",
      genreList: (data.genre || []).map((g) => ({
        title: g,
        genreId: g.toLowerCase().replace(/\s+/g, "-"),
        href: `/genres/${g.toLowerCase().replace(/\s+/g, "-")}`,
      })),
      episodeList,
    };
  }

  async getEpisodeStream(
    episodeId: string,
    lang = "id"
  ): Promise<EpisodeStreamData | null> {
    // Pattern: mbx-{subjectId}-{episodeNum}
    const parts = episodeId.replace(/^mbx-/, "").split("-");
    const subjectId = parts[0];
    const episodeNum = parseInt(parts[1] || "1", 10);

    const [playData, detailData] = await Promise.all([
      this.fetchApi<MovieBoxPlayData>(
        `/play?subjectId=${encodeURIComponent(subjectId)}&episode=${episodeNum}&lang=${lang}`
      ),
      this.fetchApi<MovieBoxDetailData>(
        `/detail?subjectId=${encodeURIComponent(subjectId)}&lang=${lang}`
      ),
    ]);

    if (!playData || !playData.streams || playData.streams.length === 0) {
      return null;
    }

    const cleanTitle = (detailData?.title || "Anime")
      .replace(/^\[Original Audio\]\s*/i, "")
      .replace(/^\[English.*?\]\s*/i, "");

    // Group streams by resolution
    const streams = playData.streams;
    const stream1080 = streams.find((s) => s.resolutions === "1080");
    const stream720 = streams.find((s) => s.resolutions === "720");
    const stream480 = streams.find((s) => s.resolutions === "480");
    const stream360 = streams.find((s) => s.resolutions === "360");

    const defaultUrl =
      stream1080?.url || stream720?.url || stream480?.url || stream360?.url || streams[0].url;

    // Calculate total episodes for next/prev
    let totalEps = 1;
    if (detailData?.seasons && detailData.seasons.length > 0) {
      totalEps = detailData.seasons[0].max_ep || 1;
    }

    const hasNext = episodeNum < totalEps;
    const hasPrev = episodeNum > 1;

    const qualities: QualityServer[] = [];

    if (stream1080) {
      qualities.push({
        title: "1080p Full HD",
        serverList: [
          {
            title: "MovieBox Direct 1080p",
            serverId: `mbx-direct-1080`,
            href: stream1080.url,
          },
        ],
      });
    }

    if (stream720) {
      qualities.push({
        title: "720p HD",
        serverList: [
          {
            title: "MovieBox Direct 720p",
            serverId: `mbx-direct-720`,
            href: stream720.url,
          },
        ],
      });
    }

    if (stream480) {
      qualities.push({
        title: "480p SD",
        serverList: [
          {
            title: "MovieBox Direct 480p",
            serverId: `mbx-direct-480`,
            href: stream480.url,
          },
        ],
      });
    }

    if (stream360) {
      qualities.push({
        title: "360p Hemat Kuota",
        serverList: [
          {
            title: "MovieBox Direct 360p",
            serverId: `mbx-direct-360`,
            href: stream360.url,
          },
        ],
      });
    }

    return {
      animeId: `mbx-${subjectId}`,
      title: `${cleanTitle} Episode ${episodeNum} (HD Sub Indo)`,
      defaultStreamingUrl: defaultUrl,
      hasPrevEpisode: hasPrev,
      prevEpisode: hasPrev
        ? {
            episodeId: `mbx-${subjectId}-${episodeNum - 1}`,
            title: `Episode ${episodeNum - 1}`,
          }
        : undefined,
      hasNextEpisode: hasNext,
      nextEpisode: hasNext
        ? {
            episodeId: `mbx-${subjectId}-${episodeNum + 1}`,
            title: `Episode ${episodeNum + 1}`,
          }
        : undefined,
      server: {
        qualities,
      },
    };
  }
}

export const movieboxApi = new MovieBoxApi();
