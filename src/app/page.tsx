import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Clock, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { getYouTubeThumbnail } from "@/lib/youtube"
import { fetchYouTubeVideos } from "@/lib/youtube-feed"
import type { Notice, Sermon } from "@/types/database"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "구미겨자씨교회 - 겨자씨 한 알의 믿음으로",
}

const worshipServices = [
  { name: "주일 오전 예배", time: "매주 일요일 오전 11:00", desc: "이재두 목사 설교" },
  { name: "주일 오후 모임", time: "매주 일요일 오후 1:00", desc: "찬양예배 · 신앙교실 · 가정주일 · 말씀나눔" },
]

export default async function HomePage() {
  const { data: notices } = await supabase
    .from("church_notices")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(3)

  const { data: sermons } = await supabase
    .from("church_sermons")
    .select("*")
    .order("sermon_date", { ascending: false })
    .limit(3)

  // Fetch YouTube channel ID from settings
  const { data: settings } = await supabase
    .from("church_settings")
    .select("key, value")
    .eq("key", "youtube_channel_id")
    .single()

  const youtubeChannelId = settings?.value || null

  // Fetch YouTube videos if channel ID is set
  const youtubeVideos = youtubeChannelId
    ? await fetchYouTubeVideos(youtubeChannelId, 3)
    : []

  return (
    <>
      {/* Hero Section */}
      <section className="bg-church-cream-dark">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28 lg:py-32">
          <p className="mb-4 text-sm font-medium tracking-widest text-church-gold uppercase">
            환영합니다
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-church-brown sm:text-5xl lg:text-6xl">
            구미겨자씨교회
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-church-brown-light sm:text-xl">
            작은 씨앗 속에 풍성한 열매를 소망합니다
          </p>
          <p className="mt-2 text-sm text-church-brown-light/70">
            대한예수교장로회(백석)
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="min-w-[140px]">
              <Link href="/worship">예배안내</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[140px]">
              <Link href="/about">교회소개</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Worship Times */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-2 text-center text-sm font-medium tracking-widest text-church-gold uppercase">
            Worship
          </h2>
          <h3 className="mb-10 text-center text-2xl font-bold text-church-brown sm:text-3xl">
            예배 시간 안내
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {worshipServices.map((service) => (
              <Card
                key={service.name}
                className="border-church-gold-light bg-white text-center transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-church-cream-dark">
                    <Clock className="h-5 w-5 text-church-gold" />
                  </div>
                  <h4 className="text-lg font-semibold text-church-brown">
                    {service.name}
                  </h4>
                  <p className="mt-2 text-base font-medium text-church-brown-light">
                    {service.time}
                  </p>
                  <p className="mt-1 text-sm text-church-brown-light/70">
                    {service.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Notices */}
      <section className="bg-church-cream-dark/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-church-brown">교회소식</h3>
            <Link
              href="/notices"
              className="text-sm font-medium text-church-gold hover:text-church-brown transition-colors"
            >
              더보기 &rarr;
            </Link>
          </div>
          {notices && notices.length > 0 ? (
            <div className="space-y-3">
              {(notices as Notice[]).map((notice) => (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.id}`}
                  className="flex items-center justify-between rounded-lg bg-white px-5 py-4 border border-church-gold-light/50 transition-colors hover:bg-church-cream-dark/30"
                >
                  <div className="flex items-center gap-3">
                    {notice.is_pinned && (
                      <span className="rounded bg-church-gold/20 px-2 py-0.5 text-xs font-medium text-church-brown">
                        공지
                      </span>
                    )}
                    <span className="text-sm font-medium text-church-brown sm:text-base">
                      {notice.title}
                    </span>
                  </div>
                  <span className="ml-4 shrink-0 text-xs text-church-brown-light">
                    {new Date(notice.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-white px-5 py-8 text-center border border-church-gold-light/50">
              <p className="text-sm text-church-brown-light">
                등록된 소식이 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Sermons */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-church-brown">최근 설교</h3>
            <Link
              href="/sermons"
              className="text-sm font-medium text-church-gold hover:text-church-brown transition-colors"
            >
              더보기 &rarr;
            </Link>
          </div>
          {youtubeVideos.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {youtubeVideos.map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="overflow-hidden border-church-gold-light transition-shadow group-hover:shadow-md">
                    <div className="relative aspect-video w-full bg-church-cream-dark">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-church-gold">
                          <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h4 className="line-clamp-2 text-base font-semibold text-church-brown">
                        {video.title}
                      </h4>
                      <div className="mt-2 text-sm text-church-brown-light">
                        <span>{new Date(video.publishedAt).toLocaleDateString("ko-KR")}</span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          ) : sermons && sermons.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(sermons as Sermon[]).map((sermon) => {
                const thumbnail = getYouTubeThumbnail(sermon.youtube_url)
                return (
                  <Link
                    key={sermon.id}
                    href={`/sermons/${sermon.id}`}
                    className="group"
                  >
                    <Card className="overflow-hidden border-church-gold-light transition-shadow group-hover:shadow-md">
                      <div className="relative aspect-video w-full bg-church-cream-dark">
                        {thumbnail ? (
                          <Image
                            src={thumbnail}
                            alt={sermon.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-sm text-church-brown-light">
                              썸네일 없음
                            </span>
                          </div>
                        )}
                      </div>
                      <CardContent className="pt-4">
                        <h4 className="line-clamp-2 text-base font-semibold text-church-brown">
                          {sermon.title}
                        </h4>
                        <div className="mt-2 flex items-center justify-between text-sm text-church-brown-light">
                          <span>{sermon.preacher}</span>
                          <span>
                            {new Date(sermon.sermon_date).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="rounded-lg bg-white px-5 py-8 text-center border border-church-gold-light/50">
              <p className="text-sm text-church-brown-light">
                등록된 설교가 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
