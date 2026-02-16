import { NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { extractYouTubeId } from "@/lib/youtube"

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

function validateYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null
}

export async function GET() {
  const authError = await checkAuth()
  if (authError) return authError

  const { data, error } = await supabaseAdmin
    .from("church_sermons")
    .select("*")
    .order("sermon_date", { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: "설교를 불러오는 중 오류가 발생했습니다" },
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

    if (!body.title?.trim() || !body.preacher?.trim() || !body.youtube_url?.trim() || !body.sermon_date) {
      return NextResponse.json(
        { error: "제목, 설교자, YouTube URL, 설교일을 입력해주세요" },
        { status: 400 }
      )
    }

    if (!validateYouTubeUrl(body.youtube_url.trim())) {
      return NextResponse.json(
        { error: "올바른 YouTube URL을 입력해주세요" },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("church_sermons")
      .insert({
        title: body.title.trim(),
        preacher: body.preacher.trim(),
        scripture: body.scripture?.trim() || null,
        youtube_url: body.youtube_url.trim(),
        sermon_date: body.sermon_date,
        description: body.description?.trim() || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Sermon insert error:", error)
      return NextResponse.json(
        { error: "설교 등록 중 오류가 발생했습니다" },
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
        { error: "설교 ID가 필요합니다" },
        { status: 400 }
      )
    }

    if (body.youtube_url && !validateYouTubeUrl(body.youtube_url.trim())) {
      return NextResponse.json(
        { error: "올바른 YouTube URL을 입력해주세요" },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.preacher !== undefined) updateData.preacher = body.preacher.trim()
    if (body.scripture !== undefined) updateData.scripture = body.scripture?.trim() || null
    if (body.youtube_url !== undefined) updateData.youtube_url = body.youtube_url.trim()
    if (body.sermon_date !== undefined) updateData.sermon_date = body.sermon_date
    if (body.description !== undefined) updateData.description = body.description?.trim() || null

    const { data, error } = await supabaseAdmin
      .from("church_sermons")
      .update(updateData)
      .eq("id", body.id)
      .select()
      .single()

    if (error) {
      console.error("Sermon update error:", error)
      return NextResponse.json(
        { error: "설교 수정 중 오류가 발생했습니다" },
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
        { error: "설교 ID가 필요합니다" },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from("church_sermons")
      .delete()
      .eq("id", body.id)

    if (error) {
      console.error("Sermon delete error:", error)
      return NextResponse.json(
        { error: "설교 삭제 중 오류가 발생했습니다" },
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
