import type { Metadata } from "next"
import Link from "next/link"
import { format } from "date-fns"
import { Pin } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Notice } from "@/types/database"

export const metadata: Metadata = {
  title: "교회소식",
}

export default async function NoticesPage() {
  const { data: notices } = await supabase
    .from("church_notices")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  const typedNotices = (notices ?? []) as Notice[]

  return (
    <>
      <PageHeader
        title="교회소식"
        description="교회 소식과 공지사항을 확인하세요"
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {typedNotices.length === 0 ? (
            <p className="text-center text-church-brown-light">
              등록된 소식이 없습니다
            </p>
          ) : (
            <div className="space-y-4">
              {typedNotices.map((notice) => (
                <Link key={notice.id} href={`/notices/${notice.id}`}>
                  <Card className="border-church-gold-light bg-white transition-shadow hover:shadow-md">
                    <CardContent className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {notice.is_pinned && (
                            <Badge className="bg-church-gold text-white">
                              <Pin className="size-3" />
                              고정
                            </Badge>
                          )}
                          <h3 className="truncate text-lg font-semibold text-church-brown">
                            {notice.title}
                          </h3>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-sm text-church-brown-light">
                          <span>{notice.author}</span>
                          <span className="text-church-gold-light">|</span>
                          <span>
                            {format(
                              new Date(notice.created_at),
                              "yyyy.MM.dd"
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
