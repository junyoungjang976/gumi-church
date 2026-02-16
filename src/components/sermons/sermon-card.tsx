"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Play } from "lucide-react"
import { getYouTubeThumbnail } from "@/lib/youtube"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { YouTubeEmbed } from "@/components/sermons/youtube-embed"
import type { Sermon } from "@/types/database"

interface SermonCardProps {
  sermon: Sermon
}

export function SermonCard({ sermon }: SermonCardProps) {
  const [showPlayer, setShowPlayer] = useState(false)
  const thumbnail = getYouTubeThumbnail(sermon.youtube_url)

  return (
    <Card className="overflow-hidden border-church-gold-light bg-white transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        {showPlayer ? (
          <YouTubeEmbed url={sermon.youtube_url} title={sermon.title} />
        ) : (
          <button
            type="button"
            onClick={() => setShowPlayer(true)}
            className="group relative aspect-video w-full overflow-hidden"
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={sermon.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-church-cream-dark">
                <Play className="size-12 text-church-brown-light" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex size-14 items-center justify-center rounded-full bg-white/90">
                <Play className="size-6 text-church-brown" />
              </div>
            </div>
          </button>
        )}

        <div className="p-4">
          <h3 className="line-clamp-2 text-base font-semibold text-church-brown">
            {sermon.title}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-church-brown-light">
            <span>{sermon.preacher}</span>
            <span className="text-church-gold-light">|</span>
            <span>
              {format(new Date(sermon.sermon_date), "yyyy.MM.dd")}
            </span>
          </div>
          {sermon.scripture && (
            <Badge
              variant="outline"
              className="mt-3 border-church-gold-light text-church-brown-light"
            >
              {sermon.scripture}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
