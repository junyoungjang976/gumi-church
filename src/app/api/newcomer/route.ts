import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "이름을 입력해주세요" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("church_newcomer_inquiries")
      .insert({
        name: body.name.trim(),
        phone: body.phone?.trim() || null,
        email: body.email?.trim() || null,
        message: body.message?.trim() || null,
      })

    if (error) {
      console.error("Newcomer inquiry insert error:", error)
      return NextResponse.json(
        { error: "서버 오류가 발생했습니다" },
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
