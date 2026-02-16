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
  Pin,
  FileText,
  Video,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import type { Notice } from "@/types/database"

interface NoticeForm {
  title: string
  content: string
  author: string
  is_pinned: boolean
}

const emptyForm: NoticeForm = {
  title: "",
  content: "",
  author: "관리자",
  is_pinned: false,
}

export default function AdminNoticesPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [notices, setNotices] = useState<Notice[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState<NoticeForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const fetchNotices = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notices")
      if (res.ok) {
        const data = await res.json()
        setNotices(data)
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
    fetchNotices()
  }, [fetchNotices])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setError("")
    setFormOpen(true)
  }

  function openEdit(notice: Notice) {
    setEditingId(notice.id)
    setForm({
      title: notice.title,
      content: notice.content,
      author: notice.author,
      is_pinned: notice.is_pinned,
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
      const body = editingId ? { id: editingId, ...form } : form

      const res = await fetch("/api/admin/notices", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setFormOpen(false)
        await fetchNotices()
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
      const res = await fetch("/api/admin/notices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingId }),
      })

      if (res.ok) {
        setDeleteOpen(false)
        setDeletingId(null)
        await fetchNotices()
      }
    } catch {
      // error handling silent
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
            <h1 className="text-2xl font-bold text-church-brown">공지사항 관리</h1>
            <p className="text-sm text-church-brown-light">
              총 {notices.length}개의 공지사항
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/sermons">
            <Button variant="outline" size="sm">
              <Video className="size-4" />
              설교 관리
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
            새 공지 작성
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">제목</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>고정</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-church-brown-light">
                  <FileText className="mx-auto mb-2 size-8 opacity-30" />
                  등록된 공지사항이 없습니다
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {notice.is_pinned && (
                        <Pin className="size-3 text-church-gold shrink-0" />
                      )}
                      <span className="truncate max-w-[300px]">{notice.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{notice.author}</TableCell>
                  <TableCell>
                    {notice.is_pinned ? (
                      <Badge className="bg-church-gold text-white">고정</Badge>
                    ) : (
                      <Badge variant="outline">일반</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(notice.created_at), "yyyy.MM.dd")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => openEdit(notice)}
                      >
                        <Pencil className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => openDelete(notice.id)}
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
              {editingId ? "공지사항 수정" : "새 공지사항 작성"}
            </DialogTitle>
            <DialogDescription>
              {editingId ? "공지사항 내용을 수정합니다" : "새로운 공지사항을 작성합니다"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notice-title">제목</Label>
              <Input
                id="notice-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="공지사항 제목"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notice-content">내용</Label>
              <Textarea
                id="notice-content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="공지사항 내용을 입력하세요"
                rows={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notice-author">작성자</Label>
              <Input
                id="notice-author"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="작성자 이름"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="notice-pinned"
                type="checkbox"
                checked={form.is_pinned}
                onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
                className="size-4 rounded border-gray-300"
              />
              <Label htmlFor="notice-pinned">상단 고정</Label>
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
                  "작성"
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
            <DialogTitle>공지사항 삭제</DialogTitle>
            <DialogDescription>
              이 공지사항을 삭제하시겠습니까? 삭제된 공지사항은 복구할 수 없습니다.
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
