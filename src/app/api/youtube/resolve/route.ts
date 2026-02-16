import { resolveChannelId } from "@/lib/youtube-feed"
import { verifyAdmin } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { input }: { input: string } = await request.json()

  const channelId = await resolveChannelId(input)

  if (!channelId) {
    return NextResponse.json(
      { error: "채널 ID를 찾을 수 없습니다" },
      { status: 400 }
    )
  }

  return NextResponse.json({ channelId })
}
