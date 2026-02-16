"use client"

import { useState } from "react"

export function KakaoMap() {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-church-cream-dark">
        <div className="text-center">
          <p className="text-church-brown-light">
            지도를 불러올 수 없습니다.
          </p>
          <a
            href="https://map.kakao.com/link/map/구미겨자씨교회,36.1190,128.3446"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-church-gold underline hover:text-church-brown"
          >
            카카오맵에서 보기
          </a>
        </div>
      </div>
    )
  }

  return (
    <iframe
      src="https://map.kakao.com/link/map/구미겨자씨교회,36.1190,128.3446"
      width="100%"
      height="400"
      className="rounded-xl border border-church-gold-light"
      allowFullScreen
      loading="lazy"
      title="구미겨자씨교회 위치"
      onError={() => setHasError(true)}
    />
  )
}
