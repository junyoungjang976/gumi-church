import { NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"

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

export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  const { data, error } = await supabaseAdmin
    .from("church_notices")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: "공지사항을 불러오는 중 오류가 발생했습니다" },
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

    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { error: "제목과 내용을 입력해주세요" },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("church_notices")
      .insert({
        title: body.title.trim(),
        content: body.content.trim(),
        author: body.author?.trim() || "관리자",
        is_pinned: body.is_pinned ?? false,
      })
      .select()
      .single()

    if (error) {
      console.error("Notice insert error:", error)
      return NextResponse.json(
        { error: "공지사항 작성 중 오류가 발생했습니다" },
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

export async function PUT(request: Request) {
  const authError = await checkAuth()
  if (authError) return authError

  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: "공지사항 ID가 필요합니다" },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.content !== undefined) updateData.content = body.content.trim()
    if (body.author !== undefined) updateData.author = body.author.trim()
    if (body.is_pinned !== undefined) updateData.is_pinned = body.is_pinned

    const { data, error } = await supabaseAdmin
      .from("church_notices")
      .update(updateData)
      .eq("id", body.id)
      .select()
      .single()

    if (error) {
      console.error("Notice update error:", error)
      return NextResponse.json(
        { error: "공지사항 수정 중 오류가 발생했습니다" },
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
        { error: "공지사항 ID가 필요합니다" },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from("church_notices")
      .delete()
      .eq("id", body.id)

    if (error) {
      console.error("Notice delete error:", error)
      return NextResponse.json(
        { error: "공지사항 삭제 중 오류가 발생했습니다" },
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
