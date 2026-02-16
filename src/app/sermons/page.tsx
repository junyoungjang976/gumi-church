import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { supabase } from "@/lib/supabase"
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
import type { Sermon } from "@/types/database"

export const metadata: Metadata = {
  title: "설교",
}

interface SermonsPageProps {
  searchParams: Promise<{ search?: string; page?: string }>
}

export default async function SermonsPage({ searchParams }: SermonsPageProps) {
  const { search, page } = await searchParams
  const currentPage = Number(page) || 1
  const pageSize = 9
  const offset = (currentPage - 1) * pageSize

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
          {/* Search */}
          <div className="mx-auto mb-10 max-w-md">
            <Suspense>
              <SermonSearch defaultValue={search} />
            </Suspense>
          </div>

          {/* Sermon Grid */}
          {typedSermons.length === 0 ? (
            <p className="text-center text-church-brown-light">
              등록된 설교가 없습니다
            </p>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>
    </>
  )
}
