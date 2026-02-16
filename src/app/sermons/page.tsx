import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { supabase } from "@/lib/supabase"
import { fetchYouTubeVideos } from "@/lib/youtube-feed"
import { PageHeader } from "@/components/layout/page-header"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { SermonSearch } from "@/components/sermons/sermon-search"
import { SermonCard } from "@/components/sermons/sermon-card"
import { YouTubeVideoCard } from "@/components/sermons/youtube-video-card"
import type { Sermon } from "@/types/database"

export const metadata: Metadata = {
  title: "설교",
}

export const revalidate = 3600 // ISR: Revalidate every 1 hour

interface SermonsPageProps {
  searchParams: Promise<{ search?: string; page?: string }>
}

export default async function SermonsPage({ searchParams }: SermonsPageProps) {
  const { search, page } = await searchParams
  const currentPage = Number(page) || 1
  const pageSize = 9
  const offset = (currentPage - 1) * pageSize

  // Fetch YouTube channel ID from church settings
  const { data: settings } = await supabase
    .from("church_settings")
    .select("youtube_channel_id")
    .single()

  const channelId = settings?.youtube_channel_id

  // Fetch YouTube videos if channel ID exists
  const youtubeVideos = channelId ? await fetchYouTubeVideos(channelId, 12) : []

  // Fetch Supabase sermons
  let query = supabase
    .from("church_sermons")
    .select("*", { count: "exact" })
    .order("sermon_date", { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,scripture.ilike.%${search}%,preacher.ilike.%${search}%`
    )
  }

  const { data: sermons, count } = await query
  const typedSermons = (sermons ?? []) as Sermon[]
  const totalPages = Math.ceil((count || 0) / pageSize)

  function buildPageUrl(pageNum: number) {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (pageNum > 1) params.set("page", String(pageNum))
    const qs = params.toString()
    return `/sermons${qs ? `?${qs}` : ""}`
  }

  return (
    <>
      <PageHeader
        title="설교"
        description="말씀으로 세워가는 믿음의 공동체"
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* YouTube Videos Section */}
          {youtubeVideos.length > 0 && (
            <div className="mb-16">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-church-brown">
                  최근 설교 영상
                </h2>
                {channelId && (
                  <Link
                    href={`https://www.youtube.com/channel/${channelId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-church-brown-light hover:text-church-gold-dark transition-colors"
                  >
                    유튜브 채널 →
                  </Link>
                )}
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {youtubeVideos.map((video) => (
                  <YouTubeVideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          )}

          {/* Supabase Sermons Section */}
          {typedSermons.length > 0 && (
            <div>
              {youtubeVideos.length > 0 && (
                <h2 className="mb-6 text-2xl font-bold text-church-brown">
                  추가 설교
                </h2>
              )}

              {/* Search */}
              <div className="mx-auto mb-10 max-w-md">
                <Suspense>
                  <SermonSearch defaultValue={search} />
                </Suspense>
              </div>

              {/* Sermon Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {typedSermons.map((sermon) => (
                  <SermonCard key={sermon.id} sermon={sermon} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href={buildPageUrl(currentPage - 1)}
                          />
                        </PaginationItem>
                      )}

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href={buildPageUrl(pageNum)}
                              isActive={pageNum === currentPage}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext
                            href={buildPageUrl(currentPage + 1)}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          )}

          {/* No Content Message */}
          {youtubeVideos.length === 0 && typedSermons.length === 0 && (
            <p className="text-center text-church-brown-light">
              등록된 설교가 없습니다
            </p>
          )}
        </div>
      </section>
    </>
  )
}
