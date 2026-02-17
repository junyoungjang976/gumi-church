-- 영상 검토 테이블
CREATE TABLE IF NOT EXISTS video_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  review_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'revision', 'rejected')),
  reviewer_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- updated_at 자동 갱신
CREATE OR REPLACE FUNCTION update_video_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER video_reviews_updated_at
  BEFORE UPDATE ON video_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_video_reviews_updated_at();

-- RLS 정책 (service_role은 우회하므로 anon 사용 시만 필요)
ALTER TABLE video_reviews ENABLE ROW LEVEL SECURITY;

-- 토큰으로 접근하는 공개 읽기
CREATE POLICY "Allow public read by token"
  ON video_reviews FOR SELECT
  USING (true);

-- 토큰으로 접근하는 공개 업데이트 (검토 결과 저장)
CREATE POLICY "Allow public update by token"
  ON video_reviews FOR UPDATE
  USING (true);

-- 인증된 사용자 전체 접근 (admin은 service_role 사용)
CREATE POLICY "Allow service role full access"
  ON video_reviews FOR ALL
  USING (true);
