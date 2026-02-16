import type { Metadata } from "next"
import { UserPlus, ClipboardList, Heart, Users } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { InquiryForm } from "@/components/newcomer/inquiry-form"

export const metadata: Metadata = {
  title: "새가족안내",
}

const steps = [
  {
    icon: UserPlus,
    step: "1",
    title: "안내데스크 방문",
    desc: "예배당 입구의 안내데스크에서 새가족 안내를 받으세요",
  },
  {
    icon: ClipboardList,
    step: "2",
    title: "새가족 등록카드 작성",
    desc: "간단한 등록카드를 작성해 주세요",
  },
  {
    icon: Heart,
    step: "3",
    title: "새가족 환영",
    desc: "담당 사역자가 따뜻하게 환영하며 교회를 안내해 드립니다",
  },
  {
    icon: Users,
    step: "4",
    title: "소그룹 안내",
    desc: "함께 신앙생활을 나눌 소그룹을 안내받으세요",
  },
]

export default function NewcomerPage() {
  return (
    <>
      <PageHeader
        title="새가족안내"
        description="구미겨자씨교회에 오신 것을 환영합니다"
      />

      {/* Welcome */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-church-brown sm:text-3xl">
              처음 오시는 분들을 진심으로 환영합니다
            </h2>
            <p className="mt-4 text-base leading-relaxed text-church-brown-light sm:text-lg">
              구미겨자씨교회는 누구나 편안하게 하나님의 사랑을 경험할 수 있는
              곳입니다. 처음 방문하시는 분들도 따뜻하게 맞이하겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Steps */}
      <section className="bg-church-cream-dark/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-center text-sm font-medium tracking-widest text-church-gold uppercase">
            Process
          </h2>
          <h3 className="mb-10 text-center text-2xl font-bold text-church-brown sm:text-3xl">
            새가족 등록 과정
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <Card
                key={item.step}
                className="border-church-gold-light bg-white text-center transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-church-cream-dark">
                    <item.icon className="h-6 w-6 text-church-gold" />
                  </div>
                  <div className="mb-2 text-sm font-bold text-church-gold">
                    STEP {item.step}
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

      {/* Inquiry Form */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-center text-sm font-medium tracking-widest text-church-gold uppercase">
            Contact
          </h2>
          <h3 className="mb-10 text-center text-2xl font-bold text-church-brown sm:text-3xl">
            문의하기
          </h3>
          <InquiryForm />
        </div>
      </section>
    </>
  )
}
