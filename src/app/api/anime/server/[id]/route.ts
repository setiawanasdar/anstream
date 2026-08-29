import { NextRequest, NextResponse } from "next/server";
import { sankaApi } from "@/lib/api/sanka";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await sankaApi.getServerStream(id);
    if (!data) {
      return NextResponse.json({ status: "error", message: "Server stream not found" }, { status: 404 });
    }
    return NextResponse.json({ status: "success", data });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to fetch server stream" },
      { status: 500 }
    );
  }
}
