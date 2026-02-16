-- Church settings key-value store
CREATE TABLE IF NOT EXISTS church_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default values
INSERT INTO church_settings (key, value) VALUES
  ('phone', '준비중'),
  ('email', '준비중'),
  ('address', '경북 구미시 봉곡북로15길 3')
ON CONFLICT (key) DO NOTHING;

-- RLS: public read, admin write via service_role
ALTER TABLE church_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "church_settings_public_select" ON church_settings FOR SELECT USING (true);
