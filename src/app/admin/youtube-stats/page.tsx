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

interface ChannelVideo {
  videoId: string
  title: string
  publishedAt: string
  thumbnail: string
  viewCount: number
  likeCount: number
  commentCount: number
}

export default function YouTubeStatsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [videos, setVideos] = useState<ChannelVideo[]>([])

  useEffect(() => {
    fetchChannel()
  }, [])

  async function fetchChannel() {
    try {
      const res = await fetch("/api/admin/youtube-channel")
      if (res.status === 401) {
        router.push("/admin")
        return
      }
      if (res.ok) {
        const data: ChannelVideo[] = await res.json()
        setVideos(data)
      }
    } catch {
      // error
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  function handleRefresh() {
    setRefreshing(true)
    fetchChannel()
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

  const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0)
  const totalLikes = videos.reduce((sum, v) => sum + v.likeCount, 0)
  const totalComments = videos.reduce((sum, v) => sum + v.commentCount, 0)
  const avgViews = videos.length > 0 ? Math.round(totalViews / videos.length) : 0

  const topByViews = [...videos].sort((a, b) => b.viewCount - a.viewCount)

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const recentVideos = videos.filter(
    (v) => new Date(v.publishedAt).getTime() >= thirtyDaysAgo
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
            <h1 className="text-2xl font-bold text-church-brown">YouTube 성과 대시보드</h1>
            <p className="text-sm text-church-brown-light">
              @gumigyazassi 채널 전체 영상 ({videos.length}개)
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
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

      {videos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="mx-auto mb-3 size-10 text-church-brown-light/30" />
            <p className="text-sm text-church-brown-light">
              채널에 영상이 없습니다.
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
                  key={v.videoId}
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
                  <img
                    src={v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/default.jpg`}
                    alt=""
                    className="size-12 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-church-brown">
                      {v.title}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-blue-600">
                        <Eye className="size-3" />
                        {formatNumber(v.viewCount)}
                      </span>
                      <span className="flex items-center gap-1 text-rose-500">
                        <ThumbsUp className="size-3" />
                        {formatNumber(v.likeCount)}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-500">
                        <MessageCircle className="size-3" />
                        {formatNumber(v.commentCount)}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.videoId}`}
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
                {recentVideos.length > 0 && (
                  <Badge variant="outline" className="text-[10px]">
                    {recentVideos.length}개
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentVideos.length === 0 ? (
                <p className="py-4 text-center text-sm text-church-brown-light">
                  최근 30일 내 업로드된 영상이 없습니다.
                </p>
              ) : (
                recentVideos.slice(0, 10).map((v) => (
                  <div
                    key={v.videoId}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <img
                      src={v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/default.jpg`}
                      alt=""
                      className="size-12 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-church-brown">
                          {v.title}
                        </p>
                        <Badge variant="outline" className="shrink-0 text-[10px]">
                          {timeAgo(v.publishedAt)}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-blue-600">
                          <Eye className="size-3" />
                          {formatNumber(v.viewCount)}
                        </span>
                        <span className="flex items-center gap-1 text-rose-500">
                          <ThumbsUp className="size-3" />
                          {formatNumber(v.likeCount)}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-500">
                          <MessageCircle className="size-3" />
                          {formatNumber(v.commentCount)}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`https://www.youtube.com/watch?v=${v.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <Button variant="ghost" size="icon-xs">
                        <ExternalLink className="size-3" />
                      </Button>
                    </a>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* All Videos Table */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-church-brown">
                <BarChart3 className="size-5" />
                전체 영상 성과 ({videos.length}개)
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
                      <tr key={v.videoId} className="border-b last:border-0">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/default.jpg`}
                              alt=""
                              className="size-8 shrink-0 rounded object-cover"
                            />
                            <a
                              href={`https://www.youtube.com/watch?v=${v.videoId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate max-w-[200px] text-church-brown hover:underline"
                            >
                              {v.title}
                            </a>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right font-medium text-blue-600">
                          {formatNumber(v.viewCount)}
                        </td>
                        <td className="px-3 py-3 text-right text-rose-500">
                          {formatNumber(v.likeCount)}
                        </td>
                        <td className="px-3 py-3 text-right text-emerald-500">
                          {formatNumber(v.commentCount)}
                        </td>
                        <td className="py-3 pl-3 text-right text-church-brown-light">
                          {timeAgo(v.publishedAt)}
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
