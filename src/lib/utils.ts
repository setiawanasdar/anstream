import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanSlug(idOrSlug: string): string {
  if (!idOrSlug) return "";
  return idOrSlug
    .replace(/^\/anime\/anime\//, "")
    .replace(/^\/anime\/episode\//, "")
    .replace(/^\/anime\/server\//, "")
    .replace(/^\//, "");
}

export function getCleanSynopsis(synopsis: any): string {
  if (!synopsis) return "Sinopsis belum tersedia untuk anime ini.";
  if (typeof synopsis === "string") return synopsis;
  if (Array.isArray(synopsis.paragraphs)) {
    return synopsis.paragraphs.join("\n\n");
  }
  return "Sinopsis belum tersedia untuk anime ini.";
}

export function extractEpisodeNumber(titleOrSlug: string): number {
  if (!titleOrSlug) return 1;
  const match = titleOrSlug.match(/(?:episode|eps|ep)[^0-9]*([0-9]+)/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return 1;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  return dateString;
}

export function timeAgo(dateString?: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
