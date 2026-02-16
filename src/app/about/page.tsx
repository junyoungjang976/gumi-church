import type { Metadata } from "next"
import Image from "next/image"
import { Heart, BookOpen, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"

export const metadata: Metadata = {
  title: "교회소개",
}

const visionItems = [
  {
    icon: Heart,
    title: "예배하는 교회",
    desc: "하나님께 온전한 예배를 드리는 공동체",
  },
  {
    icon: BookOpen,
    title: "말씀을 사랑하는 교회",
    desc: "말씀 위에 삶을 세워가는 공동체",
  },
  {
    icon: Users,
    title: "이웃을 섬기는 교회",
    desc: "사랑으로 이웃과 지역사회를 섬기는 공동체",
  },
]

const historyItems = [
  { year: "설립", event: "구미겨자씨교회 설립 예배" },
  { year: "성장", event: "교회학교 및 소그룹 사역 시작" },
  { year: "현재", event: "경북 구미시 봉곡북로15길 3에서 예배" },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader title="교회소개" description="구미겨자씨교회를 소개합니다" />

      {/* Vision */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-2 text-center text-sm font-medium tracking-widest text-church-gold uppercase">
            Vision
          </h2>
          <h3 className="text-center text-2xl font-bold text-church-brown sm:text-3xl">
            교회 비전
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-church-brown-light sm:text-lg">
            대한예수교장로회(백석)에 속한 건전한 교단 소속 교회로서,
            예수 그리스도 안에서 이 땅에 하나님 나라의 확장을 위해 섬기며
            작은 씨앗들의 모습 속에 풍성한 열매를 소망합니다.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visionItems.map((item) => (
              <Card
                key={item.title}
                className="border-church-gold-light bg-white text-center transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-church-cream-dark">
                    <item.icon className="h-6 w-6 text-church-gold" />
                  </div>
                  <h4 className="text-lg font-semibold text-church-brown">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm text-church-brown-light">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pastor Greeting */}
      <section className="bg-church-cream-dark/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-2 text-center text-sm font-medium tracking-widest text-church-gold uppercase">
            Greeting
          </h2>
          <h3 className="mb-10 text-center text-2xl font-bold text-church-brown sm:text-3xl">
            담임목사 인사말
          </h3>

          <div className="mx-auto max-w-4xl">
            <Card className="overflow-hidden border-church-gold-light">
              <CardContent className="p-0">
                <div className="flex flex-col items-center gap-8 p-8 sm:flex-row sm:items-start">
                  <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src="/images/pastor.jpg"
                      alt="이재두 목사"
                      fill
                      className="object-cover object-top"
                      sizes="192px"
                    />
                  </div>

                  {/* Greeting text */}
                  <div className="text-center sm:text-left">
                    <p className="text-base leading-relaxed text-church-brown-light sm:text-lg">
                      구미겨자씨교회를 방문해 주셔서 감사합니다.
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-church-brown-light sm:text-lg">
                      우리 교회는 대한예수교장로회(백석)에 속한 건전한 교단의
                      교회입니다. 예수 그리스도 안에서 이 땅에 하나님 나라의
                      확장을 위해 섬기는 교회로서, 작은 씨앗들의 모습 속에
                      풍성한 열매를 소망하는 은혜로운 교회입니다. 언제든지
                      방문해 주세요. 함께 예배하며 은혜를 나눌 수 있기를
                      기대합니다.
                    </p>
                    <p className="mt-6 text-right text-base font-semibold text-church-brown">
                      담임목사 이재두 드림
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-2 text-center text-sm font-medium tracking-widest text-church-gold uppercase">
            History
          </h2>
          <h3 className="mb-10 text-center text-2xl font-bold text-church-brown sm:text-3xl">
            교회 연혁
          </h3>

          <div className="mx-auto max-w-2xl">
            <div className="relative border-l-2 border-church-gold-light pl-8">
              {historyItems.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative ${index < historyItems.length - 1 ? "pb-8" : ""}`}
                >
                  {/* Dot */}
                  <div className="absolute -left-[calc(1rem+5px)] top-1 h-3 w-3 rounded-full border-2 border-church-gold bg-white" />
                  <p className="text-sm font-semibold text-church-gold">
                    {item.year}
                  </p>
                  <p className="mt-1 text-base text-church-brown">
                    {item.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
