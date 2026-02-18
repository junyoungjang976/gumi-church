import { NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth"

interface YouTubeVideoStats {
  videoId: string
  title: string
  publishedAt: string
  viewCount: number
  likeCount: number
  commentCount: number
}

export async function GET(request: Request) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) {
    return NextResponse.json(
      { error: "인증이 필요합니다" },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const videoIds = searchParams.get("ids")

  if (!videoIds?.trim()) {
    return NextResponse.json(
      { error: "Video IDs가 필요합니다" },
      { status: 400 }
    )
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "YouTube API 키가 설정되지 않았습니다" },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`,
      { next: { revalidate: 300 } }
    )

    if (!res.ok) {
      const errorData = await res.json()
      console.error("YouTube API error:", errorData)
      return NextResponse.json(
        { error: "YouTube API 호출 중 오류가 발생했습니다" },
        { status: 502 }
      )
    }

    const data = await res.json()

    const stats: YouTubeVideoStats[] = (data.items ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => ({
        videoId: item.id as string,
        title: (item.snippet?.title as string) ?? "",
        publishedAt: (item.snippet?.publishedAt as string) ?? "",
        viewCount: parseInt(item.statistics?.viewCount ?? "0"),
        likeCount: parseInt(item.statistics?.likeCount ?? "0"),
        commentCount: parseInt(item.statistics?.commentCount ?? "0"),
      })
    )

    return NextResponse.json(stats)
  } catch (error) {
    console.error("YouTube stats fetch error:", error)
    return NextResponse.json(
      { error: "YouTube 통계를 가져오는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
