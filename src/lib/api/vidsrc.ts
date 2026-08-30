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
