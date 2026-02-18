"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Loader2,
  Eye,
  ThumbsUp,
  MessageCircle,
  BarChart3,
  RefreshCw,
  TrendingUp,
  Clock,
  Trophy,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { VideoReview } from "@/types/database"
import { extractYouTubeId } from "@/lib/youtube"

interface YouTubeStats {
  videoId: string
  title: string
  publishedAt: string
  viewCount: number
  likeCount: number
  commentCount: number
}

interface VideoWithStats {
  review: VideoReview
  stats: YouTubeStats | null
  videoId: string | null
}

export default function YouTubeStatsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(false)
  const [videos, setVideos] = useState<VideoWithStats[]>([])

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    try {
      const reviewsRes = await fetch("/api/admin/reviews")
      if (reviewsRes.status === 401) {
        router.push("/admin")
        return
      }
      if (!reviewsRes.ok) return

      const reviews: VideoReview[] = await reviewsRes.json()
      const videosWithId = reviews.map((r) => ({
        review: r,
        stats: null as YouTubeStats | null,
        videoId: extractYouTubeId(r.youtube_url),
      }))

      setVideos(videosWithId)
      await fetchStats(videosWithId)
    } catch {
      // error
    } finally {
      setLoading(false)
    }
  }

  async function fetchStats(videoList: VideoWithStats[]) {
    const ids = videoList
      .map((v) => v.videoId)
      .filter((id): id is string => id !== null)

    if (ids.length === 0) return

    setStatsLoading(true)
    try {
      const res = await fetch(`/api/admin/youtube-stats?ids=${ids.join(",")}`)
      if (res.ok) {
        const stats: YouTubeStats[] = await res.json()
        const statsMap: Record<string, YouTubeStats> = {}
        for (const s of stats) {
          statsMap[s.videoId] = s
        }
        setVideos((prev) =>
          prev.map((v) => ({
            ...v,
            stats: v.videoId ? statsMap[v.videoId] ?? null : null,
          }))
        )
      }
    } catch {
      // silent
    } finally {
      setStatsLoading(false)
    }
  }

  function formatNumber(n: number): string {
    if (n >= 10000) return `${(n / 10000).toFixed(1)}만`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}천`
    return n.toLocaleString()
  }

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return "오늘"
    if (days === 1) return "어제"
    if (days < 7) return `${days}일 전`
    if (days < 30) return `${Math.floor(days / 7)}주 전`
    return `${Math.floor(days / 30)}개월 전`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-church-brown-light" />
      </div>
    )
  }

  const videosWithStats = videos.filter((v) => v.stats !== null)
  const totalViews = videosWithStats.reduce((sum, v) => sum + (v.stats?.viewCount ?? 0), 0)
  const totalLikes = videosWithStats.reduce((sum, v) => sum + (v.stats?.likeCount ?? 0), 0)
  const totalComments = videosWithStats.reduce((sum, v) => sum + (v.stats?.commentCount ?? 0), 0)
  const avgViews = videosWithStats.length > 0 ? Math.round(totalViews / videosWithStats.length) : 0

  const topByViews = [...videosWithStats].sort(
    (a, b) => (b.stats?.viewCount ?? 0) - (a.stats?.viewCount ?? 0)
  )
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const recentVideos = [...videosWithStats]
    .filter((v) => new Date(v.stats?.publishedAt ?? 0).getTime() >= thirtyDaysAgo)
    .sort(
      (a, b) => new Date(b.stats?.publishedAt ?? 0).getTime() - new Date(a.stats?.publishedAt ?? 0).getTime()
    )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-church-brown">쇼츠 성과 대시보드</h1>
            <p className="text-sm text-church-brown-light">
              YouTube 쇼츠 영상 성과를 한눈에 확인하세요
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchStats(videos)}
          disabled={statsLoading}
        >
          <RefreshCw className={`size-4 ${statsLoading ? "animate-spin" : ""}`} />
          새로고침
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="mx-auto mb-2 size-6 text-blue-500" />
            <p className="text-3xl font-bold text-church-brown">{formatNumber(totalViews)}</p>
            <p className="text-xs text-church-brown-light">총 조회수</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ThumbsUp className="mx-auto mb-2 size-6 text-rose-500" />
            <p className="text-3xl font-bold text-church-brown">{formatNumber(totalLikes)}</p>
            <p className="text-xs text-church-brown-light">총 좋아요</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="mx-auto mb-2 size-6 text-emerald-500" />
            <p className="text-3xl font-bold text-church-brown">{formatNumber(totalComments)}</p>
            <p className="text-xs text-church-brown-light">총 댓글</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="mx-auto mb-2 size-6 text-amber-500" />
            <p className="text-3xl font-bold text-church-brown">{formatNumber(avgViews)}</p>
            <p className="text-xs text-church-brown-light">평균 조회수</p>
          </CardContent>
        </Card>
      </div>

      {videosWithStats.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="mx-auto mb-3 size-10 text-church-brown-light/30" />
            <p className="text-sm text-church-brown-light">
              성과 데이터가 없습니다. 영상 검토에서 쇼츠를 등록해주세요.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top by Views */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-church-brown">
                <Trophy className="size-5 text-amber-500" />
                조회수 TOP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topByViews.slice(0, 10).map((v, i) => (
                <div
                  key={v.review.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    i === 0 ? "bg-amber-100 text-amber-700" :
                    i === 1 ? "bg-gray-100 text-gray-600" :
                    i === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-church-cream-dark text-church-brown-light"
                  }`}>
                    {i + 1}
                  </span>
                  {v.videoId && (
                    <img
                      src={`https://img.youtube.com/vi/${v.videoId}/default.jpg`}
                      alt=""
                      className="size-12 shrink-0 rounded object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-church-brown">
                      {v.review.title}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-church-brown-light">
                      <span className="flex items-center gap-1 text-blue-600">
                        <Eye className="size-3" />
                        {formatNumber(v.stats?.viewCount ?? 0)}
                      </span>
                      <span className="flex items-center gap-1 text-rose-500">
                        <ThumbsUp className="size-3" />
                        {formatNumber(v.stats?.likeCount ?? 0)}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-500">
                        <MessageCircle className="size-3" />
                        {formatNumber(v.stats?.commentCount ?? 0)}
                      </span>
                    </div>
                  </div>
                  <a
                    href={v.review.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                  >
                    <Button variant="ghost" size="icon-xs">
                      <ExternalLink className="size-3" />
                    </Button>
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Videos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-church-brown">
                <Clock className="size-5 text-blue-500" />
                최근 30일 영상
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentVideos.slice(0, 10).map((v) => (
                <div
                  key={v.review.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  {v.videoId && (
                    <img
                      src={`https://img.youtube.com/vi/${v.videoId}/default.jpg`}
                      alt=""
                      className="size-12 shrink-0 rounded object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-church-brown">
                        {v.review.title}
                      </p>
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        {v.stats?.publishedAt ? timeAgo(v.stats.publishedAt) : ""}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-church-brown-light">
                      <span className="flex items-center gap-1 text-blue-600">
                        <Eye className="size-3" />
                        {formatNumber(v.stats?.viewCount ?? 0)}
                      </span>
                      <span className="flex items-center gap-1 text-rose-500">
                        <ThumbsUp className="size-3" />
                        {formatNumber(v.stats?.likeCount ?? 0)}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-500">
                        <MessageCircle className="size-3" />
                        {formatNumber(v.stats?.commentCount ?? 0)}
                      </span>
                    </div>
                  </div>
                  <a
                    href={v.review.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                  >
                    <Button variant="ghost" size="icon-xs">
                      <ExternalLink className="size-3" />
                    </Button>
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* All Videos Table */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-church-brown">
                <BarChart3 className="size-5" />
                전체 영상 성과
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-church-brown-light">
                      <th className="pb-2 pr-4">영상</th>
                      <th className="pb-2 px-3 text-right">조회수</th>
                      <th className="pb-2 px-3 text-right">좋아요</th>
                      <th className="pb-2 px-3 text-right">댓글</th>
                      <th className="pb-2 pl-3 text-right">업로드</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topByViews.map((v) => (
                      <tr key={v.review.id} className="border-b last:border-0">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            {v.videoId && (
                              <img
                                src={`https://img.youtube.com/vi/${v.videoId}/default.jpg`}
                                alt=""
                                className="size-8 shrink-0 rounded object-cover"
                              />
                            )}
                            <a
                              href={v.review.youtube_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate max-w-[200px] text-church-brown hover:underline"
                            >
                              {v.review.title}
                            </a>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right font-medium text-blue-600">
                          {formatNumber(v.stats?.viewCount ?? 0)}
                        </td>
                        <td className="px-3 py-3 text-right text-rose-500">
                          {formatNumber(v.stats?.likeCount ?? 0)}
                        </td>
                        <td className="px-3 py-3 text-right text-emerald-500">
                          {formatNumber(v.stats?.commentCount ?? 0)}
                        </td>
                        <td className="py-3 pl-3 text-right text-church-brown-light">
                          {v.stats?.publishedAt ? timeAgo(v.stats.publishedAt) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
