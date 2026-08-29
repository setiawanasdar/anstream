import { NextRequest, NextResponse } from "next/server";
import { sankaApi } from "@/lib/api/sanka";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const data = await sankaApi.searchAnime(query);
    return NextResponse.json({ status: "success", data });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to search anime" },
      { status: 500 }
    );
  }
}
