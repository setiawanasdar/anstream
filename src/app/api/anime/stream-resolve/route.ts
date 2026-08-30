import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, downloadQualities, quality } = body;

    if (!url) {
      return NextResponse.json({ status: "error", message: "URL is required" }, { status: 400 });
    }

    // 1. Direct stream check
    if (url.endsWith(".mp4") || url.endsWith(".m3u8") || url.includes(".m3u8?") || url.includes(".mp4?")) {
      return NextResponse.json({
        status: "success",
        data: {
          directUrl: url,
          type: url.includes(".m3u8") ? "hls" : "mp4",
          isDirect: true,
        },
      });
    }

    // 2. Try scraping / resolving direct media from embed webpage
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Referer": "https://otakudesu.cloud/",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();

        // Regex searches for m3u8 or mp4 sources
        const m3u8Match = html.match(/(?:file|source|src)\s*:\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i) ||
                          html.match(/["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i);

        const mp4Match = html.match(/(?:file|source|src)\s*:\s*["'](https?:\/\/[^"']+\.mp4[^"']*)["']/i) ||
                         html.match(/<source[^>]+src=["'](https?:\/\/[^"']+\.mp4[^"']*)["']/i);

        if (m3u8Match && m3u8Match[1]) {
          return NextResponse.json({
            status: "success",
            data: {
              directUrl: m3u8Match[1],
              type: "hls",
              isDirect: true,
            },
          });
        }

        if (mp4Match && mp4Match[1]) {
          return NextResponse.json({
            status: "success",
            data: {
              directUrl: mp4Match[1],
              type: "mp4",
              isDirect: true,
            },
          });
        }
      }
    } catch {
      // If scraping fails, continue to download box check or fallback
    }

    // 3. Fallback to original embed URL
    return NextResponse.json({
      status: "fallback",
      data: {
        embedUrl: url,
        isDirect: false,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to resolve stream" },
      { status: 500 }
    );
  }
}
