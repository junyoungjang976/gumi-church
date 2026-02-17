"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertTriangle, XCircle, Loader2, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { extractYouTubeId } from "@/lib/youtube"
import { use } from "react"

type ReviewStatus = "pending" | "approved" | "revision" | "rejected"

interface ReviewData {
  id: string
  title: string
  description: string | null
  youtube_url: string
  status: ReviewStatus
  reviewer_comment: string | null
  reviewed_at: string | null
  created_at: string
}

const statusConfig: Record<ReviewStatus, { label: string; color: string }> = {
  pending: { label: "검토 대기", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "승인", color: "bg-green-100 text-green-800" },
  revision: { label: "부분 수정", color: "bg-orange-100 text-orange-800" },
  rejected: { label: "반려", color: "bg-red-100 text-red-800" },
}

export default function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [review, setReview] = useState<ReviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchReview()
  }, [token])

  async function fetchReview() {
    try {
      const res = await fetch(`/api/review/${token}`)
      if (!res.ok) {
        setError("검토 요청을 찾을 수 없습니다")
        return
      }
      const data = await res.json()
      setReview(data)
      if (data.status !== "pending") {
        setSubmitted(true)
        setComment(data.reviewer_comment || "")
      }
    } catch {
      setError("데이터를 불러오는 중 오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(status: ReviewStatus) {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/review/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, comment }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "검토 결과 저장에 실패했습니다")
        return
      }

      const data = await res.json()
      setReview(data)
      setSubmitted(true)
    } catch {
      setError("서버 오류가 발생했습니다")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-church-brown-light" />
      </div>
    )
  }

  if (error && !review) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <XCircle className="mx-auto size-12 text-red-400" />
            <p className="mt-4 text-lg font-medium text-church-brown">{error}</p>
            <p className="mt-2 text-sm text-church-brown-light">
              링크가 올바른지 확인해주세요
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!review) return null

  const videoId = extractYouTubeId(review.youtube_url)
  const isShorts = review.youtube_url.includes("/shorts/")
  const statusInfo = statusConfig[review.status]

  return (
    <div className="min-h-[60vh] bg-church-cream-dark/30">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="text-sm font-medium tracking-widest text-church-gold uppercase">
            영상 검토
          </p>
          <h1 className="mt-2 text-xl font-bold text-church-brown sm:text-2xl">
            {review.title}
          </h1>
          {review.description && (
            <p className="mt-2 text-sm text-church-brown-light">
              {review.description}
            </p>
          )}
          <p className="mt-2 text-xs text-church-brown-light/70">
            {new Date(review.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Video */}
        <Card className="mb-6 overflow-hidden">
          {videoId ? (
            <div className={`relative w-full ${isShorts ? "mx-auto max-w-[360px]" : ""}`}>
              <div
                className="relative w-full"
                style={{ paddingBottom: isShorts ? "177.78%" : "56.25%" }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={review.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 size-full"
                />
              </div>
            </div>
          ) : (
            <CardContent className="py-12 text-center">
              <p className="text-sm text-church-brown-light">
                영상을 불러올 수 없습니다
              </p>
              <a
                href={review.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-church-gold underline"
              >
                YouTube에서 직접 보기
              </a>
            </CardContent>
          )}
        </Card>

        {/* Review Section */}
        {submitted ? (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-church-cream-dark">
                {review.status === "approved" && (
                  <CheckCircle className="size-8 text-green-600" />
                )}
                {review.status === "revision" && (
                  <AlertTriangle className="size-8 text-orange-500" />
                )}
                {review.status === "rejected" && (
                  <XCircle className="size-8 text-red-500" />
                )}
              </div>
              <Badge className={statusInfo.color}>
                {statusInfo.label}
              </Badge>
              <p className="mt-4 text-lg font-semibold text-church-brown">
                검토가 완료되었습니다
              </p>
              {review.reviewer_comment && (
                <div className="mx-auto mt-4 max-w-md rounded-lg bg-church-cream-dark p-4 text-left">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-church-brown-light">
                    <MessageSquare className="size-3" />
                    코멘트
                  </div>
                  <p className="text-sm text-church-brown whitespace-pre-wrap">
                    {review.reviewer_comment}
                  </p>
                </div>
              )}
              {review.reviewed_at && (
                <p className="mt-4 text-xs text-church-brown-light/70">
                  {new Date(review.reviewed_at).toLocaleString("ko-KR")}
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-church-brown">
                검토 의견
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="수정 사항이나 의견을 남겨주세요 (선택)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="resize-none"
              />

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => handleSubmit("approved")}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="size-4" />
                      <span className="hidden sm:inline ml-1">승인</span>
                      <span className="sm:hidden">승인</span>
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleSubmit("revision")}
                  disabled={submitting}
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <AlertTriangle className="size-4" />
                      <span className="hidden sm:inline ml-1">부분수정</span>
                      <span className="sm:hidden">수정</span>
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleSubmit("rejected")}
                  disabled={submitting}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="size-4" />
                      <span className="hidden sm:inline ml-1">반려</span>
                      <span className="sm:hidden">반려</span>
                    </>
                  )}
                </Button>
              </div>

              <p className="text-center text-xs text-church-brown-light/70">
                영상을 확인하신 후 결과를 선택해주세요
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
