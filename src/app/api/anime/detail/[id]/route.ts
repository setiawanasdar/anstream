import { NextRequest, NextResponse } from "next/server";
import { sankaApi } from "@/lib/api/sanka";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await sankaApi.getAnimeDetail(id);
    if (!data) {
      return NextResponse.json({ status: "error", message: "Anime not found" }, { status: 404 });
    }
    return NextResponse.json({ status: "success", data });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to fetch anime detail" },
      { status: 500 }
    );
  }
}
