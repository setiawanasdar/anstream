import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("site_announcements")
      .select("*")
      .order("created_at", { ascending: false });

    return NextResponse.json({ status: "success", data: data || [] });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, message, type, is_active, link_url } = body;

    if (!title || !message) {
      return NextResponse.json({ status: "error", message: "Title & message are required" }, { status: 400 });
    }

    // If activating this one, optionally deactivate others
    if (is_active) {
      await supabase.from("site_announcements").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    }

    const { data, error } = await supabase
      .from("site_announcements")
      .insert({
        title,
        message,
        type: type || "info",
        is_active: !!is_active,
        link_url: link_url || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ status: "success", data });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, is_active, title, message, type, link_url } = body;

    if (!id) {
      return NextResponse.json({ status: "error", message: "ID is required" }, { status: 400 });
    }

    if (is_active) {
      await supabase.from("site_announcements").update({ is_active: false }).neq("id", id);
    }

    const updates: any = { updated_at: new Date().toISOString() };
    if (typeof is_active === "boolean") updates.is_active = is_active;
    if (title) updates.title = title;
    if (message) updates.message = message;
    if (type) updates.type = type;
    if (link_url !== undefined) updates.link_url = link_url;

    const { data, error } = await supabase
      .from("site_announcements")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ status: "success", data });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ status: "error", message: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("site_announcements").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ status: "success", message: "Announcement deleted" });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
