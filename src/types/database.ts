export interface Notice {
  id: string
  title: string
  content: string
  author: string
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface Sermon {
  id: string
  title: string
  preacher: string
  scripture: string | null
  youtube_url: string
  sermon_date: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface NewcomerInquiry {
  id: string
  name: string
  phone: string | null
  email: string | null
  message: string | null
  status: 'new' | 'contacted' | 'resolved'
  created_at: string
}

export type NoticeInput = Pick<Notice, 'title' | 'content'> &
  Partial<Pick<Notice, 'author' | 'is_pinned'>>

export type SermonInput = Pick<Sermon, 'title' | 'preacher' | 'youtube_url' | 'sermon_date'> &
  Partial<Pick<Sermon, 'scripture' | 'description'>>

export type NewcomerInquiryInput = Pick<NewcomerInquiry, 'name'> &
  Partial<Pick<NewcomerInquiry, 'phone' | 'email' | 'message'>>

export interface ChurchSetting {
  key: string
  value: string
  updated_at: string
}
