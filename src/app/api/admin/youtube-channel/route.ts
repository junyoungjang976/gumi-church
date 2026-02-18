import { NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth"

const UPLOADS_PLAYLIST_ID = "UUf0t8WhqbR8tts3fcBF-NnA"

interface ChannelVideo {
  videoId: string
  title: string
  publishedAt: string
  thumbnail: string
  viewCount: number
  likeCount: number
  commentCount: number
}

export async function GET() {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) {
    return NextResponse.json(
      { error: "인증이 필요합니다" },
      { status: 401 }
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
    // 1. Get all video IDs from uploads playlist (paginate up to 150)
    const videoIds: string[] = []
    let nextPageToken = ""

    for (let page = 0; page < 3; page++) {
      const pageParam = nextPageToken ? `&pageToken=${nextPageToken}` : ""
      const playlistRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50${pageParam}&key=${apiKey}`
      )

      if (!playlistRes.ok) {
        const err = await playlistRes.json()
        console.error("Playlist API error:", err)
        break
      }

      const playlistData = await playlistRes.json()

      for (const item of playlistData.items ?? []) {
        const vid = item.snippet?.resourceId?.videoId
        if (vid) videoIds.push(vid)
      }

      nextPageToken = playlistData.nextPageToken ?? ""
      if (!nextPageToken) break
    }

    if (videoIds.length === 0) {
      return NextResponse.json([])
    }

    // 2. Get stats for all videos (batch 50 at a time)
    const videos: ChannelVideo[] = []

    for (let i = 0; i < videoIds.length; i += 50) {
      const batch = videoIds.slice(i, i + 50)
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${batch.join(",")}&key=${apiKey}`
      )

      if (!statsRes.ok) continue

      const statsData = await statsRes.json()

      for (const item of statsData.items ?? []) {
        videos.push({
          videoId: item.id,
          title: item.snippet?.title ?? "",
          publishedAt: item.snippet?.publishedAt ?? "",
          thumbnail: item.snippet?.thumbnails?.medium?.url ?? item.snippet?.thumbnails?.default?.url ?? "",
          viewCount: parseInt(item.statistics?.viewCount ?? "0"),
          likeCount: parseInt(item.statistics?.likeCount ?? "0"),
          commentCount: parseInt(item.statistics?.commentCount ?? "0"),
        })
      }
    }

    // Sort by publishedAt descending
    videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return NextResponse.json(videos)
  } catch (error) {
    console.error("YouTube channel fetch error:", error)
    return NextResponse.json(
      { error: "채널 영상을 가져오는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
