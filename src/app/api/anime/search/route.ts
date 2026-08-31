import { NextRequest, NextResponse } from "next/server";
import { sankaApi } from "@/lib/api/sanka";
import { movieboxApi } from "@/lib/api/moviebox";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ status: "success", data: [] });
    }

    const [sankaRes, movieboxRes] = await Promise.allSettled([
      sankaApi.searchAnime(query),
      movieboxApi.searchAnime(query),
    ]);

    const sankaList = sankaRes.status === "fulfilled" && Array.isArray(sankaRes.value) ? sankaRes.value : [];
    const movieboxList = movieboxRes.status === "fulfilled" && Array.isArray(movieboxRes.value) ? movieboxRes.value : [];

    // Combine with smart deduplication
    const combined = [...sankaList];

    for (const mbxItem of movieboxList) {
      const mbxClean = mbxItem.title
        .toLowerCase()
        .replace(/\[moviebox.*?\]/gi, "")
        .replace(/[^a-z0-9]/g, "");

      const isDuplicate = combined.some((s) => {
        const sClean = s.title.toLowerCase().replace(/[^a-z0-9]/g, "");
        return sClean.includes(mbxClean) || mbxClean.includes(sClean);
      });

      // If missing in Sankavollerei (or distinct release), append MovieBox result
      if (!isDuplicate) {
        combined.push(mbxItem);
      }
    }

    return NextResponse.json({ status: "success", data: combined });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to search anime" },
      { status: 500 }
    );
  }
}
