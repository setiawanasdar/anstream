import { NextRequest, NextResponse } from "next/server";
import { sankaApi } from "@/lib/api/sanka";
import { searchVidSrcCatalog } from "@/lib/api/vidsrc";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    const [sankaResults, vidsrcResults] = await Promise.all([
      sankaApi.searchAnime(query).catch(() => []),
      Promise.resolve(searchVidSrcCatalog(query)),
    ]);

    // Deduplicate: merge sanka results and vidsrc results
    const combined = [...sankaResults];
    for (const v of vidsrcResults) {
      const isDuplicate = combined.some((s) =>
        s.title.toLowerCase().replace(/[^a-z0-9]/g, "") ===
        v.title.toLowerCase().replace(/[^a-z0-9]/g, "")
      );
      if (!isDuplicate) {
        combined.push(v);
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
