import type { Metadata } from "next"
import Image from "next/image"
import { Flame, BookOpen, Users, Sprout, Church } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"

export const metadata: Metadata = {
  title: "교회소개",
}

const visionItems = [
  {
    icon: Flame,
    title: "성령으로 행하는 교회",
    desc: "사람의 계획이 아닌 성령의 인도하심을 따릅니다. 날마다 물어보고, 순종하고, 하나님이 하시는 일에 동참합니다.",
  },
  {
    icon: BookOpen,
    title: "정직한 고백이 있는 교회",
    desc: "완벽한 척하지 않습니다. 한 사람의 솔직한 고백이 공동체 전체를 깨우는 것을 경험하는 교회입니다.",
  },
  {
    icon: Sprout,
    title: "기다림 속에 뿌리내리는 교회",
    desc: "겨자씨처럼 작지만, 하나님의 때를 신뢰하며 포기하지 않습니다. 심은 대로 거두는 약속을 붙잡습니다.",
  },
]

const historyItems = [
  { year: "1999", event: "이재두 목사, 교회 개척의 부르심을 받고 첫 예배 시작" },
  { year: "1999–2010", event: "10여 년간의 광야 시기 — 눈에 보이는 열매 없이 묵묵히 씨를 뿌린 기다림의 세월" },
  { year: "2011", event: "성령의 역사로 교회가 새롭게 일어남 — 하나님이 하신 일이 나타나기 시작" },
  { year: "현재", event: "경북 구미시 봉곡북로15길 3에서 매주 예배하며, 성령의 생기로 이 땅의 부흥을 꿈꿉니다" },
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
            구미겨자씨교회는 크고 화려한 교회를 꿈꾸지 않습니다.
            성령의 생기가 살아 있는 교회, 한 사람의 정직한 고백이
            공동체 전체를 깨우는 교회, 하나님의 때를 기다리며
            묵묵히 씨를 뿌리는 교회를 꿈꿉니다.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-church-brown-light/80">
            대한예수교장로회(백석) 소속
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
                      저는 1999년에 교회를 개척했습니다. 10년 넘게 눈에 보이는
                      열매가 없었습니다. 포기하고 싶은 날이 많았습니다.
                      그런데 하나님은 그 기다림의 시간 속에서 저를 바꾸고
                      계셨습니다. &ldquo;네 방법이 아니라 내가 한다&rdquo;는
                      것을 배우는 데 그만큼 긴 시간이 필요했습니다.
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-church-brown-light sm:text-lg">
                      우리 교회는 완벽한 사람들의 모임이 아닙니다. 깨어진
                      사람들이 정직하게 고백하고, 성령의 생기로 다시 일어서는
                      곳입니다. 교회는 목욕탕 같은 곳입니다 &mdash; 더러워진
                      채로 오셔도 됩니다. 함께 씻김 받으면 됩니다.
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-church-brown-light sm:text-lg">
                      언제든지 오세요. 있는 모습 그대로 환영합니다.
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
      {/* Church Name Meaning */}
      <section className="bg-church-cream-dark/50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-2 text-center text-sm font-medium tracking-widest text-church-gold uppercase">
            Mustard Seed
          </h2>
          <h3 className="mb-10 text-center text-2xl font-bold text-church-brown sm:text-3xl">
            &lsquo;겨자씨&rsquo;라는 이름
          </h3>

          <Card className="border-church-gold-light">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-church-cream-dark">
                  <Church className="h-7 w-7 text-church-gold" />
                </div>
                <div>
                  <blockquote className="text-base italic leading-relaxed text-church-brown-light sm:text-lg">
                    &ldquo;천국은 마치 겨자씨 한 알을 사람이 가져다가 자기 밭에 심은 것 같으니
                    이것은 모든 씨보다 작은 것이로되 자란 후에는 풀보다 커서
                    나무가 되매 공중의 새들이 와서 그 가지에 깃들이느니라&rdquo;
                  </blockquote>
                  <p className="mt-2 text-right text-sm text-church-brown-light/70">
                    마태복음 13:31-32
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-church-brown-light">
                    겨자씨는 모든 씨앗 중 가장 작습니다. 그러나 자라면 어떤 풀보다
                    크게 됩니다. 우리 교회의 이름에는 이 믿음이 담겨 있습니다.
                    크고 화려한 것을 추구하지 않지만, 하나님이 심으신 작은 씨앗이
                    반드시 큰 나무가 될 것을 믿습니다. 구미라는 이 땅에서,
                    성령의 부흥이 시작되는 것을 꿈꿉니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
