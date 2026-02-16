export interface YouTubeVideo {
  id: string
  title: string
  publishedAt: string
  thumbnail: string
}

/**
 * Resolves a YouTube channel identifier to a channel ID (UC...)
 * @param input - Channel ID, handle (@handle), or YouTube URL
 * @returns Channel ID (UC...) or null if resolution fails
 */
export async function resolveChannelId(input: string): Promise<string | null> {
  // Already a channel ID
  if (input.startsWith('UC') && input.length === 24) {
    return input
  }

  try {
    // Strip @ prefix if present
    const handle = input.replace(/^@/, '')

    // Determine URL to fetch
    let url: string
    if (handle.startsWith('http')) {
      url = handle
    } else {
      url = `https://www.youtube.com/@${handle}`
    }

    // Fetch channel page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      return null
    }

    const html = await response.text()

    // Extract channel ID using regex patterns
    const patterns = [
      /"channelId":"(UC[a-zA-Z0-9_-]{22})"/,
      /<meta itemprop="channelId" content="(UC[a-zA-Z0-9_-]{22})">/,
      /"externalId":"(UC[a-zA-Z0-9_-]{22})"/
    ]

    for (const pattern of patterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  } catch (error) {
    console.error('Failed to resolve channel ID:', error)
    return null
  }
}

/**
 * Decode HTML entities in XML text
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

/**
 * Extract text content from XML tag
 */
function extractTag(entry: string, tag: string): string {
  const pattern = new RegExp(`<${tag}>([^<]+)</${tag}>`)
  const match = entry.match(pattern)
  return match ? decodeHtmlEntities(match[1].trim()) : ''
}

/**
 * Fetch recent videos from a YouTube channel's RSS feed
 * @param channelId - YouTube channel ID (UC...)
 * @param limit - Maximum number of videos to return (default: 15)
 * @returns Array of video objects
 */
export async function fetchYouTubeVideos(
  channelId: string,
  limit: number = 15
): Promise<YouTubeVideo[]> {
  try {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`

    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour (ISR)
    })

    if (!response.ok) {
      console.error(`Failed to fetch YouTube feed: ${response.status}`)
      return []
    }

    const xml = await response.text()

    // Extract all entry blocks
    const entryPattern = /<entry>([\s\S]*?)<\/entry>/g
    const entries = [...xml.matchAll(entryPattern)]

    const videos: YouTubeVideo[] = entries.map(match => {
      const entry = match[1]

      // Extract fields
      const id = extractTag(entry, 'yt:videoId')
      const title = extractTag(entry, 'title')
      const publishedAt = extractTag(entry, 'published')
      const thumbnail = `https://img.youtube.com/vi/${id}/mqdefault.jpg`

      return {
        id,
        title,
        publishedAt,
        thumbnail
      }
    })

    // Filter out invalid entries and apply limit
    return videos
      .filter(v => v.id && v.title)
      .slice(0, limit)
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error)
    return []
  }
}

/**
 * Get YouTube video URL from video ID
 * @param videoId - YouTube video ID
 * @returns Full YouTube video URL
 */
export function getVideoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}
