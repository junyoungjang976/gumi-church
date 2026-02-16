import type { Metadata } from "next"
import { Sun, Church, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"

export const metadata: Metadata = {
  title: "예배안내",
}

const services = [
  {
    icon: Sun,
    name: "주일 오전 예배",
    day: "매주 일요일",
    time: "오전 11:00",
    location: "본당",
    note: "이재두 목사 설교",
  },
  {
    icon: Church,
    name: "주일 오후 모임",
    day: "매주 일요일",
    time: "오후 1:00",
    location: "본당",
    note: "1주차 찬양예배 · 2주차 신앙교실 · 3주차 가정주일 · 4주차 말씀/간증나눔",
  },
]

const infoItems = [
  "모든 예배는 본당에서 진행됩니다",
  "주차는 교회 건물 뒤편 주차장을 이용해 주세요",
  "처음 오시는 분은 안내 데스크에서 도움을 받으실 수 있습니다",
]

export default function WorshipPage() {
  return (
    <>
      <PageHeader
        title="예배안내"
        description="구미겨자씨교회 예배 시간과 장소를 안내합니다"
      />

      {/* Service Cards */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 sm:grid-cols-2">
            {services.map((service) => (
              <Card
                key={service.name}
                className="border-church-gold-light bg-white transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-church-cream-dark">
                      <service.icon className="h-5 w-5 text-church-gold" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-church-brown">
                        {service.name}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-church-brown-light">
                          <span className="font-medium text-church-brown">
                            일시:
                          </span>{" "}
                          {service.day} {service.time}
                        </p>
                        <p className="text-sm text-church-brown-light">
                          <span className="font-medium text-church-brown">
                            장소:
                          </span>{" "}
                          {service.location}
                        </p>
                        {service.note && (
                          <p className="text-sm text-church-brown-light">
                            <span className="font-medium text-church-brown">
                              비고:
                            </span>{" "}
                            {service.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="bg-church-cream-dark/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl">
            <Card className="border-church-gold-light">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-church-gold" />
                  <h3 className="text-lg font-semibold text-church-brown">
                    안내사항
                  </h3>
                </div>
                <ul className="space-y-3">
                  {infoItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-church-brown-light sm:text-base"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-church-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
