"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LogOut, FileText, Video, Settings, Loader2, Lock, Film, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [counts, setCounts] = useState({ notices: 0, sermons: 0, reviews: 0, pendingReviews: 0 })

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await fetch("/api/admin/notices")
      if (res.ok) {
        setIsAuthed(true)
        const data = await res.json()
        setCounts((prev) => ({ ...prev, notices: data.length ?? 0 }))
        const sermonsRes = await fetch("/api/admin/sermons")
        if (sermonsRes.ok) {
          const sermonsData = await sermonsRes.json()
          setCounts((prev) => ({ ...prev, sermons: sermonsData.length ?? 0 }))
        }
        const reviewsRes = await fetch("/api/admin/reviews")
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json()
          const pending = reviewsData.filter((r: { status: string }) => r.status === "pending").length
          setCounts((prev) => ({ ...prev, reviews: reviewsData.length ?? 0, pendingReviews: pending }))
        }
      }
    } catch {
      // not authed
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        setPassword("")
        setIsLoading(true)
        await checkAuth()
      } else {
        const data = await res.json()
        setLoginError(data.error || "로그인에 실패했습니다")
      }
    } catch {
      setLoginError("서버 오류가 발생했습니다")
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" })
    setIsAuthed(false)
    setCounts({ notices: 0, sermons: 0, reviews: 0, pendingReviews: 0 })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-church-brown-light" />
      </div>
    )
  }

  if (!isAuthed) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-church-cream-dark">
              <Lock className="size-6 text-church-brown" />
            </div>
            <CardTitle className="text-xl text-church-brown">관리자 로그인</CardTitle>
            <CardDescription>관리자 비밀번호를 입력해주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  required
                  autoFocus
                />
              </div>
              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-church-brown hover:bg-church-brown/90"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  "로그인"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-church-brown">관리자 대시보드</h1>
          <p className="mt-1 text-sm text-church-brown-light">
            구미겨자씨교회 관리 시스템
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} size="sm">
          <LogOut className="size-4" />
          로그아웃
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/reviews" className="block">
          <Card className="transition-shadow hover:shadow-md border-church-gold">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-church-gold/20">
                  <Film className="size-5 text-church-brown" />
                </div>
                <div>
                  <CardTitle className="text-lg text-church-brown">영상 검토</CardTitle>
                  <CardDescription>쇼츠 영상 검토 요청 관리</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-church-brown">{counts.reviews}</p>
              <p className="text-sm text-church-brown-light">
                {counts.pendingReviews > 0
                  ? `검토 대기 ${counts.pendingReviews}건`
                  : "등록된 영상"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/notices" className="block">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-church-gold-light">
                  <FileText className="size-5 text-church-brown" />
                </div>
                <div>
                  <CardTitle className="text-lg text-church-brown">공지사항 관리</CardTitle>
                  <CardDescription>공지사항을 작성하고 관리합니다</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-church-brown">{counts.notices}</p>
              <p className="text-sm text-church-brown-light">등록된 공지사항</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/sermons" className="block">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-church-sage/20">
                  <Video className="size-5 text-church-brown" />
                </div>
                <div>
                  <CardTitle className="text-lg text-church-brown">설교 관리</CardTitle>
                  <CardDescription>설교 영상을 등록하고 관리합니다</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-church-brown">{counts.sermons}</p>
              <p className="text-sm text-church-brown-light">등록된 설교</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/youtube-stats" className="block">
          <Card className="transition-shadow hover:shadow-md border-church-sage">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
                  <BarChart3 className="size-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-church-brown">쇼츠 성과</CardTitle>
                  <CardDescription>YouTube 쇼츠 조회수, 좋아요, 댓글 추적</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-church-brown-light">실시간 YouTube 성과 대시보드</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings" className="block">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-church-cream-dark">
                  <Settings className="size-5 text-church-brown" />
                </div>
                <div>
                  <CardTitle className="text-lg text-church-brown">교회 정보 설정</CardTitle>
                  <CardDescription>전화번호, 이메일 등 교회 정보를 수정합니다</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-church-brown-light">연락처, 주소 등 기본 정보 관리</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
