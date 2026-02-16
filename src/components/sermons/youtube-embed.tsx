"use client"

import { getYouTubeEmbedUrl } from "@/lib/youtube"

interface YouTubeEmbedProps {
  url: string
  title?: string
}

export function YouTubeEmbed({ url, title = "YouTube video" }: YouTubeEmbedProps) {
  const embedUrl = getYouTubeEmbedUrl(url)

  if (!embedUrl) return null

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  )
}
