"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Loader2,
  Trash2,
  Copy,
  Check,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  MessageSquare,
  Eye,
  ThumbsUp,
  MessageCircle,
  BarChart3,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { VideoReview, ReviewStatus } from "@/types/database"
import { extractYouTubeId } from "@/lib/youtube"

interface YouTubeStats {
  videoId: string
  viewCount: number
  likeCount: number
  commentCount: number
}

const statusConfig: Record<ReviewStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "검토 대기", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  approved: { label: "승인", color: "bg-green-100 text-green-800", icon: CheckCircle },
  revision: { label: "부분 수정", color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
  rejected: { label: "반려", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function AdminReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<VideoReview[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: "", youtube_url: "", description: "" })
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [statsMap, setStatsMap] = useState<Record<string, YouTubeStats>>({})
  const [statsLoading, setStatsLoading] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchStats(reviewList: VideoReview[]) {
    const ids = reviewList
      .map((r) => extractYouTubeId(r.youtube_url))
      .filter((id): id is string => id !== null)

    if (ids.length === 0) return

    setStatsLoading(true)
    try {
      const res = await fetch(`/api/admin/youtube-stats?ids=${ids.join(",")}`)
      if (res.ok) {
        const stats: YouTubeStats[] = await res.json()
        const map: Record<string, YouTubeStats> = {}
        for (const s of stats) {
          map[s.videoId] = s
        }
        setStatsMap(map)
      }
    } catch {
      // stats fetch failed silently
    } finally {
      setStatsLoading(false)
    }
  }

  async function fetchReviews() {
    try {
      const res = await fetch("/api/admin/reviews")
      if (res.status === 401) {
        router.push("/admin")
        return
      }
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
        fetchStats(data)
      }
    } catch {
      // error
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setForm({ title: "", youtube_url: "", description: "" })
        setShowForm(false)
        fetchReviews()
      }
    } catch {
      // error
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return

    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id))
      }
    } catch {
      // error
    }
  }

  function copyReviewLink(token: string) {
    const url = `${window.location.origin}/review/${token}`
    navigator.clipboard.writeText(url)
    setCopiedId(token)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-church-brown-light" />
      </div>
    )
  }

  const pending = reviews.filter((r) => r.status === "pending").length
  const approved = reviews.filter((r) => r.status === "approved").length
  const revision = reviews.filter((r) => r.status === "revision").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-church-brown">영상 검토 관리</h1>
            <p className="text-sm text-church-brown-light">
              쇼츠 영상을 등록하고 검토 링크를 공유하세요
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-church-brown hover:bg-church-brown/90"
        >
          <Plus className="size-4" />
          새 영상 등록
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-yellow-50 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">{pending}</p>
          <p className="text-xs text-yellow-600">검토 대기</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{approved}</p>
          <p className="text-xs text-green-600">승인</p>
        </div>
        <div className="rounded-lg bg-orange-50 p-4 text-center">
          <p className="text-2xl font-bold text-orange-700">{revision}</p>
          <p className="text-xs text-orange-600">부분 수정</p>
        </div>
      </div>

      {/* YouTube Performance Summary */}
      {Object.keys(statsMap).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg text-church-brown">
                <BarChart3 className="size-5" />
                YouTube 쇼츠 성과
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchStats(reviews)}
                disabled={statsLoading}
              >
                <RefreshCw className={`size-3 ${statsLoading ? "animate-spin" : ""}`} />
                새로고침
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <Eye className="mx-auto mb-1 size-5 text-blue-600" />
                <p className="text-2xl font-bold text-blue-700">
                  {Object.values(statsMap).reduce((sum, s) => sum + s.viewCount, 0).toLocaleString()}
                </p>
                <p className="text-xs text-blue-600">총 조회수</p>
              </div>
              <div className="rounded-lg bg-rose-50 p-4 text-center">
                <ThumbsUp className="mx-auto mb-1 size-5 text-rose-600" />
                <p className="text-2xl font-bold text-rose-700">
                  {Object.values(statsMap).reduce((sum, s) => sum + s.likeCount, 0).toLocaleString()}
                </p>
                <p className="text-xs text-rose-600">총 좋아요</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 text-center">
                <MessageCircle className="mx-auto mb-1 size-5 text-emerald-600" />
                <p className="text-2xl font-bold text-emerald-700">
                  {Object.values(statsMap).reduce((sum, s) => sum + s.commentCount, 0).toLocaleString()}
                </p>
                <p className="text-xs text-emerald-600">총 댓글</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-church-brown">새 영상 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="예: 2월 셋째주 쇼츠 - 주일예배 하이라이트"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube_url">YouTube URL *</Label>
                <Input
                  id="youtube_url"
                  value={form.youtube_url}
                  onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/shorts/... 또는 https://youtu.be/..."
                  required
                />
                <p className="text-xs text-amber-600">
                  * YouTube에서 &quot;일부 공개&quot;로 업로드해야 검토 페이지에서 영상이 보입니다. 비공개 영상은 재생되지 않습니다.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명 (선택)</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="검토 시 참고할 내용을 입력하세요"
                  rows={2}
                  className="resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={saving} className="bg-church-brown hover:bg-church-brown/90">
                  {saving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      등록 중...
                    </>
                  ) : (
                    "등록"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Review List */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-church-brown-light">
              등록된 영상이 없습니다. 새 영상을 등록해보세요.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const status = statusConfig[review.status]
            const StatusIcon = status.icon
            const videoId = extractYouTubeId(review.youtube_url)
            const isPreview = previewId === review.id

            return (
              <Card key={review.id} className="transition-shadow hover:shadow-md overflow-hidden">
                <CardContent className="p-0">
                  {/* Thumbnail / Player */}
                  {videoId && (
                    <div className="relative">
                      {isPreview ? (
                        <div className="aspect-video w-full bg-black">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                            className="size-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="group relative block aspect-video w-full cursor-pointer overflow-hidden bg-gray-100"
                          onClick={() => setPreviewId(review.id)}
                        >
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt={review.title}
                            className="size-full object-cover transition-transform group-hover:scale-105"
                          />
                          {/* Play button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                            <div className="flex size-14 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110">
                              <svg viewBox="0 0 24 24" className="ml-1 size-7 fill-white">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-church-brown truncate">
                          {review.title}
                        </h3>
                        <Badge className={status.color}>
                          <StatusIcon className="mr-1 size-3" />
                          {status.label}
                        </Badge>
                      </div>

                      {review.description && (
                        <p className="mt-1 text-sm text-church-brown-light line-clamp-1">
                          {review.description}
                        </p>
                      )}

                      {review.reviewer_comment && (
                        <div className="mt-2 flex items-start gap-2 rounded bg-church-cream-dark p-2">
                          <MessageSquare className="mt-0.5 size-3 shrink-0 text-church-brown-light" />
                          <p className="text-xs text-church-brown whitespace-pre-wrap">
                            {review.reviewer_comment}
                          </p>
                        </div>
                      )}

                      {/* YouTube Stats */}
                      {videoId && statsMap[videoId] && (
                        <div className="mt-2 flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1 text-blue-600">
                            <Eye className="size-3" />
                            {statsMap[videoId].viewCount.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-rose-600">
                            <ThumbsUp className="size-3" />
                            {statsMap[videoId].likeCount.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600">
                            <MessageCircle className="size-3" />
                            {statsMap[videoId].commentCount.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-4 text-xs text-church-brown-light">
                        <span>
                          {new Date(review.created_at).toLocaleDateString("ko-KR")}
                        </span>
                        {review.reviewed_at && (
                          <span>
                            검토: {new Date(review.reviewed_at).toLocaleDateString("ko-KR")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyReviewLink(review.review_token)}
                        title="검토 링크 복사"
                      >
                        {copiedId === review.review_token ? (
                          <>
                            <Check className="size-3 text-green-600" />
                            <span className="text-xs">복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3" />
                            <span className="text-xs">링크</span>
                          </>
                        )}
                      </Button>

                      <a
                        href={review.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" title="YouTube에서 보기">
                          <ExternalLink className="size-3" />
                        </Button>
                      </a>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="삭제"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
