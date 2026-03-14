import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import "./globals.css"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: {
    default: "구미겨자씨교회 - 성령의 생기로 살아 움직이는 교회",
    template: "%s | 구미겨자씨교회",
  },
  description: "구미겨자씨교회 | 대한예수교장로회(백석) | 이재두 목사 | 경북 구미시 봉곡북로15길 3 | 매주 일요일 오전 11시 예배",
  keywords: ["구미겨자씨교회", "구미교회", "이재두목사", "겨자씨교회", "구미시교회", "백석교단", "경북교회"],
  openGraph: {
    title: "구미겨자씨교회",
    description: "작은 겨자씨 한 알이 자라 큰 나무가 되듯, 성령의 생기로 살아 움직이는 교회입니다",
    locale: "ko_KR",
    type: "website",
    siteName: "구미겨자씨교회",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
