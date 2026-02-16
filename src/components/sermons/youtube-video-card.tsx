"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { YouTubeEmbed } from "@/components/sermons/youtube-embed"

interface YouTubeVideoCardProps {
  video: {
    id: string
    title: string
    publishedAt: string
    thumbnail: string
  }
}

export function YouTubeVideoCard({ video }: YouTubeVideoCardProps) {
  const [showPlayer, setShowPlayer] = useState(false)
  const videoUrl = `https://www.youtube.com/watch?v=${video.id}`

  return (
    <Card className="overflow-hidden border-church-gold-light bg-white transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        {showPlayer ? (
          <YouTubeEmbed url={videoUrl} title={video.title} />
        ) : (
          <button
            type="button"
            onClick={() => setShowPlayer(true)}
            className="group relative aspect-video w-full overflow-hidden"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex size-14 items-center justify-center rounded-full bg-white/90">
                <Play className="size-6 text-church-brown" />
              </div>
            </div>
          </button>
        )}

        <div className="p-4">
          <h3 className="line-clamp-2 text-base font-semibold text-church-brown">
            {video.title}
          </h3>
          <div className="mt-2 text-sm text-church-brown-light">
            <span>
              {new Date(video.publishedAt).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
