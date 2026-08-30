import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // 1. Count Total Profiles
    const { count: totalUsers, error: userErr } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // 2. Count Total Bookmarks
    const { count: totalBookmarks, error: bmErr } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact", head: true });

    // 3. Count Total Watch History
    const { count: totalHistory, error: hisErr } = await supabase
      .from("watch_history")
      .select("*", { count: "exact", head: true });

    // 4. Fetch Top Bookmarked Anime
    const { data: topBookmarks } = await supabase
      .from("bookmarks")
      .select("anime_id, anime_title, poster")
      .limit(50);

    // Group bookmarks by anime_title
    const bookmarkCountMap: Record<string, { title: string; poster: string; count: number; id: string }> = {};
    (topBookmarks || []).forEach((b) => {
      if (!bookmarkCountMap[b.anime_id]) {
        bookmarkCountMap[b.anime_id] = { id: b.anime_id, title: b.anime_title, poster: b.poster || "", count: 0 };
      }
      bookmarkCountMap[b.anime_id].count += 1;
    });

    const topAnimeList = Object.values(bookmarkCountMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 5. Recent Active Users
    const { data: recentUsers } = await supabase
      .from("profiles")
      .select("id, username, avatar_url, role, created_at")
      .order("created_at", { ascending: false })
      .limit(6);

    return NextResponse.json({
      status: "success",
      data: {
        totalUsers: totalUsers || 0,
        totalBookmarks: totalBookmarks || 0,
        totalHistory: totalHistory || 0,
        topAnimeList,
        recentUsers: recentUsers || [],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
