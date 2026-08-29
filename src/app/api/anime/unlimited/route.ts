import { NextResponse } from "next/server";
import { sankaApi } from "@/lib/api/sanka";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await sankaApi.getUnlimitedAnime();
    return NextResponse.json({ status: "success", data });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to fetch unlimited anime list" },
      { status: 500 }
    );
  }
}
