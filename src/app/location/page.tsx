import type { Metadata } from "next"
import { MapPin, Phone, Car, Bus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"
import { KakaoMap } from "@/components/location/kakao-map"

export const metadata: Metadata = {
  title: "오시는 길",
}

const contactInfo = [
  {
    icon: MapPin,
    label: "주소",
    value: "경북 구미시 봉곡북로15길 3",
  },
  {
    icon: Phone,
    label: "전화",
    value: "준비중",
  },
]

const transportInfo = [
  {
    icon: Car,
    title: "자가용",
    desc: "구미IC에서 약 10분 거리, 교회 건물 뒤편 주차장 이용",
  },
  {
    icon: Bus,
    title: "대중교통",
    desc: "구미역에서 버스 이용 (상세 노선 안내 준비중)",
  },
]

export default function LocationPage() {
  return (
    <>
      <PageHeader
        title="오시는 길"
        description="구미겨자씨교회 위치 및 교통안내"
      />

      {/* Map */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <KakaoMap />
        </div>
      </section>

      {/* Address & Contact */}
      <section className="bg-church-cream-dark/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl">
            <h3 className="mb-8 text-center text-2xl font-bold text-church-brown">
              연락처 정보
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {contactInfo.map((item) => (
                <Card
                  key={item.label}
                  className="border-church-gold-light"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-church-cream-dark">
                        <item.icon className="h-5 w-5 text-church-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-church-brown-light">
                          {item.label}
                        </p>
                        <p className="mt-1 text-base font-semibold text-church-brown">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transportation */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl">
            <h3 className="mb-8 text-center text-2xl font-bold text-church-brown">
              교통안내
            </h3>
            <div className="space-y-4">
              {transportInfo.map((item) => (
                <Card
                  key={item.title}
                  className="border-church-gold-light"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-church-cream-dark">
                        <item.icon className="h-5 w-5 text-church-gold" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-church-brown">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-sm text-church-brown-light">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
