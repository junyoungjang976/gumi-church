-- busungtk-church Schema
-- Supabase Project: fgnkrhgbvohmxaetejyx (busungtk-main, Seoul)
-- All tables prefixed with church_ to avoid conflicts

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CHURCH_NOTICES
CREATE TABLE IF NOT EXISTS church_notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '관리자',
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_church_notices_created_at ON church_notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_church_notices_is_pinned ON church_notices(is_pinned DESC, created_at DESC);

-- CHURCH_SERMONS
CREATE TABLE IF NOT EXISTS church_sermons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  preacher TEXT NOT NULL DEFAULT '담임목사',
  scripture TEXT,
  youtube_url TEXT NOT NULL,
  sermon_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_church_sermons_sermon_date ON church_sermons(sermon_date DESC);

-- CHURCH_NEWCOMER_INQUIRIES
CREATE TABLE IF NOT EXISTS church_newcomer_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_church_newcomer_inquiries_status ON church_newcomer_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_church_newcomer_inquiries_created_at ON church_newcomer_inquiries(created_at DESC);

-- UPDATED_AT TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_church_notices_updated_at ON church_notices;
CREATE TRIGGER update_church_notices_updated_at
  BEFORE UPDATE ON church_notices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_church_sermons_updated_at ON church_sermons;
CREATE TRIGGER update_church_sermons_updated_at
  BEFORE UPDATE ON church_sermons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY
ALTER TABLE church_notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "church_notices_public_select" ON church_notices FOR SELECT USING (true);

ALTER TABLE church_sermons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "church_sermons_public_select" ON church_sermons FOR SELECT USING (true);

ALTER TABLE church_newcomer_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "church_newcomer_public_insert" ON church_newcomer_inquiries FOR INSERT WITH CHECK (true);
