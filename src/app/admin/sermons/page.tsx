"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowLeft,
  Video,
  FileText,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import type { Sermon } from "@/types/database"

interface SermonForm {
  title: string
  preacher: string
  scripture: string
  youtube_url: string
  sermon_date: string
  description: string
}

const emptyForm: SermonForm = {
  title: "",
  preacher: "",
  scripture: "",
  youtube_url: "",
  sermon_date: new Date().toISOString().split("T")[0],
  description: "",
}

export default function AdminSermonsPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState<SermonForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const fetchSermons = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sermons")
      if (res.ok) {
        const data = await res.json()
        setSermons(data)
        setIsAuthed(true)
      } else {
        window.location.href = "/admin"
      }
    } catch {
      window.location.href = "/admin"
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSermons()
  }, [fetchSermons])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setError("")
    setFormOpen(true)
  }

  function openEdit(sermon: Sermon) {
    setEditingId(sermon.id)
    setForm({
      title: sermon.title,
      preacher: sermon.preacher,
      scripture: sermon.scripture ?? "",
      youtube_url: sermon.youtube_url,
      sermon_date: sermon.sermon_date,
      description: sermon.description ?? "",
    })
    setError("")
    setFormOpen(true)
  }

  function openDelete(id: string) {
    setDeletingId(id)
    setDeleteOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const method = editingId ? "PUT" : "POST"
      const payload = {
        ...(editingId ? { id: editingId } : {}),
        title: form.title,
        preacher: form.preacher,
        scripture: form.scripture || null,
        youtube_url: form.youtube_url,
        sermon_date: form.sermon_date,
        description: form.description || null,
      }

      const res = await fetch("/api/admin/sermons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setFormOpen(false)
        await fetchSermons()
      } else {
        const data = await res.json()
        setError(data.error || "저장 중 오류가 발생했습니다")
      }
    } catch {
      setError("서버 오류가 발생했습니다")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deletingId) return
    setSaving(true)

    try {
      const res = await fetch("/api/admin/sermons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingId }),
      })

      if (res.ok) {
        setDeleteOpen(false)
        setDeletingId(null)
        await fetchSermons()
      }
    } catch {
      // silent
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
            <h1 className="text-2xl font-bold text-church-brown">설교 관리</h1>
            <p className="text-sm text-church-brown-light">
              총 {sermons.length}개의 설교
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
          <Link href="/admin/settings">
            <Button variant="outline" size="sm">
              <Settings className="size-4" />
              설정
            </Button>
          </Link>
          <Button
            onClick={openCreate}
            size="sm"
            className="bg-church-brown hover:bg-church-brown/90"
          >
            <Plus className="size-4" />
            새 설교 등록
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">제목</TableHead>
              <TableHead>설교자</TableHead>
              <TableHead>성경구절</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sermons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-church-brown-light">
                  <Video className="mx-auto mb-2 size-8 opacity-30" />
                  등록된 설교가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              sermons.map((sermon) => (
                <TableRow key={sermon.id}>
                  <TableCell className="font-medium">
                    <span className="truncate max-w-[250px] block">{sermon.title}</span>
                  </TableCell>
                  <TableCell>{sermon.preacher}</TableCell>
                  <TableCell className="text-church-brown-light">
                    {sermon.scripture || "-"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(sermon.sermon_date), "yyyy.MM.dd")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => openEdit(sermon)}
                      >
                        <Pencil className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => openDelete(sermon.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "설교 수정" : "새 설교 등록"}
            </DialogTitle>
            <DialogDescription>
              {editingId ? "설교 정보를 수정합니다" : "새로운 설교를 등록합니다"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sermon-title">제목</Label>
              <Input
                id="sermon-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="설교 제목"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sermon-preacher">설교자</Label>
                <Input
                  id="sermon-preacher"
                  value={form.preacher}
                  onChange={(e) => setForm({ ...form, preacher: e.target.value })}
                  placeholder="설교자 이름"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sermon-date">설교일</Label>
                <Input
                  id="sermon-date"
                  type="date"
                  value={form.sermon_date}
                  onChange={(e) => setForm({ ...form, sermon_date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sermon-scripture">성경구절</Label>
              <Input
                id="sermon-scripture"
                value={form.scripture}
                onChange={(e) => setForm({ ...form, scripture: e.target.value })}
                placeholder="예: 마태복음 5:1-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sermon-youtube">YouTube URL</Label>
              <Input
                id="sermon-youtube"
                value={form.youtube_url}
                onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sermon-description">설명</Label>
              <Textarea
                id="sermon-description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="설교에 대한 간단한 설명 (선택사항)"
                rows={3}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                disabled={saving}
              >
                취소
              </Button>
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
                ) : editingId ? (
                  "수정"
                ) : (
                  "등록"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>설교 삭제</DialogTitle>
            <DialogDescription>
              이 설교를 삭제하시겠습니까? 삭제된 설교는 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={saving}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  삭제 중...
                </>
              ) : (
                "삭제"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
