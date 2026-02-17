import { NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"
import crypto from "crypto"

async function checkAuth() {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) {
    return NextResponse.json(
      { error: "인증이 필요합니다" },
      { status: 401 }
    )
  }
  return null
}

function generateToken(): string {
  return crypto.randomBytes(8).toString("hex")
}

export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  const { data, error } = await supabaseAdmin
    .from("video_reviews")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: "검토 목록을 불러오는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json()

    if (!body.title?.trim() || !body.youtube_url?.trim()) {
      return NextResponse.json(
        { error: "제목과 YouTube URL을 입력해주세요" },
        { status: 400 }
      )
    }

    const review_token = generateToken()

    const { data, error } = await supabaseAdmin
      .from("video_reviews")
      .insert({
        title: body.title.trim(),
        description: body.description?.trim() || null,
        youtube_url: body.youtube_url.trim(),
        review_token,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Review insert error:", error)
      return NextResponse.json(
        { error: "검토 요청 생성 중 오류가 발생했습니다" },
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

export async function DELETE(request: Request) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: "검토 ID가 필요합니다" },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from("video_reviews")
      .delete()
      .eq("id", body.id)

    if (error) {
      console.error("Review delete error:", error)
      return NextResponse.json(
        { error: "검토 삭제 중 오류가 발생했습니다" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다" },
      { status: 400 }
    )
  }
}
