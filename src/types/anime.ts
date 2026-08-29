export interface Pagination {
  currentPage: number;
  hasPrevPage: boolean;
  prevPage: number | null;
  hasNextPage: boolean;
  nextPage: number | null;
  totalPages: number;
}

export interface OngoingAnimeItem {
  title: string;
  poster: string;
  episodes: number | string | null;
  releaseDay?: string;
  latestReleaseDate?: string;
  animeId: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface CompletedAnimeItem {
  title: string;
  poster: string;
  episodes: number | string | null;
  score?: string;
  lastReleaseDate?: string;
  animeId: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface HomeAnimeData {
  ongoing: {
    href: string;
    otakudesuUrl?: string;
    animeList: OngoingAnimeItem[];
  };
  completed: {
    href: string;
    otakudesuUrl?: string;
    animeList: CompletedAnimeItem[];
  };
}

export interface GenreItem {
  title: string;
  genreId: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface EpisodeItem {
  title: string;
  eps?: number | string;
  date?: string;
  episodeId: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface AnimeDetail {
  title: string;
  poster: string;
  japanese?: string;
  score?: string;
  producers?: string;
  type?: string;
  status?: string;
  episodes?: number | string | null;
  duration?: string;
  aired?: string;
  studios?: string;
  batch?: string | null;
  synopsis?: {
    paragraphs?: string[];
  } | string;
  genreList?: GenreItem[];
  episodeList?: EpisodeItem[];
  recommendedAnimeList?: Array<{
    title: string;
    poster: string;
    animeId: string;
    href?: string;
  }>;
}

export interface ServerItem {
  title: string;
  serverId: string;
  href?: string;
}

export interface QualityServer {
  title: string;
  serverList: ServerItem[];
}

export interface DownloadUrlItem {
  title: string;
  url: string;
}

export interface DownloadQuality {
  title: string;
  size?: string;
  urls: DownloadUrlItem[];
}

export interface EpisodeStreamData {
  title: string;
  animeId: string;
  releaseTime?: string;
  defaultStreamingUrl?: string;
  hasPrevEpisode: boolean;
  prevEpisode?: {
    title: string;
    episodeId: string;
    href?: string;
  } | null;
  hasNextEpisode: boolean;
  nextEpisode?: {
    title: string;
    episodeId: string;
    href?: string;
  } | null;
  server?: {
    qualities: QualityServer[];
  };
  downloadUrl?: {
    qualities: DownloadQuality[];
  };
  info?: {
    credit?: string;
    encoder?: string;
    duration?: string;
    type?: string;
    genre?: string;
    author?: string;
  };
}

export interface ScheduleItem {
  day: string;
  anime_list: Array<{
    title: string;
    slug: string;
    url: string;
    poster: string;
  }>;
}

export interface SearchAnimeItem {
  title: string;
  poster: string;
  status?: string;
  score?: string;
  animeId: string;
  href?: string;
  genreList?: GenreItem[];
}

export interface UnlimitedAnimeItem {
  title: string;
  animeId: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface UnlimitedGroupItem {
  startWith: string;
  animeList: UnlimitedAnimeItem[];
}
