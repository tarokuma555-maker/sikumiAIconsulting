import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  job?: string;
  message?: string;
};

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 100);
  const email = (body.email ?? "").trim().slice(0, 200);
  const job = (body.job ?? "").trim().slice(0, 100);
  const message = (body.message ?? "").trim().slice(0, 2000);

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "name and valid email are required" },
      { status: 400 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Supabase未設定でもフォームを壊さない(ログに残して受理)
  if (!url || !key) {
    console.warn("[consult] Supabase env not set. Payload:", {
      name,
      email,
      job,
    });
    return NextResponse.json({ ok: true, stored: false });
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.from("consultation_requests").insert({
    name,
    email,
    job: job || null,
    message: message || null,
  });

  if (error) {
    console.error("[consult] insert failed:", error.message);
    return NextResponse.json(
      { ok: false, error: "storage failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, stored: true });
}
