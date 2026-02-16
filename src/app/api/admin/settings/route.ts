import { NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  // Public read - no auth needed
  const { data, error } = await supabaseAdmin
    .from("church_settings")
    .select("*")

  if (error) {
    return NextResponse.json(
      { error: "설정을 불러오는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }

  // Convert array to object: { phone: "xxx", email: "xxx", ... }
  const settings: Record<string, string> = {}
  for (const row of data || []) {
    settings[row.key] = row.value
  }

  return NextResponse.json(settings)
}

export async function PUT(request: Request) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) {
    return NextResponse.json(
      { error: "인증이 필요합니다" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    // body is { phone: "xxx", email: "xxx", address: "xxx" }
    const updates = Object.entries(body).map(([key, value]) => ({
      key,
      value: (value as string) || "",
    }))

    for (const { key, value } of updates) {
      const { error } = await supabaseAdmin
        .from("church_settings")
        .upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        )

      if (error) {
        console.error(`Settings update error for ${key}:`, error)
        return NextResponse.json(
          { error: `${key} 설정 저장 중 오류가 발생했습니다` },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다" },
      { status: 400 }
    )
  }
}
