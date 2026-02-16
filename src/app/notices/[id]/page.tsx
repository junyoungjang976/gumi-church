import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Notice } from "@/types/database"

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: NoticeDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const { data: notice } = await supabase
    .from("church_notices")
    .select("title")
    .eq("id", id)
    .single()

  return {
    title: notice?.title ?? "교회소식",
  }
}

export default async function NoticeDetailPage({
  params,
}: NoticeDetailPageProps) {
  const { id } = await params
  const { data: notice } = await supabase
    .from("church_notices")
    .select("*")
    .eq("id", id)
    .single()

  if (!notice) notFound()

  const typedNotice = notice as Notice

  return (
    <>
      <PageHeader title="교회소식" />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border-church-gold-light bg-white">
            <CardContent>
              <h1 className="text-2xl font-bold text-church-brown sm:text-3xl">
                {typedNotice.title}
              </h1>
              <div className="mt-3 flex items-center gap-3 text-sm text-church-brown-light">
                <span>{typedNotice.author}</span>
                <span className="text-church-gold-light">|</span>
                <span>
                  {format(new Date(typedNotice.created_at), "yyyy.MM.dd")}
                </span>
              </div>

              <div className="mt-8 border-t border-church-gold-light pt-8">
                <div className="whitespace-pre-wrap text-base leading-relaxed text-church-brown-light">
                  {typedNotice.content}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <Button
              asChild
              variant="outline"
              className="border-church-gold-light text-church-brown hover:bg-church-cream"
            >
              <Link href="/notices">
                <ArrowLeft className="size-4" />
                목록으로
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
