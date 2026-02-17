import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  const { data, error } = await supabaseAdmin
    .from("video_reviews")
    .select("id, title, description, youtube_url, status, reviewer_comment, reviewed_at, created_at")
    .eq("review_token", token)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: "검토 요청을 찾을 수 없습니다" },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  try {
    const body = await request.json()

    if (!body.status || !["approved", "revision", "rejected"].includes(body.status)) {
      return NextResponse.json(
        { error: "올바른 검토 상태를 선택해주세요" },
        { status: 400 }
      )
    }

    const { data: existing } = await supabaseAdmin
      .from("video_reviews")
      .select("id")
      .eq("review_token", token)
      .single()

    if (!existing) {
      return NextResponse.json(
        { error: "검토 요청을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("video_reviews")
      .update({
        status: body.status,
        reviewer_comment: body.comment?.trim() || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("review_token", token)
      .select()
      .single()

    if (error) {
      console.error("Review update error:", error)
      return NextResponse.json(
        { error: "검토 결과 저장 중 오류가 발생했습니다" },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다" },
      { status: 400 }
    )
  }
}
