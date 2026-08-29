import { NextRequest, NextResponse } from "next/server";
import { sankaApi } from "@/lib/api/sanka";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const data = await sankaApi.getCompletedAnime(page);
    return NextResponse.json({ status: "success", ...data });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to fetch completed anime" },
      { status: 500 }
    );
  }
}
