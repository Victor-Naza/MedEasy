-- ============================================================
-- Migration: tabela prescricoes
-- Execute no Supabase SQL Editor
-- ============================================================

CREATE TABLE prescricoes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  patient_name  VARCHAR(255) NOT NULL,
  patient_age   INTEGER,
  symptoms      TEXT NOT NULL,
  treatment     TEXT NOT NULL,
  ia_suggestion TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_prescricoes_user    ON prescricoes(user_id);
CREATE INDEX idx_prescricoes_created ON prescricoes(created_at DESC);

ALTER TABLE prescricoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role full access" ON prescricoes USING (true) WITH CHECK (true);
