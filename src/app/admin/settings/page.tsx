"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Loader2,
  ArrowLeft,
  Save,
  FileText,
  Video,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface SettingsForm {
  phone: string
  email: string
  address: string
}

const defaultSettings: SettingsForm = {
  phone: "",
  email: "",
  address: "",
}

export default function AdminSettingsPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState<SettingsForm>(defaultSettings)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      // Check auth by hitting an admin-only endpoint
      const authRes = await fetch("/api/admin/notices")
      if (!authRes.ok) {
        window.location.href = "/admin"
        return
      }
      setIsAuthed(true)

      // Fetch settings (public endpoint)
      const res = await fetch("/api/admin/settings")
      if (res.ok) {
        const data = await res.json()
        setForm({
          phone: data.phone ?? "",
          email: data.email ?? "",
          address: data.address ?? "",
        })
      }
    } catch {
      window.location.href = "/admin"
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setMessage({ type: "success", text: "설정이 저장되었습니다" })
      } else {
        const data = await res.json()
        setMessage({ type: "error", text: data.error || "저장 중 오류가 발생했습니다" })
      }
    } catch {
      setMessage({ type: "error", text: "서버 오류가 발생했습니다" })
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-church-brown-light" />
      </div>
    )
  }

  if (!isAuthed) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-church-brown">교회 정보 설정</h1>
            <p className="text-sm text-church-brown-light">
              전화번호, 이메일 등 교회 정보를 수정합니다
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/notices">
            <Button variant="outline" size="sm">
              <FileText className="size-4" />
              공지 관리
            </Button>
          </Link>
          <Link href="/admin/sermons">
            <Button variant="outline" size="sm">
              <Video className="size-4" />
              설교 관리
            </Button>
          </Link>
        </div>
      </div>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-church-cream-dark">
              <Settings className="size-5 text-church-brown" />
            </div>
            <div>
              <CardTitle className="text-lg text-church-brown">기본 정보</CardTitle>
              <CardDescription>홈페이지에 표시되는 교회 연락처 정보입니다</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-phone">전화번호</Label>
              <Input
                id="settings-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="예: 054-123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">이메일</Label>
              <Input
                id="settings-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="예: church@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-address">주소</Label>
              <Input
                id="settings-address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="예: 경북 구미시 봉곡북로15길 3"
              />
            </div>

            {message && (
              <p
                className={`text-sm ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.text}
              </p>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-church-brown hover:bg-church-brown/90"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    저장
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
