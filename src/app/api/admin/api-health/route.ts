import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const RAW_URL = process.env.SANKAVOLLEREI_API_BASE_URL || "https://www.sankavollerei.web.id";
const BASE_URL = RAW_URL.trim().replace(/\/+$/, "").replace(/\/anime$/, "");

const ENDPOINTS_TO_TEST = [
  { name: "Home Banner & Lists", path: "/anime/home" },
  { name: "Ongoing Anime Catalog", path: "/anime/ongoing-anime?page=1" },
  { name: "Completed Anime Catalog", path: "/anime/complete-anime?page=1" },
  { name: "Weekly Schedule", path: "/anime/schedule" },
  { name: "Genres List", path: "/anime/genre" },
  { name: "Unlimited A-Z Directory", path: "/anime/unlimited" },
  { name: "Live Search (Query: 'solo')", path: "/anime/search/solo" },
];

export async function GET() {
  const results = [];

  for (const endpoint of ENDPOINTS_TO_TEST) {
    const targetUrl = `${BASE_URL}${endpoint.path}`;
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(targetUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;
      results.push({
        name: endpoint.name,
        path: endpoint.path,
        url: targetUrl,
        status: res.status,
        ok: res.ok,
        latencyMs,
        statusText: res.statusText || (res.ok ? "OK" : "Error"),
      });
    } catch (err: any) {
      results.push({
        name: endpoint.name,
        path: endpoint.path,
        url: targetUrl,
        status: 0,
        ok: false,
        latencyMs: Date.now() - startTime,
        statusText: err.name === "AbortError" ? "Timeout (>6s)" : err.message || "Failed",
      });
    }
  }

  const allHealthy = results.every((r) => r.ok);
  const avgLatency = Math.round(results.reduce((acc, r) => acc + r.latencyMs, 0) / results.length);

  return NextResponse.json({
    status: "success",
    summary: {
      allHealthy,
      avgLatency,
      baseUrl: BASE_URL,
      testedAt: new Date().toISOString(),
    },
    endpoints: results,
  });
}
